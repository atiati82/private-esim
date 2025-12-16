'use client';

import React, { useEffect, useRef, useTransition } from 'react';

import { emitFlashMessage, MessageType } from '@/data-store/messages';
import { navigateAction } from '@/data-store/router/router';
import { useAppDispatch, useAppSelector } from '@/data-store/store-hooks';
import { getCatchError } from '@/lib/responses';
import { urlForCart, urlForCheckout } from '@/lib/urls';

import { flashMessageForGenericApiError } from '@/components/ui/message/system-flash-messages';
import { CartState, selectCartState } from '@/feat-cart/cart.store';
import { callCheckoutEndpoint } from '@/feat-ordering/call-checkout-endpoint';
import { SecureCheckout, SecureCheckoutStatus } from '@/feat-ordering/components/secure-checkout';

interface CheckoutPageProps {}

/**
 * Secure Checkout, phase 0: uploading cart state (order items) into CMS (Transaction Collection)
 * and redirecting to /checkout/:transactionId page,
 * where Payment Intent will be created and Stripe payment element will be shown.
 *
 * @see CheckoutTransactionPage
 */
export const CheckoutPage: React.FC<CheckoutPageProps> = () => {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);
  const [_, startTransition] = useTransition();
  const cartState: CartState = useRef(useAppSelector(selectCartState)).current;
  const isCartEmpty: boolean = cartState?.cartItems.length === 0;

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    if (isCartEmpty) {
      dispatch(navigateAction(urlForCart()));
      return;
    }

    const createOrder = async (): Promise<void> => {
      try {
        const transaction = await callCheckoutEndpoint(cartState);
        console.log('CALL: CHECKOUT res', transaction);
        startTransition(() => {
          dispatch(navigateAction(urlForCheckout(transaction.transactionId)));
        });
      } catch (e) {
        const error = getCatchError(e);
        console.log('CALL: CHECKOUT error', { e, error });
        dispatch(
          emitFlashMessage({
            path: 'checkout',
            messageType: MessageType.Error,
            title: 'Error occurred while submitting your order',
            message: flashMessageForGenericApiError(error),
          }),
        );
        startTransition(() => {
          dispatch(navigateAction(urlForCart()));
        });
      }
    };
    createOrder();
  }, []);

  return (
    <SecureCheckout>
      <SecureCheckoutStatus title={'Submitting your order'} variant="success">
        We're preparing your order. Please kindly wait.
        <br />
        It shouldn't take longer than a few seconds.
      </SecureCheckoutStatus>
    </SecureCheckout>
  );
};
