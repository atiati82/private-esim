import { beforeAll, describe, expect, test } from 'vitest';

import { EsimProductType } from '@/data/esim-product';
import { findProducts } from '@/data/find-products';
import { EsimProductDto } from '@/payload/app-types';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { mockProductInPayload } from '@/testing/products-in-payload';

describe('find-products:', function () {
  let product0: EsimProductDto;
  let product1: EsimProductDto;
  let product2: EsimProductDto;
  let topUpProduct: EsimProductDto;
  beforeAll(async () => {
    product0 = await mockProductInPayload({ productType: EsimProductType.eSIM });
    product1 = topUpProduct = await mockProductInPayload({ productType: EsimProductType.TopUp });
    product2 = await mockProductInPayload();
  });

  test('findProducts: all products', async () => {
    const payload = await appGetPayloadStandalone();
    const res = await findProducts(payload);
    expect(res.length).toBeGreaterThanOrEqual(3);
  });

  test('findProducts: by IDs', async () => {
    const payload = await appGetPayloadStandalone();
    const res = await findProducts(payload, { ids: [product0.id, product1.id] });
    expect(res.length).toBe(2);
    const resSingle = await findProducts(payload, { ids: [product2.id] });
    expect(resSingle.length).toBe(1);
    expect(resSingle[0].id).toBe(product2.id);
  });

  test('findProducts: by productType', async () => {
    const payload = await appGetPayloadStandalone();
    const res = await findProducts(payload, { productType: EsimProductType.TopUp });
    const foundProduct = res.find(
      (p) => p.id === topUpProduct.id && p.productType === EsimProductType.TopUp,
    );
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.id).toBe(topUpProduct.id);
  });
});
