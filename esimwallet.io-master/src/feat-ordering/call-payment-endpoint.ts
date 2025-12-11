import { throwErrorIfErroneousResponse } from '@/lib/responses';

import { TransactionsCollectionId } from '@/feat-ordering/transactions/collection';
import type { TransactionPaymentStatuses } from '@/feat-ordering/transactions/transaction-symbols';

/**
 * FE data received from our API upon creating new Payment Intent
 */
export interface CallCreatePaymentResponse {
  paymentId: string;
  paymentStatus: TransactionPaymentStatuses;
  isNew: boolean;
  customerId: string;
  clientSecret: string;
  amount: number;
}

/**
 * Call to /api/ to create Stripe Payment Intent, after which we can show Stripe payment Elements.
 *
 * @see paymentEndpoint
 */
export async function callPaymentEndpoint(
  transactionId: string,
): Promise<CallCreatePaymentResponse> {
  const url = `/api/${TransactionsCollectionId}/${transactionId}/payment`;
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(throwErrorIfErroneousResponse)
    .then((res) => res.json());
}
