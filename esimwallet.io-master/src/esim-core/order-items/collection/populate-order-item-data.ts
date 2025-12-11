import type { CollectionBeforeValidateHook } from 'payload';

import { findProductById } from '@/data/find-products';
import { amountToCents } from '@/lib/esim-wallet';
import { OrderItemDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';

import { makeTransactionId } from '@/feat-ordering/transactions/transactions';
import { initFulfillmentStatus } from '../../fulfillment-usage/fulfillment-status';
import { makeOrderItemId } from '../../order-items/order-item';
import { generateOrderItemTitle } from './order-item-symbols';

/**
 * Base on OrderItem's product, populate all Order necessary fields.
 *
 * We could do all that in {@link prepareNewOrderItemDto} invoked during checkout process.
 * But we split it into here and there, so we can allow adding manual orders via CMS
 * (so the user doesn't have to fill all that data manually).
 *
 * PS. No need to test it really - if something is missing, it'll be picked in tests
 * for {@link checkoutEndpoint}, which is pretty heavily tested.
 *
 * @see prepareNewOrderItemDto
 * @see checkoutEndpoint
 */
export const populateOrderItemData: CollectionBeforeValidateHook<OrderItemDto> = async ({
  data: dto = {},
  req: { payload },
  originalDoc = {},
}) => {
  // This will be only called during create operation
  // (or when, for some reason someone updates the order product)
  if (dto.product && dto.product !== (originalDoc as OrderItemDto).product) {
    const product = await findProductById(payload, getRelationIdVal(dto.product)!);
    if (!product) {
      throw new Error(
        `Error while populating OrderItem data. Could not find product ID: ${dto.product}.`,
      );
    }

    // If ID is empty, it means the OrderItem is created manually in the CMS.
    // In such case (manual order entry), to avoid any ID conflicts, we simply create a new Transaction ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id: string = ((dto as any)._id =
      (dto as any)._id || dto.id || makeOrderItemId(makeTransactionId(), 0)); // eslint-disable-line @typescript-eslint/no-explicit-any

    dto.title = generateOrderItemTitle(id, product);
    dto.price = amountToCents(product.productPricing.listPrice);
    dto.supplierPrice = amountToCents(product.productPricing.supplierPrice);
    dto.fulfillment = {
      supplier: product.supplier,
      status: initFulfillmentStatus,
      supplierProductId: product.supplierProductId,
      ...(dto.fulfillment ?? {}),
    };
    // console.log('POPULATE ORDER ITEM, generated DTO:\n', dto);
  }
  return dto;
};
