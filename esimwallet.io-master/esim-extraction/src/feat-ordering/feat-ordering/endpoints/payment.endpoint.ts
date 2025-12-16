import { NextResponse } from 'next/server';
import { PayloadRequest } from 'payload';
import Stripe from 'stripe';

import { findCurrentUserFromReq } from '@/data/find-user';
import { FetchErrorBody, responseWithError } from '@/lib/responses';

import { findTransaction } from '@/feat-ordering/transactions/find-transactions';
import { CallCreatePaymentResponse } from '../call-payment-endpoint';
import { getSetStripeCustomerAccount } from '../get-set-stripe-customer-account';
import { getStripe } from '../stripe';
import { stripeDescription, stripeMetadataItems } from '../utils-ordering';

/**
 * Called after checkout step, where CartState has been loaded into BE
 * (which resulted in {@link TransactionDto} and {@link OrderItemDto}s in CMS).
 *
 * This endpoint is related to preparing/setting *Stripe Payment Intent* and wiring
 * it with existing {@link TransactionDto}.
 * After that, FE will (be able to) show Stripe payment form.
 *
 * @see callPaymentEndpoint
 * @see checkoutEndpoint
 */
export async function paymentEndpoint(
  req: PayloadRequest,
): Promise<NextResponse<CallCreatePaymentResponse | FetchErrorBody>> {
  const { payload } = req;
  const logger = payload.logger;
  const transactionId = (req.routeParams?.transaction as string) ?? '';
  logger.info(`CREATE PAYMENT request for transaction:${transactionId}...`);

  const user = await findCurrentUserFromReq(req);
  if (!user) {
    return NextResponse.json(
      responseWithError('Invalid user. Are you logged in?', 'Unauthorized'),
      { status: 401 },
    );
  }

  const stripe = await getStripe();
  const stripeCustomer = await getSetStripeCustomerAccount(stripe, payload, user);
  if (!stripeCustomer || stripeCustomer.deleted) {
    return NextResponse.json(
      responseWithError('Invalid Stripe customer account', 'INVALID_STRIPE_CUSTOMER'),
      { status: 400 },
    );
  }

  const transaction = await findTransaction(payload, transactionId);
  logger.info(
    `\t for user:${user.email} customer:${stripeCustomer.id} status:${transaction?.paymentStatus}`,
  );

  /**
   * NOTE about transaction owner:
   * We could verify here the "ownership" of the transaction... But perhaps it's not needed?
   * Someone else (or even Customer Support) might want to pay for the order.
   */
  if (transaction) {
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
    let paymentIntentIsNew = false;
    if (transaction.paymentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(transaction.paymentId);
      logger.info(`\t Existing Payment found: ${paymentIntent.id} ${paymentIntent.status}`);
    }
    if (!paymentIntent! || paymentIntent.status === 'canceled') {
      paymentIntent = await stripe.paymentIntents.create({
        amount: transaction.total,
        currency: 'usd',
        customer: stripeCustomer.id,
        description: stripeDescription(transaction),
        metadata: stripeMetadataItems(transaction),
      });
      paymentIntentIsNew = true;
      logger.info(`\t New payment: ${paymentIntent.id}: ${paymentIntent.status}`);
    }

    const response: CallCreatePaymentResponse = {
      isNew: paymentIntentIsNew,
      paymentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
      customerId: stripeCustomer.id,
      clientSecret: paymentIntent.client_secret!,
      amount: paymentIntent.amount,
    };
    return NextResponse.json(response, { status: 201 });
  }

  logger.error(`\t ERROR: Couldn't find transaction #${transactionId}.`);
  return NextResponse.json(
    responseWithError(
      `Couldn't find transaction #${transactionId || 'missing-id'}`,
      'TRANSACTION_NOT_FOUND',
    ),
    { status: 404 },
  );
}
