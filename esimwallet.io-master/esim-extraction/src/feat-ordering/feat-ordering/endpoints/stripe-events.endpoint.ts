import { NextResponse } from 'next/server';
import { PayloadHandler, PayloadRequest } from 'payload';
import Stripe from 'stripe';

import { isProduction } from '@/env-helpers';
import { safeJsonParse, streamToString } from '@/lib/utils';

import { getStripe } from '../stripe';
import { stripeEventPaymentIntent } from './stripe-event-payment-intent';

/**
 * Stripe webhook, as defined in {@link TransactionsCollection}.
 *
 * It listens to Stripe webhook events, verifies its signature and executes
 * whatever needs to be executed on the app's side.
 */
export const stripeEventsEndpoint: PayloadHandler = async (req: PayloadRequest) => {
  const logger = req.payload.logger;
  const sig = (req.headers.has('stripe-signature') && req.headers.get('stripe-signature')) || '';

  const rawBody = await streamToString(req.body);
  const body = safeJsonParse<Stripe.Response<Stripe.ChargeUpdatedEvent>>(rawBody);
  logger.info(
    {
      'WEBHOOKS KEY FROM ENV': process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
      'SIG FROM HEADERS': sig,
      // TODO: disable, when finished debugging for SIM-183
      'BODY (decoded)': isProduction ? body : '...',
      'RAW BODY': isProduction ? '\n' + rawBody + '\n\n' : '...',
    },
    `STRIPE WEBHOOK: ${body[0]?.type || 'UNKNOWN-EVENT-TYPE'} - about to construct the event...`,
  );
  const stripe = await getStripe();
  const event = stripe.webhooks.constructEvent(
    rawBody,
    sig,
    `${process.env.STRIPE_WEBHOOKS_SIGNING_SECRET}`,
  );
  logger.info(
    // event,
    // Event obj ^^^ can be large - only uncomment when really needed...
    `[${event.livemode ? 'LIVE' : 'TEST'}] STRIPE WEBHOOK: ${event.type}`,
  );

  switch (event.type) {
    default:
      if (event.type.startsWith('payment_intent.')) {
        await stripeEventPaymentIntent(req.payload, event.data.object as Stripe.PaymentIntent);
      }
  }

  return NextResponse.json({ stripeEventReceived: event.type }, { status: 200 });
};
