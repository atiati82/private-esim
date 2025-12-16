import { NextResponse } from 'next/server';
import { beforeAll, describe, expect, test } from 'vitest';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import type { PayloadRequest } from 'payload';

import { FetchErrorBody, getErrorFromApiResponse } from '@/lib/responses';
import { EsimProductDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { CartItem, CartState } from '@/feat-cart/cart.store';
import { CallCheckoutResponse } from '@/feat-ordering/call-checkout-endpoint';
import { checkoutEndpoint } from '@/feat-ordering/endpoints/checkout.endpoint';
import { findTransaction } from '@/feat-ordering/transactions/find-transactions';
import { Transaction } from '@/feat-ordering/transactions/transactions';
import { mockCartItemsDummy } from '@/testing/cart.mock';
import { mockPayloadEndpointRequest } from '@/testing/mock-payload-request';
import { mockProductInPayload } from '@/testing/products-in-payload';

describe('Checkout Endpoint:', function () {
  test('access: response 401 when no user', async () => {
    const req = await mockPayloadEndpointRequest({ user: null });
    const res = await checkoutEndpoint(req);
    const err = getErrorFromApiResponse(res, await res.json());
    expect(res.status).toBe(401);
    expect(err?.message).toContain('Invalid user');
  });

  test('error: invalid/non-existing cart state should respond with error', async () => {
    const req = await mockPayloadEndpointRequest();
    const res = await checkoutEndpoint(req);
    expect(res.status).toBe(400);
    const err = getErrorFromApiResponse(res, await res.json());
    expect(res.status).toBe(400);
    expect(err?.message).toContain('Invalid or empty Cart data received');
  });

  test(`error: empty cart state`, async () => {
    const body: CartState = { cartItems: [] };
    const req = await mockPayloadEndpointRequest({}, { body });
    const res = await checkoutEndpoint(req);
    expect(res.status).toBe(400);
    const resBody = await res.json();
    expect.soft(resBody).toHaveProperty('errors[0].code', 'INVALID_CART_STATE');
    expect
      .soft(resBody)
      .toHaveProperty(
        'errors[0].message',
        expect.stringContaining('Invalid or empty Cart data received'),
      );
  });

  test(`error: when unknown/non-existing/fake product(s) found in the cart`, async () => {
    const body: CartState = { cartItems: mockCartItemsDummy };
    const req = await mockPayloadEndpointRequest({}, { body });
    await expect(checkoutEndpoint(req)).rejects.toThrowError(
      /non-existing product-0 product found in the cart/,
    );
  });

  describe('Full Checkout Flow:', () => {
    let productToBuy0: EsimProductDto, productToBuy1: EsimProductDto;
    let cartItem0: CartItem, cartItem1: CartItem;
    let req: PayloadRequest;
    let res: NextResponse<CallCheckoutResponse | FetchErrorBody>;
    let response: CallCheckoutResponse;
    let transaction: Transaction;

    const expectedCartTotal = 550;

    beforeAll(async () => {
      productToBuy0 = await mockProductInPayload({}, { listPrice: 2.5 });
      productToBuy1 = await mockProductInPayload({}, { listPrice: 1.5 });
      cartItem0 = {
        id: 0,
        productId: productToBuy0.id,
        name: productToBuy0.name,
        location: 'id',
        qty: 1,
        unitPrice: 19.99,
      };
      cartItem1 = {
        id: 1,
        productId: productToBuy1.id,
        name: productToBuy1.name,
        location: 'us',
        qty: 2,
        unitPrice: 50,
      };
      req = await mockPayloadEndpointRequest(
        {},
        {
          body: <CartState>{
            cartItems: [cartItem0!, cartItem1!],
          },
        },
      );
      res = await checkoutEndpoint(req);
      response = await res.json();
      // console.log('\nCheckout RESPONSE:\n', response);

      const payload = await appGetPayloadStandalone();
      transaction = (await findTransaction(payload, response.transactionId))!;
      // console.log('\nCheckout RESPONSE: TRANSACTION DTO\n', transaction);
    });

    test(`Should create Transaction and related OrderItem(s) in the CMS`, async () => {
      expect.soft(res.status).toBe(201);
      expect.soft(response).toBeDefined();
      expect(response).not.toHaveProperty('errors');
      expect(response).toMatchObject({
        isNew: true,
        transactionId: transaction.id,
      } as CallCheckoutResponse);
      expect(response.orderItems.includes(transaction.orderItems[0].id)).toBe(true);
      expect(response.orderItems.includes(transaction.orderItems[1].id)).toBe(true);
      expect(response.orderItems.includes(transaction.orderItems[2].id)).toBe(true);
      expect(response.orderItems.length).toBe(3);

      // Relation back to transaction
      const orderItemDto = transaction.orderItems[0];
      expect(orderItemDto.transaction).toEqual(response.transactionId);
    });

    test(`Should not have eSIM attached to it, yet`, async () => {
      const orderItem = transaction.orderItems[0];
      expect(orderItem.esimCard).not.toBeDefined();
    });

    test(`Should have relation to valid product from CartState`, async () => {
      const transactionProductIds = sortBy(
        transaction.orderItems.map((item) => getRelationIdVal(item.product)!),
      );
      const cartProductIds = sortBy([
        cartItem0.productId,
        cartItem1.productId,
        // the 2nd product was twice in the Cart... so here we should have cartItem1 again
        cartItem1.productId,
      ]);
      expect(isEqual(transactionProductIds, cartProductIds)).toBe(true);
    });

    test(`Should ignore price from CartState, use CMS price instead`, async () => {
      expect(response.total).toBe(expectedCartTotal);
    });

    test(`Should NOT be a new transaction, when CartState the same`, async () => {
      const resAgain = await checkoutEndpoint(req);
      const responseAgain = await resAgain.json();
      // console.log('\nCheckout RESPONSE AGAIN:\n', responseAgain);

      expect(responseAgain).not.toHaveProperty('errors');
      expect(responseAgain).toMatchObject({
        isNew: false,
        // same transaction id as previously
        transactionId: transaction.id,
        orderItems: [
          // same order items as previously
          transaction.orderItems[0].id,
          transaction.orderItems[1].id,
          transaction.orderItems[2].id,
        ],
      } as CallCheckoutResponse);
    });
  });
});
