import isEqual from 'lodash/isEqual';

import { EsimProduct } from '@/data/esim-product';
import { findProducts } from '@/data/find-products';
import { findRegions } from '@/data/find-regions';
import { Region } from '@/data/region';
import { getCliLogger, LoggerName } from '@/lib/logging';
import { RegionsCollectionId } from '@/payload/collections';
import { getRelationIdVal } from '@/payload/utils/data-utils';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { collectProductStats } from './collect-product-stats';

export async function regionsUpdateWithExtraData(): Promise<void> {
  const logger = getCliLogger(LoggerName.MobiMatterProductsImport);
  const payload = await appGetPayloadStandalone();
  const dbProducts: EsimProduct[] = await findProducts(payload);
  const dbRegions: Region[] = await findRegions(payload);

  let updatesCounter = 0;
  try {
    for (const region of dbRegions) {
      const localProducts: EsimProduct[] = dbProducts.filter((product) =>
        product.regions.map(getRelationIdVal).includes(region.id),
      );

      const productStats = collectProductStats(localProducts);
      const needsUpdate = !isEqual(productStats, region.productStats);
      if (!needsUpdate) {
        continue;
      }

      await payload.update({
        collection: RegionsCollectionId,
        id: region.id,
        data: { productStats },
      });
      updatesCounter++;
    }
  } catch (e) {
    const err = e as Error;
    logger.error(err.name);
    logger.error(err.message);
  }

  logger.info(`\tAdded products stats to ${updatesCounter} Regions.`);
}
