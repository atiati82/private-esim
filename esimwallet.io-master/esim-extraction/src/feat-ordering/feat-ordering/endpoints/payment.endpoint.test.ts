import { beforeEach, describe, expect, test, vi } from 'vitest';
import Stripe from 'stripe';

import { getErrorFromApiResponse } from '@/lib/responses';
import { OrderItemDto, UserDto } from '@/payload/app-types';

import { CallCreatePaymentResponse } from '@/feat-ordering/call-payment-endpoint';
import { paymentEndpoint } from '@/feat-ordering/endpoints/payment.endpoint';
import { getStripe } from '@/feat-ordering/stripe';
import { TransactionPaymentStatus } from '@/feat-ordering/transactions/transaction-symbols';
import { makeTransactionId } from '@/feat-ordering/transactions/transactions';
import {
  eSIMwalletTransactionIdInMetadata,
  getOrderItemsTotalAmount,
} from '@/feat-ordering/utils-ordering';
import { mockPayloadEndpointRequest } from '@/testing/mock-payload-request';
import { mockStripeCustomer, mockStripePaymentIntent } from '@/testing/stripe.mock';
import { mockTransactionInPayload } from '@/testing/transactions-in-payload';
import { mockUserInPayload } from '@/testing/users-in-payload';
import { mockUserDto } from '@/testing/users.mock';

describe('payment.endpoint:', function () {
  test('access: response 401 when no user', async () => {
    const req = await mockPayloadEndpointRequest({ user: null });
    const res = await paymentEndpoint(req);
    const err = getErrorFromApiResponse(res, await res.json());
    expect(res.status).toBe(401);
    expect(err?.message).toContain('Invalid user');
  });
  test('access: response 401 when fake customer (not present in CMS)', async () => {
    const req = await mockPayloadEndpointRequest({}, { user: mockUserDto });
    const res = await paymentEndpoint(req);
    const err = getErrorFromApiResponse(res, await res.json());
    expect(res.status).toBe(401);
    expect(err?.message).toContain('Invalid user');
  });

  describe('Transaction and Payment (intent)', () => {
    const stripeCustomerId = mockStripePaymentIntent.customer as string;
    let stripe: Stripe;
    let user: UserDto;

    beforeEach(async () => {
      user = await mockUserInPayload({ stripeCustomerId });
      stripe = await getStripe();

      // We're not focusing here on testing Stripe customer retrieval/creation, so we just mock it
      const stripeCustomerData = {
        ...mockStripeCustomer,
        id: stripeCustomerId,
      } as Stripe.Response<Stripe.Customer>;
      vi.spyOn(stripe.customers, 'retrieve').mockResolvedValue(stripeCustomerData);
    });

    test('error: no transaction ID or invalid ID', async () => {
      const req = await mockPayloadEndpointRequest({}, { user });
      const res = await paymentEndpoint(req);
      expect(res.status).toBe(404);
      const err = getErrorFromApiResponse(res, await res.json());
      expect(err?.message).toContain(`Couldn't find transaction #missing-id`);
    });

    test('New Payment Intent', async () => {
      const mockStripePaymentIntentId = 'mock-stripe-payment-id';
      const transactionId = makeTransactionId();
      const transactionDto = await mockTransactionInPayload({ id: transactionId, user });
      const transactionAmount = getOrderItemsTotalAmount(
        transactionDto.orderItems?.docs as OrderItemDto[],
      );

      const spyPaymentRetrieve = vi.spyOn(stripe.paymentIntents, 'retrieve');
      const spyPaymentCreate = vi
        .spyOn(stripe.paymentIntents, 'create')
        .mockImplementation(async (params: Stripe.PaymentIntentCreateParams) => {
          return {
            ...mockStripePaymentIntent,
            id: mockStripePaymentIntentId,
            amount: params.amount,
            status: TransactionPaymentStatus.RequiresAction,
          } as Stripe.Response<Stripe.PaymentIntent>;
        });

      const req = await mockPayloadEndpointRequest(
        { routeParams: { transaction: transactionId } },
        { user },
      );
      const res = await paymentEndpoint(req);
      expect.soft(res.status).toBe(201);

      //
      // Ensure Stripe payment have been called with the right params
      //
      expect.soft(spyPaymentCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: transactionAmount,
          customer: stripeCustomerId,
          description: expect.stringContaining(transactionId),
          metadata: expect.objectContaining({
            Items: `${transactionDto.orderItems?.docs?.length}`,
            [eSIMwalletTransactionIdInMetadata]: transactionId,
          }),
        } as Stripe.PaymentIntentCreateParams),
      );

      expect.soft(spyPaymentRetrieve).not.toHaveBeenCalled();

      const response: CallCreatePaymentResponse = await res.json();
      // console.log('TEST RESPONSE', response);
      expect(response).toMatchObject({
        isNew: true,
        paymentId: mockStripePaymentIntentId,
        paymentStatus: TransactionPaymentStatus.RequiresAction,
        amount: transactionAmount,
      } as CallCreatePaymentResponse);
    });

    test('Re-use Payment Intent (but cancelled, so new should be created)', async () => {
      const existingStripePaymentIntentId = 'some-stripe-payment-id';
      const mockStripePaymentIntentId = 'mock-stripe-payment-id';
      const transactionId = makeTransactionId();
      await mockTransactionInPayload({
        id: transactionId,
        user,
        paymentId: existingStripePaymentIntentId,
      });

      const spyPaymentRetrieve = vi
        .spyOn(stripe.paymentIntents, 'retrieve')
        .mockImplementation(async (retrievePaymentId: string) => {
          return {
            ...mockStripePaymentIntent,
            id: retrievePaymentId,
            status: TransactionPaymentStatus.Cancelled,
          } as Stripe.Response<Stripe.PaymentIntent>;
        });
      const spyPaymentCreate = vi
        .spyOn(stripe.paymentIntents, 'create')
        .mockImplementation(async (params: Stripe.PaymentIntentCreateParams) => {
          return {
            ...mockStripePaymentIntent,
            id: mockStripePaymentIntentId,
            amount: params.amount,
            status: TransactionPaymentStatus.RequiresAction,
          } as Stripe.Response<Stripe.PaymentIntent>;
        });

      const req = await mockPayloadEndpointRequest(
        { routeParams: { transaction: transactionId } },
        { user },
      );
      const res = await paymentEndpoint(req);
      expect.soft(res.status).toBe(201);

      expect.soft(spyPaymentRetrieve).toHaveBeenCalledWith(existingStripePaymentIntentId);
      expect.soft(spyPaymentCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expect.stringContaining(transactionId),
        } as Stripe.PaymentIntentCreateParams),
      );

      const response: CallCreatePaymentResponse = await res.json();

      // expect new payment ID, despite of old (cancelled) being in the transaction data
      expect(response).toMatchObject({
        isNew: true,
        paymentId: mockStripePaymentIntentId,
        paymentStatus: TransactionPaymentStatus.RequiresAction,
      } as CallCreatePaymentResponse);
    });
  });
});
