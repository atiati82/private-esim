import { beforeEach, describe, expect, test } from 'vitest';
import { FieldHookArgs, PayloadRequest } from 'payload';

import { EsimProductType } from '@/data/esim-product';
import { EsimProductDto } from '@/payload/app-types';

import { mockPayloadEndpointRequest } from '@/testing/mock-payload-request';
import {
  mockOrderItemInPayload,
  mockOrderWithProductInPayload,
} from '@/testing/order-items-in-payload';
import { mockProductInPayload } from '@/testing/products-in-payload';
import { PopulatedOrderedPackageItem, populateOrderedPackages } from './populate-ordered-packages';

describe('eSIM cards: FieldHook: orderedPackages', function () {
  let req: PayloadRequest;
  beforeEach(async () => (req = await mockPayloadEndpointRequest()));

  /**
   * Prepare obj with necessary FieldHook arguments / values
   */
  const hookArgs = (value: { orderItem: string }[]): FieldHookArgs =>
    ({
      value,
      req,
    }) as FieldHookArgs;

  test('should ignore non-existing/invalid orders', async () => {
    const args = hookArgs([{ orderItem: 'invalid-order-id' }]);
    const res = (await populateOrderedPackages(args)) as PopulatedOrderedPackageItem[];
    expect(res).toEqual([]);
  });

  test('should throw if 1st order is not for eSIM starter', async () => {
    const order = await mockOrderWithProductInPayload({
      product: { productType: EsimProductType.TopUp } as EsimProductDto,
    });
    const args = hookArgs([{ orderItem: order.id }]);
    await expect(populateOrderedPackages(args)).rejects.toThrowError(
      /1st order must be an eSIM starter/,
    );
  });

  test('should throw if more than one eSIM starter', async () => {
    const order0 = await mockOrderWithProductInPayload({
      product: { productType: EsimProductType.eSIM } as EsimProductDto,
    });
    const order1 = await mockOrderWithProductInPayload({
      product: { productType: EsimProductType.eSIMdelayed } as EsimProductDto,
    });
    const args = hookArgs([{ orderItem: order0.id }, { orderItem: order1.id }]);
    await expect(populateOrderedPackages(args)).rejects.toThrowError(
      /there should be only 1 eSIM starter/,
    );
  });

  test('should populate ordered items', async () => {
    const order = await mockOrderWithProductInPayload({
      product: { productType: EsimProductType.eSIMdelayed } as EsimProductDto,
    });
    const args = hookArgs([{ orderItem: order.id }]);
    const res = (await populateOrderedPackages(args)) as PopulatedOrderedPackageItem[];
    expect(res.length).toBe(1);
    expect(res[0].orderItem).toBe(order.id);
    expect(res[0].productType).toBe(EsimProductType.eSIMdelayed);
    expect(res[0].productName).toBe((order.product as EsimProductDto).name);

    // add one more item, this one a TopUp
    const orderTopUp = await mockOrderWithProductInPayload({
      product: { productType: EsimProductType.TopUp } as EsimProductDto,
    });
    const argsWithTopUp = hookArgs([{ orderItem: orderTopUp.id }, ...res]);
    const resWithTopUp = (await populateOrderedPackages(
      argsWithTopUp,
    )) as PopulatedOrderedPackageItem[];
    expect(resWithTopUp.length).toBe(2);
    expect(resWithTopUp[0].orderItem).toBe(orderTopUp.id);
    expect(resWithTopUp[0].productType).toBe(EsimProductType.TopUp);
    expect(resWithTopUp[0].productName).toBe((orderTopUp.product as EsimProductDto).name);
    expect(resWithTopUp[1].orderItem).toBe(order.id);
    expect(resWithTopUp[1].productType).toBe(EsimProductType.eSIMdelayed);
    expect(resWithTopUp[1].productName).toBe((order.product as EsimProductDto).name);
  });

  test('should filter out duplicated orders', async () => {
    const orderStarter = await mockOrderItemInPayload({
      product: await mockProductInPayload({
        productType: EsimProductType.eSIM,
      }),
    });
    const orderTopUp = await mockOrderItemInPayload({
      product: await mockProductInPayload({
        productType: EsimProductType.TopUp,
      }),
    });
    const args = hookArgs([
      { orderItem: orderTopUp.id },
      { orderItem: orderTopUp.id },
      { orderItem: orderStarter.id },
    ]);
    const res = (await populateOrderedPackages(args)) as PopulatedOrderedPackageItem[];
    expect.soft(res.length).toBe(2);
    expect.soft(res[0]).toMatchObject(<PopulatedOrderedPackageItem>{
      orderItem: orderTopUp.id,
      productType: EsimProductType.TopUp,
    });
    expect.soft(res[1]).toMatchObject(<PopulatedOrderedPackageItem>{
      orderItem: orderStarter.id,
      productType: EsimProductType.eSIM,
    });
  });
});
