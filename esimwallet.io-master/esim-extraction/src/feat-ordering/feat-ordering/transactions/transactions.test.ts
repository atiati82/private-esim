import { describe, expect, test } from 'vitest';

import { OrderItemIdRegexp } from '@/esim-core/order-items/order-item';

import { makeTransactionId, makeTransactionObj, TransactionIdRegexp } from './transactions';

describe('Transactions', () => {
  describe('makeTransactionObj', () => {
    test('should make Transaction entity', () => {
      expect(
        makeTransactionObj({
          id: makeTransactionId(),
          user: 'xyz',
          total: 123,
          createdAt: '',
          updatedAt: '',
        }),
      ).toMatchObject({
        id: expect.stringMatching(TransactionIdRegexp),
        total: 123,
        orderItems: [],
        paymentId: '',
        paymentStatus: 'requires_payment_method',
      });
    });
  });
  describe('transaction IDs', function () {
    test('makeTransactionId', () => {
      const id = makeTransactionId();
      const match = id.match(TransactionIdRegexp);
      expect(match?.length).toBe(4);
      expect(id).not.toMatch(OrderItemIdRegexp);
    });
  });
});
