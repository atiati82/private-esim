import { describe, expect, test } from 'vitest';
import Stripe from 'stripe';

import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { stripeEventPaymentIntent } from '@/feat-ordering/endpoints/stripe-event-payment-intent';
import { findTransaction } from '@/feat-ordering/transactions/find-transactions';
import { TransactionPaymentStatus } from '@/feat-ordering/transactions/transaction-symbols';
import { makeTransactionId, Transaction } from '@/feat-ordering/transactions/transactions';
import { eSIMwalletTransactionIdInMetadata } from '@/feat-ordering/utils-ordering';
import { mockStripePaymentIntent } from '@/testing/stripe.mock';
import { mockTransactionInPayload } from '@/testing/transactions-in-payload';

describe('stripe-event-payment-intent:', function () {
  test('should update Transaction payment status', async () => {
    const payload = await appGetPayloadStandalone();

    const transactionId = makeTransactionId();
    const transactionDto = await mockTransactionInPayload({ id: transactionId });
    const transaction = (await findTransaction(payload, transactionId)) as Transaction;
    const orderItem0 = transaction.orderItems[0];
    expect.soft(transactionDto.paymentStatus).not.toBe(TransactionPaymentStatus.Succeeded);
    expect.soft(orderItem0.transaction).not.toBe(TransactionPaymentStatus.Succeeded);

    const mockPaymentIntent = {
      ...mockStripePaymentIntent,
      id: 'some-stripe-payment-id',
      status: TransactionPaymentStatus.Succeeded,
      metadata: {
        [eSIMwalletTransactionIdInMetadata]: transactionId,
      },
    } as Stripe.PaymentIntent;

    await stripeEventPaymentIntent(payload, mockPaymentIntent);
    const transactionFresh = (await findTransaction(payload, transactionId))!;
    const orderItem0Fresh = transactionFresh.orderItems[0];
    expect.soft(transactionFresh.paymentStatus).toBe(TransactionPaymentStatus.Succeeded);
    expect.soft(orderItem0Fresh.transactionPaymentStatus).toBe(TransactionPaymentStatus.Succeeded);
  });
});
