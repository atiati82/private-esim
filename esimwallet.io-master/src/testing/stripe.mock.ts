import type Stripe from 'stripe';

import { eSIMwalletTransactionIdInMetadata } from '@/feat-ordering/utils-ordering';
import { mockUserDto } from './users.mock';

export const mockStripeEventBody = {
  id: 'evt_x',
  object: 'event',
  data: {
    object: {
      id: 'ch_3QDUZeQUCQnFEs7v4NfNEnLp',
      object: 'charge',
      amount: 4999,
      amount_captured: 4999,
      paid: true,
      payment_method_details: { type: 'card' },
      status: 'succeeded',
    } as Stripe.Charge,
  },
  type: 'charge.updated',
} as Stripe.Response<Stripe.ChargeUpdatedEvent>;

export const mockStripePaymentIntent = {
  id: 'pi_3QDUZeQUCQnFEs7v4iSBLsDK',
  object: 'payment_intent',
  amount: 4999,
  amount_received: 4999,
  currency: 'usd',
  customer: 'cus_QudaK5q4Ewq8GF',
  description: 'Private eSIM #99941024-0cdd08 x1 item',
  metadata: {
    [eSIMwalletTransactionIdInMetadata]: '99941024-0cdd08',
  },
  status: 'succeeded',
} as unknown as Stripe.PaymentIntent;

export const mockStripeCustomer = {
  id: mockUserDto.stripeCustomerId!,
  object: 'customer',
  email: mockUserDto.email!,
  name: 'Mock User',
} as Stripe.Customer;
