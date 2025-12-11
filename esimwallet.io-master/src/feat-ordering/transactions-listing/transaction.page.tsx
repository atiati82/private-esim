'use client';

import React, { useEffect } from 'react';
import { Action } from '@reduxjs/toolkit';

import { emitFlashMessage, MessageType } from '@/data-store/messages';
import { navigateAction, selectRouterParams } from '@/data-store/router/router';
import { useAppDispatch, useAppSelector } from '@/data-store/store-hooks';
import { urlForCheckout, urlForMyWallet, urlForTransactions } from '@/lib/urls';
import { cn, pluralize } from '@/lib/utils';
import { ButtonLink, Link } from '@/navigation';

import { Badge } from '@/components/ui.shadcn/badge';
import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { Headline } from '@/components/ui/Headline';
import { RenderFlashMessage } from '@/components/ui/message/render-flash-message';
import {
  TransactionPaymentStatus,
  transactionPaymentStatusLabel,
} from '@/feat-ordering/transactions/transaction-symbols';
import { isStripePaymentClosed, isStripePaymentSuccess } from '@/feat-ordering/utils-ordering';
import { flexContainerJbC } from '@/styles/layout.css';
import { fontSemibold } from '@/styles/typography.css';
import { Transaction } from '../transactions/transactions';
import * as styles from './transaction.page.css';

interface TransactionPageProps {
  transaction: Transaction;
}

/**
 * Customer Account: page with transaction (and payment details).
 * Links to individual orders to My Wallet, where they can be managed.
 *
 * IMPORTANT: this page is also shown as a return url from {@link CheckoutTransactionPage}
 * after (un)successful Stripe payment.
 *
 * @see CheckoutTransactionPage
 */
export const TransactionPage: React.FC<TransactionPageProps> = ({ transaction }) => {
  const dispatch = useAppDispatch();
  const { payment_intent: paymentIntentId, redirect_status } = useAppSelector(selectRouterParams);
  const redirectStatus = redirect_status as TransactionPaymentStatus;

  /**
   * Handle Stripe redirect, when payment_intent and redirect_status is in the URL params
   */
  useEffect(() => {
    if (paymentIntentId) {
      if (isStripePaymentSuccess(redirectStatus)) {
        dispatch(stripeSuccessFlashMessage());
      } else {
        dispatch(stripeNoSuccessFlashMessage());
      }
      dispatch(navigateAction(urlForTransactions(transaction.id)));
    }
  }, [paymentIntentId, redirectStatus]);

  const transactionItems = transaction.orderItems?.length ?? 0;
  const itemsLabel = transactionItems + ' ' + pluralize(transactionItems, 'order item');
  const viewUrl = urlForMyWallet();
  const viewUrlTitle = 'See ordered items in My Wallet';
  const badgeVariant = isStripePaymentSuccess(transaction.paymentStatus)
    ? 'primary'
    : isStripePaymentClosed(transaction.paymentStatus)
      ? 'warning'
      : 'destructive';

  return (
    <>
      {/** Render flash message with Stripe payment results */}
      <RenderFlashMessage messagePath="checkout" className={styles.flashMessage} />

      <Headline as="h3" className={styles.headline}>
        Transaction <code>#{transaction.id}</code>
      </Headline>

      <Headline as="h5">
        Payment status:{' '}
        <Badge variant={badgeVariant}>
          {transactionPaymentStatusLabel(transaction.paymentStatus)}
        </Badge>
      </Headline>

      <div className={cn(styles.wrapper)}>
        <div>
          <Link href={viewUrl} className={cn(styles.itemsLine)} title={viewUrlTitle}>
            {itemsLabel}
          </Link>
        </div>

        <div className={cn(styles.columnEnd)}>
          <CurrencyFormatter amount={transaction.total} amountInCents={true} />
          <br />
        </div>
      </div>

      <div className={flexContainerJbC}>
        <ButtonLink
          href={viewUrl}
          size="sm"
          variant="secondary"
          title={viewUrlTitle}
          className={fontSemibold}
        >
          Manage in My Wallet
        </ButtonLink>
        {!isStripePaymentClosed(transaction.paymentStatus) && (
          <ButtonLink href={urlForCheckout(transaction.id)} size="sm">
            Checkout
          </ButtonLink>
        )}
      </div>
    </>
  );
};

function stripeSuccessFlashMessage(): Action {
  return emitFlashMessage({
    path: 'checkout',
    messageType: MessageType.Success,
    title: 'Payment successful - thank you!',
    message: (
      <>
        Your order is now being processed and should be ready very soon. You can track the progress,
        activate and manage your eSIM cards in&nbsp;
        <ButtonLink
          href={urlForMyWallet()}
          className={fontSemibold}
          size="tiny"
          variant="secondary"
        >
          My Wallet
        </ButtonLink>{' '}
        section.
      </>
    ),
  });
}

function stripeNoSuccessFlashMessage(): Action {
  return emitFlashMessage({
    path: 'checkout',
    messageType: MessageType.Error,
    title: 'Oops, Something Went Wrong',
    message: (
      <>
        There were some problems with the payment.
        <br />
        Try to <strong>do Checkout again</strong> using the button below. If problem persists,
        please contact our Customer Support - we'll be happy to help!
      </>
    ),
  });
}
