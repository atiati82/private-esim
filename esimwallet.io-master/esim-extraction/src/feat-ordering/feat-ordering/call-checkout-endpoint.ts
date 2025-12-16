import { throwErrorIfErroneousResponse } from '@/lib/responses';

import { CartState } from '@/feat-cart/cart.store';
import { TransactionsCollectionId } from '@/feat-ordering/transactions/collection';

/**
 * FE data received from our API upon uploading CartState and
 * creating new {@link TransactionDto} and {@link OrderItemDto} records.
 */
export interface CallCheckoutResponse {
  /**
   * Created (or recycled, last unpaid) {@link TransactionDto} for this cart state
   */
  transactionId: string;

  /**
   * Indicates that new/fresh {@link TransactionDto} record has been created
   * (instead of re-using previous Transaction record, with the same CartState)
   */
  isNew: boolean;

  /**
   * {@link OrderItemDto}(s) for this checkout / {@link TransactionDto}.
   */
  orderItems: string[];

  /**
   * Amount to pay (in cents), for all items from the cart
   */
  total: number;
}

/**
 * Call to /api/ to create a new transaction in the CMS,
 * with cart state (cart items) uploaded there.
 *
 * @see checkoutEndpoint
 */
export async function callCheckoutEndpoint(cartState: CartState): Promise<CallCheckoutResponse> {
  const url = `/api/${TransactionsCollectionId}/checkout`;
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartState),
  })
    .then(throwErrorIfErroneousResponse)
    .then((res) => res.json());
}
