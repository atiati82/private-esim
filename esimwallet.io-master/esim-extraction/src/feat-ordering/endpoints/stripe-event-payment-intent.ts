import { BasePayload } from 'payload';
import { Stripe } from 'stripe';

import { OrderItemsCollectionId } from '@/esim-core/order-items/collection/order-item-symbols';

import { TransactionsCollectionId } from '@/feat-ordering/transactions/collection';
import { eSIMwalletTransactionIdInMetadata } from '@/feat-ordering/utils-ordering';

/**
 * Called from {@link stripeEventsEndpoint}.
 *
 * Update {@link TransactionDto} and {@link OrderItemDto}(s)
 */
export async function stripeEventPaymentIntent(
  payload: BasePayload,
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  const transactionId = paymentIntent.metadata[eSIMwalletTransactionIdInMetadata];

  const logger = payload.logger;
  logger.info(`STRIPE HOOK: received PaymentIntent '${paymentIntent.id}' event`);
  logger.info(`\tfor transaction ${transactionId}. Payment Status: ${paymentIntent.status}`);

  // Update Transaction record itself, set the payment ref and status
  await payload.update({
    collection: TransactionsCollectionId,
    id: transactionId,
    data: {
      paymentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    },
  });

  // Also update individual order items, so we have payment status there as well
  await payload.update({
    collection: OrderItemsCollectionId,
    where: {
      transaction: { equals: transactionId },
    },
    data: {
      transactionPaymentStatus: paymentIntent.status,
    },
  });
}
