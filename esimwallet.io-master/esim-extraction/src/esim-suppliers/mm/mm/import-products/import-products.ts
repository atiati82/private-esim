import type { Payload } from 'payload';

import { ProductSupplier } from '@/esim-core/suppliers';
import { getCliLogger, LoggerName } from '@/lib/logging';
import { EsimProductDto } from '@/payload/app-types';
import { DestinationsCollectionId, EsimProductsCollectionId } from '@/payload/collections';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { MmProduct, MmProductCategory } from '../mm-products.types';
import { EsimProductDtoForCreation, mmMakeProduct } from './make-product';

/**
 * Import MM products
 * @returns list of created and/or updated EsimProducts
 */
export async function importMobiMatterProducts(
  mmData: MmProduct[],
  cleanImport?: boolean,
): Promise<[number, number]> {
  const log = getCliLogger(LoggerName.MobiMatterProductsImport);
  const payload = await appGetPayloadStandalone();

  if (cleanImport) {
    log.warn(`CLEAN IMPORT REQUESTED, CLEARING DATABASE...`);
    await payload.delete({ collection: EsimProductsCollectionId, where: {} });
  }

  const dbProducts = await payload.find({
    collection: EsimProductsCollectionId,
    where: { supplier: { equals: ProductSupplier.MobiMatter } },
    pagination: false,
  });
  const dbDestinations = await payload.find({
    collection: DestinationsCollectionId,
    pagination: false,
  });
  const [productsToSync, newProductsToImport] = getProductsToProcess(mmData, dbProducts.docs);
  const [_, relevantProducts] = getProductsToProcess(mmData, []);
  const productsToProcess = [...productsToSync, ...newProductsToImport];
  const productsToProcessCount = productsToProcess.length;

  log.info(`\t${mmData.length} products received from MobiMatter`);
  log.info(`\t${relevantProducts.length} products are relevant`);
  log.info(`\t${dbProducts.totalDocs} products currently in database`);
  log.info(`\t${productsToSync.length} products need syncing`);
  log.info(`\t${newProductsToImport.length} new products to import`);
  log.warn('\tTODO: XXX products to deactivate/unpublish');
  log.info(`\t${dbDestinations.totalDocs} destinations in database`);

  const topUpsData = getFamilyTopUpsBreakdown(mmData);
  let productsSuccessfullyProcessedCount = 0;
  for (const [idx, mmProduct] of productsToProcess.entries()) {
    const existingProduct = dbProducts.docs.find(
      (p) => p.supplierProductId === mmProduct.productId,
    );
    const logLabel = `${idx + 1}/${productsToProcessCount}: ${existingProduct ? 'Syncing' : 'Importing'}`;
    log.info(`${logLabel} product ${mmProduct.productId}`);

    try {
      const productFamily = mmProduct.productFamilyName;
      const product = mmMakeProduct(mmProduct, {
        existingProduct,
        destinations: dbDestinations.docs,
        availableTopUps: topUpsData[productFamily],
      });
      log.debug(`\tProduct ${product.name} (${product.productType}) prepared.`);
      const resProduct = await importOrSyncEsimProduct(payload, product, existingProduct?.id);
      productsSuccessfullyProcessedCount++;
      log.info(`\tSuccess ${existingProduct ? 'syncing' : 'importing'} ${resProduct.name}.`);
    } catch (e) {
      log.error(`\tError while importing/syncing product ${mmProduct.productId}`);
      log.error(e);
    }
  }

  return [productsSuccessfullyProcessedCount, productsToProcessCount];
}

/**
 * Get number of available top-ups, per product family
 */
export function getFamilyTopUpsBreakdown(mmProducts: MmProduct[]): Record<string, number> {
  const topUpsData: Record<string, number> = {};
  mmProducts
    .filter((product) => product.productCategory === MmProductCategory.TopUp)
    .forEach((product) => {
      const productFamily = product.productFamilyName;
      topUpsData[productFamily] = (topUpsData[productFamily] ?? 0) + 1;
    });
  return topUpsData;
}

export async function importOrSyncEsimProduct(
  payload: Payload,
  productData: EsimProductDtoForCreation,
  existingProductId: string | undefined,
): Promise<EsimProductDto> {
  if (existingProductId) {
    return payload.update({
      collection: EsimProductsCollectionId,
      id: existingProductId,
      // For some reason Payload doesn't accept this data arg...
      // TODO: review at some point, should be fixed in Payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: productData as any,
    });
  } else {
    return payload.create({
      collection: EsimProductsCollectionId,
      data: productData,
    });
  }
}

/**
 * Get products to sync and/or new products to import
 * @returns [productsToSync, productsToImport]
 */
export function getProductsToProcess(
  mmData: MmProduct[],
  existingProducts: EsimProductDto[],
): [MmProduct[], MmProduct[]] {
  const logger = getCliLogger(LoggerName.MobiMatterProductsImport);
  const productsToSync: MmProduct[] = [];
  const newProductsToImport: MmProduct[] = [];

  mmData.forEach((mmProduct) => {
    const isRelevantProduct =
      mmProduct.productCategory === MmProductCategory.eSIM ||
      mmProduct.productCategory === MmProductCategory.eSIMdelayed ||
      mmProduct.productCategory === MmProductCategory.TopUp;
    if (!isRelevantProduct) {
      logger.warn(`WARNING: Product to process [${mmProduct.productId}] has`);
      logger.warn(
        `\tunsupported product type *${mmProduct.productCategoryId}:${mmProduct.productCategory}*`,
      );
      return;
    }

    const existingProduct = existingProducts.find(
      (p) => p.supplierProductId === mmProduct.productId,
    );
    if (existingProduct) {
      const updatedDate = Math.floor(new Date(mmProduct.updated).getTime() / 1000);
      const existingProductDate = Math.floor(
        new Date(existingProduct.supplierProductLastUpdate).getTime() / 1000,
      );

      if (updatedDate > existingProductDate) {
        productsToSync.push(mmProduct);
      }
    } else {
      newProductsToImport.push(mmProduct);
    }
  });

  return [productsToSync, newProductsToImport];
}
