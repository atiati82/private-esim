'use server';

import Stripe from 'stripe';

/**
 * Create (or get, if previously created) a Stripe obj
 */
export async function getStripe(): Promise<Stripe> {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('WARNING: STRIPE_SECRET_KEY is missing.');
    }

    _stripe = new Stripe(
      `${process.env.STRIPE_SECRET_KEY || 'sk_test_ERROR_MISSING_STRIPE_SECRET_KEY'}`,
    );
  }

  return _stripe;
}

let _stripe: Stripe;
