import { describe, expect, test } from 'vitest';

import { CartItem } from '@/feat-cart/cart.store';
import {
  mockTransactionDtoNewUnpaid,
  mockTransactionWithDuplicatesDto,
} from '@/testing/transactions.mock';
import { makeTransactionObj, Transaction } from './transactions/transactions';
import { hasTheSameCartItems, isStripeProductionEnv, stripeDescription } from './utils-ordering';

describe('utils-ordering:', function () {
  test('isStripeProductionEnv', () => {
    expect(isStripeProductionEnv()).toBe(false);
  });

  test('stripeDescription', () => {
    const transactionMultipleItems: Transaction = makeTransactionObj(mockTransactionDtoNewUnpaid);
    const transactionSingleItem: Transaction = {
      ...transactionMultipleItems,
      orderItems: transactionMultipleItems.orderItems.slice(0, 1),
    };
    expect(stripeDescription(transactionSingleItem)).toEqual(
      'Private eSIM #99941010-mockT0 x1 item',
    );
    expect(stripeDescription(transactionMultipleItems)).toEqual(
      'Private eSIM #99941010-mockT0 x2 items',
    );
  });

  describe('hasTheSameCartItems()', () => {
    test('when it has the same items, in the same order', () => {
      const mockCartItems: CartItem[] = [
        {
          id: 0,
          productId: 'indonesia-30d30gb-3hk-mm387860.esim',
          name: 'Product 1',
          location: undefined,
          qty: 1,
          unitPrice: 11,
        },
        {
          id: 1,
          productId: 'indonesia-30d15gb-3hk-mmee0858.topup',
          name: 'Product 2',
          location: undefined,
          qty: 1,
          unitPrice: 22,
        },
      ];
      const transaction = makeTransactionObj(mockTransactionDtoNewUnpaid);
      expect(hasTheSameCartItems(transaction, mockCartItems)).toBe(true);
    });
    test('when it has the same items, NOT in the same order', () => {
      const mockCartItems: CartItem[] = [
        {
          id: 1,
          productId: 'indonesia-30d15gb-3hk-mmee0858.topup',
          name: 'Product 2',
          location: undefined,
          qty: 1,
          unitPrice: 22,
        },
        {
          id: 0,
          productId: 'indonesia-30d30gb-3hk-mm387860.esim',
          name: 'Product 1',
          location: undefined,
          qty: 1,
          unitPrice: 11,
        },
      ];
      const transaction = makeTransactionObj(mockTransactionDtoNewUnpaid);
      expect(hasTheSameCartItems(transaction, mockCartItems)).toBe(true);
    });

    test('when it has the same items, NOT in the same order', () => {
      const mockCartItems: CartItem[] = [
        {
          id: 1,
          productId: 'indonesia-30d15gb-3hk-mmee0858.topup',
          name: 'Product 2',
          location: undefined,
          qty: 1,
          unitPrice: 22,
        },
        {
          id: 0,
          productId: 'indonesia-30d30gb-3hk-mm387860.esim',
          name: 'Product 1',
          location: undefined,
          qty: 1,
          unitPrice: 11,
        },
      ];
      const transaction = makeTransactionObj(mockTransactionDtoNewUnpaid);
      expect(hasTheSameCartItems(transaction, mockCartItems)).toBe(true);
    });

    test('when it has duplicated items, in any order', () => {
      const mockCartItems: CartItem[] = [
        {
          id: 0,
          productId: 'indonesia-30d30gb-3hk-mm387860.esim',
          name: 'Product 1',
          location: undefined,
          qty: 1,
          unitPrice: 11,
        },
        {
          id: 1,
          productId: 'indonesia-30d15gb-3hk-mmee0858.topup',
          name: 'Product 2',
          location: undefined,
          qty: 2,
          unitPrice: 22,
        },
      ];
      const transaction = makeTransactionObj(mockTransactionWithDuplicatesDto);
      expect(hasTheSameCartItems(transaction, mockCartItems)).toBe(true);
    });

    test('when it has different items', () => {
      const mockCartItems: CartItem[] = [
        {
          id: 0,
          productId: 'indonesia-30d30gb-3hk-mm387860.esim',
          name: 'Product 1',
          location: undefined,
          qty: 1,
          unitPrice: 11,
        },
      ];
      const transaction = makeTransactionObj(mockTransactionDtoNewUnpaid);
      expect(hasTheSameCartItems(transaction, mockCartItems)).toBe(false);
    });
  });
});
