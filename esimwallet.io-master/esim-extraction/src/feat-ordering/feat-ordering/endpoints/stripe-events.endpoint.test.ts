import { beforeAll, describe, expect, test } from 'vitest';

import { streamToString } from '@/lib/utils';

import { mockPayloadEndpointRequest } from '@/testing/mock-payload-request';
import { mockStripeEventBody } from '@/testing/stripe.mock';
import { getStripe } from '../stripe';
import { stripeEventsEndpoint } from './stripe-events.endpoint';

describe('stripe-events.endpoint:', function () {
  beforeAll(() => {
    process.env.STRIPE_WEBHOOKS_SIGNING_SECRET = 'whsec_test_secret';
  });

  test('calling stripeEventsEndpoint', async () => {
    const mockStripeEventStr = JSON.stringify(mockStripeEventBody);
    const stripe = await getStripe();
    const req = await mockPayloadEndpointRequest(
      {},
      {
        body: mockStripeEventBody,
        headers: {
          'stripe-signature': stripe.webhooks.generateTestHeaderString({
            payload: mockStripeEventStr,
            secret: `${process.env.STRIPE_WEBHOOKS_SIGNING_SECRET}`,
          }),
        },
      },
    );
    const res = await stripeEventsEndpoint(req);
    const resBody = await streamToString(res.body);
    expect(res.status).toBe(200);
    expect(resBody).toContain('stripeEventReceived');
    expect(resBody).toContain(mockStripeEventBody.type);
  });
});
