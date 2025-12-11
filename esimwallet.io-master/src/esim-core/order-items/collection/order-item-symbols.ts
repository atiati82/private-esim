import type { OptionObject } from 'payload';

import { EsimProduct } from '@/data/esim-product';

import { FulfillmentStatus } from '../../fulfillment-usage/fulfillment-status';
import { getProductSupplierName } from '../../suppliers';

/** @see OrderItemDto */
export const OrderItemsCollectionId = 'orders' as const;

export const fulfillmentStatusOptions: OptionObject[] = [
  { value: FulfillmentStatus.New, label: FulfillmentStatus.New },
  { value: FulfillmentStatus.Fulfilled, label: FulfillmentStatus.Fulfilled },
  { value: FulfillmentStatus.Processing, label: FulfillmentStatus.Processing },
  { value: FulfillmentStatus.Cancelled, label: FulfillmentStatus.Cancelled },
  { value: FulfillmentStatus.Expired, label: FulfillmentStatus.Expired },
  { value: FulfillmentStatus.Error, label: FulfillmentStatus.Error },
];

export function generateOrderItemTitle(id: string, product: EsimProduct): string {
  return `${id} - ${product.name} - ${product.provider.name}, ${getProductSupplierName(product.supplier, true)}`;
}
