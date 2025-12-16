import { describe, expect, test } from 'vitest';

import { cartItemsToProductIds, getCartOrderTotal } from '@/feat-cart/cart-helpers';
import { mockCartItemsDummy } from '@/testing/cart.mock';

describe('cart helpers', function () {
  test('getCartOrderTotal', () => {
    expect(getCartOrderTotal(mockCartItemsDummy)).toBe(369.99);
  });

  test('cartItemsToOrderItems', () => {
    expect(cartItemsToProductIds(mockCartItemsDummy)).toEqual([
      'product-0',
      'product-1',
      'product-1',
      'product-1',
      'product-2',
      'product-2',
    ]);
  });
});
