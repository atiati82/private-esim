import type { Payload, Where } from 'payload';

import { EsimProduct, EsimProductType, makeEsimProductObj } from '@/data/esim-product';
import { EsimProductsCollectionId } from '@/payload/collections';

import { TravelerCardCountriesCountLimit } from '@/feat-products-listing/product-list-helpers';

export async function findProductById(payload: Payload, id: string): Promise<EsimProduct> {
  const res = await payload.findByID({
    collection: EsimProductsCollectionId,
    id,
  });
  return makeEsimProductObj(res);
}

type FindProductsConditions = {
  ids?: string[];
  productType?: EsimProductType;
  destinations?: string[];
  region?: string;
  productFamily?: string;
};
/**
 * Find products for given destination (id)
 */
export async function findProducts(
  payload: Payload,
  cond: FindProductsConditions = {},
): Promise<EsimProduct[]> {
  const where: Where = {};
  if (cond.ids?.length) {
    where.id = { in: cond.ids };
  }
  if (cond.productType) {
    where.productType = { equals: cond.productType };
  }
  if (cond.destinations?.length) {
    where.destinations = { in: cond.destinations };
  }
  if (cond.region) {
    where.regions = { contains: cond.region };
  }
  if (cond.productFamily) {
    where.productFamily = { equals: cond.productFamily };
  }

  const res = await payload.find({
    collection: EsimProductsCollectionId,
    where,
    limit: 9999,
  });
  return res.docs.map(makeEsimProductObj);
}

export async function findAllGlobalProducts(payload: Payload): Promise<EsimProduct[]> {
  const res = await payload.find({
    collection: EsimProductsCollectionId,
    where: { productType: { equals: EsimProductType.eSIM } },
    limit: 999,
  });
  return res.docs
    .filter((p) => (p.destinations?.length || 0) > TravelerCardCountriesCountLimit)
    .map(makeEsimProductObj);
}
