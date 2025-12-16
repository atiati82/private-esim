import type { Payload } from 'payload';

import { isStripePaymentNewUnpaid } from '../utils-ordering';
import { TransactionsCollectionId } from './collection';
import { makeTransactionObj, Transaction } from './transactions';

export async function findTransaction(
  payload: Payload,
  tid: string,
  options: { depth?: number } = {},
): Promise<Transaction | undefined> {
  const dto = await payload.findByID({
    collection: TransactionsCollectionId,
    id: tid,
    depth: options.depth ?? 1,
    disableErrors: true,
  });
  return dto ? makeTransactionObj(dto) : undefined;
}

const RecentTransactionInDays = 1;

/**
 * Finds the most recent unpaid Transaction record.
 *
 * (But only if it's the most recent, the last transaction.
 * If the last transaction is paid, it means it's perhaps safe to
 * ignore the most recent (but not the last), unpaid).
 */
export async function findMostRecentUnpaidTransaction(
  payload: Payload,
  userId: string,
  options: { depth?: number } = {},
): Promise<Transaction | undefined> {
  if (!userId) {
    return;
  }
  const sinceYesterday = new Date();
  sinceYesterday.setDate(sinceYesterday.getDate() - RecentTransactionInDays); // Subtract 1 day (24 hours)

  const res = await payload.find({
    collection: TransactionsCollectionId,
    where: {
      user: { equals: userId },
    },
    depth: options.depth ?? 1,
    limit: 1,
    sort: '-createdAt',
  });

  const transaction = res.docs[0];
  return transaction && isStripePaymentNewUnpaid(transaction?.paymentStatus)
    ? makeTransactionObj(transaction)
    : undefined;
}
