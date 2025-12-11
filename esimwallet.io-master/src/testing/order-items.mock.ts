import { makeEsimProductObj } from '@/data/esim-product';
import { FulfillmentStatus } from '@/esim-core/fulfillment-usage/fulfillment-status';
import { generateOrderItemTitle } from '@/esim-core/order-items/collection';
import { makeOrderItemObj, OrderItem, OrderItemIdPrefix } from '@/esim-core/order-items/order-item';
import { amountToCents } from '@/lib/esim-wallet';
import { OrderFulfillment, OrderItemDto } from '@/payload/app-types';
import { getRelationIdVal, isObject } from '@/payload/utils/data-utils';

import { makeTransactionId } from '@/feat-ordering/transactions/transactions';
import { mockProductDto } from './products.mock';
import { mockUserDto } from './users.mock';

export function mockOrderItem(dto: Partial<OrderItemDto> = {}): OrderItem {
  return makeOrderItemObj(mockOrderItemDto(dto));
}

export function mockOrderItemDto(dto: Partial<OrderItemDto> = {}): OrderItemDto {
  const id = `${OrderItemIdPrefix}-mock-order-item-${++_lastOrderItemIdSeq}`;
  const product = isObject(dto.product) ? dto.product : mockProductDto();

  const fulfillment: OrderFulfillment = {
    status: FulfillmentStatus.New,
    supplier: product.supplier,
    supplierProductId: product.supplierProductId,
    ...dto.fulfillment,
  };

  return {
    id,
    title: generateOrderItemTitle(id, makeEsimProductObj(product)),
    user: mockUserDto,
    product: getRelationIdVal(product)!,

    transaction: dto.transaction ?? makeTransactionId(),
    price: amountToCents(product.productPricing.listPrice),
    supplierPrice: amountToCents(product.productPricing.supplierPrice),

    createdAt: '',
    updatedAt: '',

    ...dto,

    fulfillment,
  };
}
let _lastOrderItemIdSeq = 0;
