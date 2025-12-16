import {
  EsimPlanKyC,
  EsimPlanMaxSpeed,
  EsimPlanType,
  EsimProductType,
  makeProductId,
} from '@/data/esim-product';
import type { RegionId } from '@/data/region';
import { isTestingEnv } from '@/env-helpers';
import { ProductSupplier } from '@/esim-core/suppliers';
import { getCliLogger, LoggerName } from '@/lib/logging';
import { DestinationDto, EsimProductDto, EsimProductPricing } from '@/payload/app-types';
import { findByCountryId } from '@/payload/import-destinations/makeDestinations';
import { getRelationIdVal } from '@/payload/utils/data-utils';
import { OmitPayloadFields } from '@/payload/utils/omit-payload-fields';

import { mmMakeProvider } from '../import-providers/import-providers';
import {
  MmProduct,
  MmProductCategory,
  MmProductDetailsType,
  MmSandboxProductId,
} from '../mm-products.types';
import { getCleanProductDetail, getCleanProductDetailsEntries } from './get-clean-product-detail';
import { makeProductInfoFromText } from './make-product-info-from-text';

export type EsimProductDtoForCreation = OmitPayloadFields<EsimProductDto> & { id?: string };

interface Context {
  /**
   * When present, we do product sync, instead of product creation
   */
  existingProduct?: EsimProductDto;

  /**
   * Number of available top-up eSIMs for given product
   * (calculated outside)
   */
  availableTopUps?: number;

  /**
   * List of valid Destination objects, to be matched when creating products
   */
  destinations: DestinationDto[];
}

/**
 * Make valid/clean EsimProductDto from MobiMatter product data
 */
export function mmMakeProduct(
  mmProduct: MmProduct,
  context: Context = { destinations: [] },
): EsimProductDtoForCreation {
  let productSoFar: EsimProductDtoForCreation = {
    name: getCleanProductDetail(mmProduct, MmProductDetailsType.PlanTitle) ?? 'N/A',
    productType: makeProduct_type(mmProduct),
    provider: mmMakeProvider(mmProduct).id,
    productFamily: mmProduct.productFamilyName ? mmProduct.productFamilyName : '-',
    productFamilyTopUpsCount: context.availableTopUps ?? 0,

    destinations: makeProduct_destinations(mmProduct, context.destinations),
    regions: [],

    productPricing: makeProduct_pricing(mmProduct),
    productAttributes: [],

    // Plan Type is determined separately later on inside makeProduct_planType()
    // because e.g. info about Voice minutes can be hidden in the plan description(s)
    planType: EsimPlanType.DataOnly,
    planValidity: Number(getCleanProductDetail(mmProduct, MmProductDetailsType.PlanValidity)) || 0,
    planDataAllowance: makeProduct_dataAllowance(mmProduct),
    planVoiceAllowance: makeProduct_voiceAllowance(mmProduct),
    planMaxSpeed: makeProduct_planMaxSpeed(mmProduct),
    planKycPolicy: EsimPlanKyC.No,

    // supplier data
    supplier: ProductSupplier.MobiMatter,
    supplierProductId: mmProduct.productId,
    supplierProductCreationDate: mmProduct.created,
    supplierProductLastUpdate: mmProduct.updated,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supplierImportData: makeProduct_supplierImportData(mmProduct) as any,

    usageTracking: getCleanProductDetail(mmProduct, MmProductDetailsType.UsageTracking) ?? false,
  };

  productSoFar = makeProduct_withDataExtractedFromText(mmProduct, productSoFar);
  productSoFar.regions = makeProduct_regions(productSoFar, context.destinations);

  productSoFar.id = makeProductId(productSoFar as EsimProductDto);

  productSoFar = makeProduct_sandboxProduct(mmProduct, productSoFar);

  // Make a product update, instead of product creation data
  if (context.existingProduct) {
    return makeProduct_update(productSoFar, context.existingProduct);
  } else {
    return productSoFar;
  }
}

/**
 * Prepare product for update/syncing (for existing products)
 */
function makeProduct_update(
  newProduct: EsimProductDtoForCreation,
  existingProduct: EsimProductDto,
): EsimProductDtoForCreation {
  newProduct.name = existingProduct.name || newProduct.name; // Name can be edited in CMS - so existing value has precedence
  return newProduct;
}

/**
 * Make special amendments for the *Test 1GB* package {@link MmSandboxProductId}.
 * This package doesn't cost us money, when ordering from MobiMatter (kinda sandbox product).
 */
function makeProduct_sandboxProduct(
  mmProduct: MmProduct,
  productSoFar: EsimProductDtoForCreation,
): EsimProductDtoForCreation {
  if (mmProduct.productId === MmSandboxProductId) {
    productSoFar.destinations = [...productSoFar.destinations!, 'id', 'pl', 'ru', 'sg', 'th', 'fj'];
    productSoFar.regions = ['europe', 'asia'] as RegionId[];
  }
  return productSoFar;
}

function makeProduct_type(mmProduct: MmProduct): EsimProductType {
  switch (mmProduct.productCategory) {
    case MmProductCategory.eSIM:
      return EsimProductType.eSIM;
    case MmProductCategory.eSIMdelayed:
      return EsimProductType.eSIMdelayed;
    case MmProductCategory.TopUp:
      return EsimProductType.TopUp;
    case MmProductCategory.Replacement:
      return EsimProductType.Replacement;
    default:
      throw new Error(`Can't detect product type from MobiMatter ${mmProduct.productCategory}.`);
  }
}

function makeProduct_destinations(mmProduct: MmProduct, destinations: DestinationDto[]): string[] {
  const destinationIds: string[] = mmProduct.countries
    .map((c) => {
      const foundDestination = destinations.find(findByCountryId(c));
      if (!foundDestination) {
        // TODO: Product Checker, add some error there some the product can be revised
        !isTestingEnv &&
          getCliLogger(LoggerName.MobiMatterProductsImport).error(
            `[ProductID:${mmProduct.productId}] Couldn't find a matching destination for it (tried to look up for '${c}').`,
          );
      }
      return foundDestination?.id ?? c.toLowerCase();
    })
    .filter(Boolean);

  // There are some cases in MM data where we have duplicate of destinations...
  return [...new Set(destinationIds)];
}

/**
 * Based on already assembled destinations, infer regions info from them
 */
function makeProduct_regions(
  productSoFar: EsimProductDtoForCreation,
  destinations: DestinationDto[],
): string[] {
  const regionIds = productSoFar
    .destinations!.map((destinationId) => {
      const destination = destinations.find((d) => d.id === destinationId);
      return getRelationIdVal(destination?.region);
    })
    .filter(Boolean) as string[];
  return [...new Set(regionIds)];
}

function makeProduct_dataAllowance(mmProduct: MmProduct): number {
  return Number(getCleanProductDetail(mmProduct, MmProductDetailsType.PlanDataLimit) ?? 0);
}

function makeProduct_voiceAllowance(mmProduct: MmProduct): number {
  return Number(getCleanProductDetail(mmProduct, MmProductDetailsType.PlanVoiceLimit) ?? 0);
}

function makeProduct_planMaxSpeed(mmProduct: MmProduct): EsimPlanMaxSpeed {
  const is5G = getCleanProductDetail(mmProduct, MmProductDetailsType.FiveG);
  return is5G ? EsimPlanMaxSpeed['5G'] : EsimPlanMaxSpeed['4G'];
}

function makeProduct_supplierImportData(mmProduct: MmProduct): MmProduct {
  return {
    ...mmProduct,
    productDetails: getCleanProductDetailsEntries(mmProduct),
  };
}

function makeProduct_pricing(mmProduct: MmProduct): EsimProductPricing {
  const listPrice = Number(mmProduct.retailPrice);
  return {
    listPrice: listPrice < 1 ? 0.99 : listPrice,
    supplierPrice: Number(mmProduct.wholesalePrice),
    competitorPrices: {}, // Future: store competitors' prices (e.g. HolaFly, Airalo etc)
  };
}

function makeProduct_withDataExtractedFromText(
  mmProduct: MmProduct,
  productSoFar: EsimProductDtoForCreation,
): EsimProductDtoForCreation {
  const product = { ...productSoFar };
  const {
    productData: { productAttributes, kycPolicy, suggestedPlanType, planVoiceAllowance },
    itemsUnprocessed,
  } = makeProductInfoFromText(mmProduct);

  if (itemsUnprocessed.length) {
    // TODO: warn, mark for product checker
  }

  product.productAttributes = [...product.productAttributes!, ...productAttributes];
  product.planKycPolicy = kycPolicy ?? product.planKycPolicy;

  // If planVoiceAllowance is already present, use that value
  // (it's probably more accurate than what we extracted from text)
  product.planVoiceAllowance =
    planVoiceAllowance && !product.planVoiceAllowance
      ? planVoiceAllowance
      : product.planVoiceAllowance;

  if (suggestedPlanType) {
    product.planType = suggestedPlanType;
  } else {
    product.planType =
      product.planDataAllowance && product.planVoiceAllowance
        ? EsimPlanType.VoiceAndData
        : product.planVoiceAllowance
          ? EsimPlanType.VoiceOnly
          : EsimPlanType.DataOnly;
  }

  return product;
}
