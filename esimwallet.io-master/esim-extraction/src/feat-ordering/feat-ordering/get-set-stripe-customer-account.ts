import { BasePayload } from 'payload';
import Stripe from 'stripe';

import { UserDto } from '@/payload/app-types';
import { UsersCollectionId } from '@/payload/collections';

/**
 * Get (or create and save on user record) Stripe Customer for the user
 */
export async function getSetStripeCustomerAccount(
  stripe: Stripe,
  payload: BasePayload,
  user: UserDto,
): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
  const logger = payload.logger;

  if (user.stripeCustomerId) {
    let customer: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>;
    try {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } catch (err) {
      logger.warn(
        `Problem retrieving Stripe customer *${user.stripeCustomerId}* for *${user.email}: ` +
          (err as Error).message,
      );
    }

    if (!customer! || customer.deleted) {
      logger.warn(
        `Re-creating Stripe customer for *${user.email}* - existing *${user.stripeCustomerId}* is no longer valid...`,
      );
      return createStripeCustomerAccount(stripe, payload, user);
    }

    return customer;
  }

  return createStripeCustomerAccount(stripe, payload, user);
}

async function createStripeCustomerAccount(
  stripe: Stripe,
  payload: BasePayload,
  user: UserDto,
): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.fullName ?? user.email,
  });

  await payload.update({
    collection: UsersCollectionId,
    id: user.id,
    data: { stripeCustomerId: customer.id },
  });

  return customer;
}
