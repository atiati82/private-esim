'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';

import { emitFlashMessage, MessageType } from '@/data-store/messages';
import { navigateAction } from '@/data-store/router/router';
import { useAppDispatch } from '@/data-store/store-hooks';
import { getCatchError } from '@/lib/responses';
import { urlForCart } from '@/lib/urls';

import {
  CallCreatePaymentResponse,
  callPaymentEndpoint,
} from '@/feat-ordering/call-payment-endpoint';
import { CheckoutForm } from '@/feat-ordering/checkout-form';
import { SecureCheckout, SecureCheckoutStatus } from '@/feat-ordering/components/secure-checkout';
import { Transaction } from '@/feat-ordering/transactions/transactions';
import { textErrorCode } from '@/styles/typography.css';

interface CheckoutTransactionProps {
  transaction: Transaction;
}

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

/**
 * For given Transaction, create Stripe Payment Intent and show {@link CheckoutForm}
 * (with Stripe Payment Element) to capture the payment. Behind the scenes, via Stripe Webhook,
 * we update CMS records with just created Payment Intent and its status.
 *
 * This page is displayed after navigating from /checkout to /checkout/:transactionId url.
 *
 * @see CheckoutPage
 * @see CheckoutForm
 */
export const CheckoutTransactionPage: React.FC<CheckoutTransactionProps> = ({ transaction }) => {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);
  const [createdPaymentIntent, setPaymentIntent] = useState<CallCreatePaymentResponse>();

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    const createPaymentIntent = async (): Promise<void> => {
      try {
        const paymentIntentRes: CallCreatePaymentResponse = await callPaymentEndpoint(
          transaction.id,
        );
        setPaymentIntent(paymentIntentRes);
      } catch (err) {
        const error = getCatchError(err);
        dispatch(
          emitFlashMessage({
            path: 'checkout',
            messageType: MessageType.Error,
            title: 'Error while setting up the payment',
            message: (
              <>
                <span>
                  Something went wrong while talking to our Payment Provider. Please reload the page
                  and try again. If the error comes back,{' '}
                  <strong>contact our Customer Support</strong> - we'll be happy to help!
                </span>
                <code className={textErrorCode}>
                  {error.code} | {error.message}
                  <br />
                  Transaction ID: {transaction.id}
                </code>
              </>
            ),
          }),
        );
        dispatch(navigateAction(urlForCart()));
      }
    };
    createPaymentIntent();
  }, []);

  const stripeElementsOptions: StripeElementsOptions = {
    clientSecret: createdPaymentIntent?.clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
    },
  };
  const stripePaymentElementOptions: StripePaymentElementOptions = {
    layout: 'accordion',
    business: { name: 'Private eSIM' },
  };

  return (
    <SecureCheckout>
      {(createdPaymentIntent && (
        <Elements stripe={stripePromise} options={stripeElementsOptions}>
          <CheckoutForm
            paymentElementOptions={stripePaymentElementOptions}
            transaction={transaction}
            paymentStatus={createdPaymentIntent.paymentStatus}
          />
        </Elements>
      )) || (
        <SecureCheckoutStatus title={'Contacting payment provider'} variant="success">
          We're talking to Payment Provider to collect your payment. Hold on.
          <br />
          It should take no longer than a few seconds.
        </SecureCheckoutStatus>
      )}
    </SecureCheckout>
  );
};
