import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/data-store/store';

import { readCartStateFromLocalStorage } from '@/feat-cart/cart-persist';

/**
 * Cart line item data
 */
export interface CartItem {
  /** Arbitrary ID of the item in the Cart */
  id: number;
  productId: string;
  /** Product Name **/
  name: string;
  /** Location ID or RegionID for which card has been bought. Empty for global items. */
  location: string | undefined;
  /** Item unit price */
  unitPrice: number;
  qty: number;
}
export type CartItemToAdd = Pick<CartItem, 'productId' | 'name' | 'unitPrice' | 'location'>;

export interface CartState {
  cartItems: CartItem[];
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState: () => readCartStateFromLocalStorage(),
  reducers: {
    /**
     * Add new item to the cart.
     * Increase qty, if it's already in the cart.
     */
    addItem(state, action: PayloadAction<CartItemToAdd>) {
      const cartItemToAdd = action.payload;
      const lastId = state.cartItems[state.cartItems.length - 1]?.id ?? -1;

      const itemInCartIdx = state.cartItems.findIndex(
        (cartItem) => cartItem.productId === cartItemToAdd.productId,
      );
      const itemInCart = itemInCartIdx >= 0 && state.cartItems[itemInCartIdx];
      if (itemInCart) {
        state.cartItems[itemInCartIdx] = {
          ...itemInCart,
          ...cartItemToAdd,
          qty: itemInCart.qty + 1,
        };
      } else {
        state.cartItems.push({
          id: lastId + 1,
          qty: 1,
          ...cartItemToAdd,
        });
      }
    },

    /**
     * Delete cart item by its ID.
     * If qty > 1, decrease qty, instead of deleting.
     */
    removeItem: (state, action: PayloadAction<number>) => {
      const idForRemoval = action.payload;
      const itemInCartIdx = state.cartItems.findIndex((item) => item.id === idForRemoval);
      const itemInCart = itemInCartIdx >= 0 && state.cartItems[itemInCartIdx];
      const hasLargeQty = itemInCart && itemInCart.qty > 1;
      if (hasLargeQty) {
        state.cartItems[itemInCartIdx] = {
          ...itemInCart,
          qty: itemInCart.qty - 1,
        };
      } else if (itemInCart) {
        state.cartItems.splice(itemInCartIdx, 1);
      }
    },

    resetCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
  },
});

export const selectCartState = (rootState: RootState): CartState => rootState.cart;

export const selectCartItems = createSelector(
  [(rootState: RootState) => rootState.cart],
  (cartState: CartState) => cartState.cartItems,
);

export const {
  addItem: addItemAction,
  removeItem: removeItemAction,
  resetCart: resetCartAction,
} = cartSlice.actions;
