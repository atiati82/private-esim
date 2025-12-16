import { EsimProduct } from '@/data/esim-product';
import { makeOrderItemId } from '@/esim-core/order-items/order-item';
import { EsimProductDto, OrderItemDto, UserDto } from '@/payload/app-types';
import { OmitPayloadFields } from '@/payload/utils/omit-payload-fields';

export type OrderDtoForCreation = OmitPayloadFields<OrderItemDto> & { id?: string };

export type NewOrderItemContext = {
  transactionId: string;
  product: EsimProduct | EsimProductDto;
  user: UserDto;
  /**
   * Order Item number (position) in the transaction
   */
  idx: number;
};

/**
 * Prepare a new / minimal {@link OrderItemDto} during checkout process,
 * to be inserted into PayloadCMS.
 *
 * This works in conjunction with {@link populateOrderItemData} where remaining
 * fields are fulfilled (mostly, from {@link EsimProduct} data). This is to allow
 * smooth / consistent creation of OrderItems from CMS (so-called manual entry).
 *
 * @see populateOrderItemData
 * @see createNewTransactionAndOrderItems
 * @see checkoutEndpoint
 */
export function prepareNewOrderItemDto(context: NewOrderItemContext): OrderDtoForCreation {
  const { transactionId, user, product, idx } = context;

  /**
   * Only essential fields here - the rest is populated in {@link populateOrderItemData}
   */
  return {
    id: makeOrderItemId(transactionId, idx),
    user: user.id,
    transaction: transactionId,
    product: product.id,
  } as OrderDtoForCreation;
}
