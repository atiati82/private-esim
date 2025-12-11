import isEqual from 'lodash/isEqual';

import type { CartState } from '@/feat-cart/cart.store';

let _lastStateInLocalStorage: CartState;

export function readCartStateFromLocalStorage(): CartState {
  const cartState: CartState = { cartItems: [] };

  if (typeof window !== 'undefined') {
    try {
      const storedCartRaw = localStorage.getItem('cartState');
      if (storedCartRaw) {
        const storedCart: CartState = JSON.parse(storedCartRaw);
        // TODO: probably we should do more check...
        if (Array.isArray(storedCart.cartItems)) {
          cartState.cartItems = storedCart.cartItems;
        }
      }
    } catch (error) {
      console.warn('Error reading Cart from localStorage:', error);
    }

    _lastStateInLocalStorage = cartState;
  }
  return cartState;
}

export function writeCartToLocalStorage(cartState: CartState): void {
  if (typeof window !== 'undefined') {
    if (!isEqual(cartState, _lastStateInLocalStorage)) {
      try {
        localStorage.setItem('cartState', JSON.stringify(cartState));
      } catch (err) {
        console.warn('Error while persisting Cart state...', err);
      }
    }
  }
}
