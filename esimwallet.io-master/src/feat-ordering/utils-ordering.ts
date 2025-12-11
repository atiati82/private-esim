import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';

import type { OrderItem } from '@/esim-core/order-items/order-item';
import { urlForTransactions } from '@/lib/urls';
import { pluralize } from '@/lib/utils';
import type { OrderItemDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';

import { cartItemsToProductIds } from '@/feat-cart/cart-helpers';
import type { CartState } from '@/feat-cart/cart.store';
import {
  TransactionPaymentStatus,
  TransactionPaymentStatuses,
} from '@/feat-ordering/transactions/transaction-symbols';
import { Transaction } from '@/feat-ordering/transactions/transactions';

/**
 * We insert this field into Payment Metadata fields,
 * and we access this field in Strip hooks, to link our transaction with theirs.
 */
export const eSIMwalletTransactionIdInMetadata = 'eSIMwalletTransactionId';

export function isStripeProductionEnv(): boolean {
  const isTestEnv = String(process.env.NEXT_PUBLIC_STRIPE_IS_TEST_KEY || 'true').toLowerCase();
  return isTestEnv === 'false' || isTestEnv === '0';
}

export function urlForStripePayment(paymentIntentId: string): string {
  return `https://dashboard.stripe.com${isStripeProductionEnv() ? '' : '/test'}/payments/${paymentIntentId}`;
}

export function urlForStripeCustomer(customerId: string): string {
  return `https://dashboard.stripe.com${isStripeProductionEnv() ? '' : '/test'}/customers/${customerId}`;
}

/**
 * Where Stripe navigates after (un)successful payment
 */
export function urlForStripeReturn(transactionId: string): string {
  return urlForTransactions(transactionId);
}

export function isStripePaymentSuccess(paymentStatus: TransactionPaymentStatuses): boolean {
  return paymentStatus === TransactionPaymentStatus.Succeeded;
}

export function isStripePaymentClosed(paymentStatus: TransactionPaymentStatuses): boolean {
  return (
    paymentStatus === TransactionPaymentStatus.Succeeded ||
    paymentStatus === TransactionPaymentStatus.Cancelled
  );
}

export function isStripePaymentNewUnpaid(paymentStatus: TransactionPaymentStatuses): boolean {
  return !paymentStatus || paymentStatus.startsWith('requires_');
}

export function stripeDescription(transaction: Transaction): string {
  const transactionItemsCount = transaction.orderItems?.length ?? 0;
  return `eSIMwallet #${transaction.id} x${transactionItemsCount} ${pluralize(transactionItemsCount, 'item')}`;
}

export function stripeMetadataItems(transaction: Transaction): Record<string, string> {
  const transactionItemsCount = transaction.orderItems?.length ?? 0;
  const metadataItems = (transaction.orderItems ?? []).reduce((lineItems, item, idx) => {
    return { ...lineItems, [`Item.${idx + 1}`]: getRelationIdVal(item.product) };
  }, {});
  return {
    ...metadataItems,
    Items: `${transactionItemsCount}`,
    [eSIMwalletTransactionIdInMetadata]: transaction.id,
  };
}

/**
 * Get transaction total value (in cents, based on OrderItem(s) in the transaction)
 */
export function getOrderItemsTotalAmount(orderItems: OrderItem[] | OrderItemDto[]): number {
  return orderItems.reduce((total, item) => total + item.price, 0);
}

/**
 * Check if transaction has exactly the same items as in the cart
 */
export function hasTheSameCartItems(
  transaction: Transaction,
  cartItems: CartState['cartItems'],
): boolean {
  const productIds = sortBy(cartItemsToProductIds(cartItems));
  const transactionProductIds: string[] = sortBy(
    transaction.orderItems.map((item) => getRelationIdVal(item.product)!),
  );

  return isEqual(productIds, transactionProductIds);
}
