import { beforeEach, describe, expect, test } from 'vitest';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import { RootState } from '@/data-store/store';

import {
  addItemAction,
  CartItem,
  cartSlice,
  removeItemAction,
  resetCartAction,
  selectCartItems,
} from '@/feat-cart/cart.store';
import {
  mockCartItemToAdd0 as cartItem0,
  mockCartItemToAdd1 as cartItem1,
  mockCartItemsDummy,
} from '@/testing/cart.mock';

describe('Store: Cart / Checkout', () => {
  let store: EnhancedStore<RootState>;
  let rootState: RootState;

  beforeEach(() => {
    store = configureStore({
      reducer: { cart: cartSlice.reducer },
    }) as EnhancedStore<RootState>;
    store.subscribe(() => (rootState = store.getState()));
    rootState = store.getState();
  });

  test('initial state', () => {
    expect(selectCartItems(rootState)).toEqual([]);
  });

  test('add new item', () => {
    store.dispatch(addItemAction(cartItem0));
    expect(selectCartItems(rootState)).toEqual([
      { ...cartItem0, id: 0, qty: 1 } satisfies CartItem,
    ]);
  });

  test('add another item', () => {
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(addItemAction(cartItem1));
    expect(selectCartItems(rootState)).toEqual([
      { ...cartItem0, id: 0, qty: 1 } satisfies CartItem,
      { ...cartItem1, id: 1, qty: 1 } satisfies CartItem,
    ]);
  });

  test('add item again', () => {
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(addItemAction(cartItem1));
    store.dispatch(addItemAction(cartItem1));
    store.dispatch(addItemAction(cartItem1));
    expect(selectCartItems(rootState)).toEqual([
      { ...cartItem0, id: 0, qty: 1 } satisfies CartItem,
      { ...cartItem1, id: 1, qty: 3 } satisfies CartItem,
    ]);
  });

  test('remove item', () => {
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(removeItemAction(0));
    expect(selectCartItems(rootState)).toEqual([]);
  });

  test('remove item: decrease qty', () => {
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(removeItemAction(0));
    expect(selectCartItems(rootState)).toEqual([
      { ...cartItem0, id: 0, qty: 2 } satisfies CartItem,
    ]);
  });

  test('remove item: non-existing', () => {
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(removeItemAction(555));
    expect(selectCartItems(rootState)).toEqual([
      { ...cartItem0, id: 0, qty: 1 } satisfies CartItem,
    ]);
  });

  test('reset cart', () => {
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(addItemAction(cartItem0));
    store.dispatch(resetCartAction([]));
    expect(selectCartItems(rootState)).toEqual([]);
  });
  test('reset cart: to custom state', () => {
    store.dispatch(resetCartAction(mockCartItemsDummy));
    expect(selectCartItems(rootState).length).toEqual(mockCartItemsDummy.length);
  });
});
