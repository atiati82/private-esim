import { describe, expect, test } from 'vitest';

import { MmFulfillmentService } from '@/esim-suppliers/mm/mm-fulfillment/mm-fulfillment.service';
import { mockOrderItemDto } from '@/testing/order-items.mock';
import { makeOrderItemObj } from '../order-items/order-item';
import { ProductSupplier } from '../suppliers';
import { FulfillmentFactoryService } from './fulfillment-factory.service';

describe('fulfillment-factory.service:', function () {
  test('create() should create service for given supplier', () => {
    const orderItem = makeOrderItemObj(mockOrderItemDto());
    const service = FulfillmentFactoryService.create(orderItem);
    expect(service).toBeInstanceOf(MmFulfillmentService);
  });

  test('create() should throw for unsupported supplier', () => {
    const dto = mockOrderItemDto();
    dto.fulfillment.supplier = 'unsupported-supplier' as ProductSupplier;
    const orderItem = makeOrderItemObj(dto);
    expect(() => FulfillmentFactoryService.create(orderItem)).toThrowError(/unsupported supplier/);
  });
});
