import { beforeEach, describe, expect, test, vi } from 'vitest';
import { BasePayload } from 'payload';
import Stripe from 'stripe';

import { findUser } from '@/data/find-user';
import { UserDto } from '@/payload/app-types';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { getSetStripeCustomerAccount } from '@/feat-ordering/get-set-stripe-customer-account';
import { getStripe } from '@/feat-ordering/stripe';
import { mockStripeCustomer } from '@/testing/stripe.mock';
import { mockUserInPayload } from '@/testing/users-in-payload';

describe('get-set-stripe-customer-account:', function () {
  let payload: BasePayload;
  let stripe: Stripe;
  let user: UserDto;

  const mockStripeCustomerId = 'cus_existing_stripe_id';
  const mockStripeCustomerIdNew = 'cus_new_stripe_id';

  beforeEach(async () => {
    payload = await appGetPayloadStandalone();
    stripe = await getStripe();
    user = await mockUserInPayload({ stripeCustomerId: mockStripeCustomerId });
  });

  test('should retrieve existing customer', async () => {
    const stripeCustomerData = {
      ...mockStripeCustomer,
      id: mockStripeCustomerId,
    } as Stripe.Response<Stripe.Customer>;

    const spyRetrieve = vi
      .spyOn(stripe.customers, 'retrieve')
      .mockResolvedValue(stripeCustomerData);
    const spyCreate = vi.spyOn(stripe.customers, 'create');

    const customer = await getSetStripeCustomerAccount(stripe, payload, user);
    expect(customer.id).toEqual(mockStripeCustomerId);
    expect(spyRetrieve).toHaveBeenCalledOnce();
    expect(spyCreate).not.toHaveBeenCalled();
  });

  test('should create new customer, if existing one is marked as deleted', async () => {
    const stripeCustomerDeleted = {
      ...mockStripeCustomer,
      id: mockStripeCustomerId,
      deleted: true as unknown as void, // don't understand why Stripe has void in typings here...
    } as Stripe.Response<Stripe.Customer>;
    const stripeNewCustomer = {
      ...mockStripeCustomer,
      id: mockStripeCustomerIdNew,
    } as Stripe.Response<Stripe.Customer>;

    const spyRetrieve = vi
      .spyOn(stripe.customers, 'retrieve')
      .mockResolvedValue(stripeCustomerDeleted);
    const spyCreate = vi.spyOn(stripe.customers, 'create').mockResolvedValue(stripeNewCustomer);

    expect(user.stripeCustomerId).toEqual(mockStripeCustomerId);

    const customer = await getSetStripeCustomerAccount(stripe, payload, user);
    expect(customer.id).toEqual(mockStripeCustomerIdNew);
    expect(spyRetrieve).toHaveBeenCalledOnce();
    expect(spyCreate).toHaveBeenCalled();

    // User record should be updated, too
    const userFresh = await findUser(payload, user.id);
    expect(userFresh?.stripeCustomerId).not.toEqual(mockStripeCustomerId);
    expect(userFresh?.stripeCustomerId).toEqual(mockStripeCustomerIdNew);
  });

  test(`should create new customer, if there's none on user's record`, async () => {
    user = await mockUserInPayload({ stripeCustomerId: null });
    const stripeNewCustomer = {
      ...mockStripeCustomer,
      id: mockStripeCustomerIdNew,
    } as Stripe.Response<Stripe.Customer>;

    const spyRetrieve = vi.spyOn(stripe.customers, 'retrieve');
    const spyCreate = vi.spyOn(stripe.customers, 'create').mockResolvedValue(stripeNewCustomer);

    expect(user.stripeCustomerId).toBeFalsy();

    const customer = await getSetStripeCustomerAccount(stripe, payload, user);
    expect(customer.id).toEqual(mockStripeCustomerIdNew);
    expect(spyRetrieve).not.toHaveBeenCalled();
    expect(spyCreate).toHaveBeenCalledOnce();

    // User record should be updated, too
    const userFresh = await findUser(payload, user.id);
    expect(userFresh?.stripeCustomerId).toEqual(stripeNewCustomer.id);
  });
});
