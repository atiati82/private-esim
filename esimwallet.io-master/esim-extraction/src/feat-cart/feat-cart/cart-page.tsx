'use client';

import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/data-store/store-hooks';

import { Loader } from '@/components/ui/loader';
import { CartDataTable } from '@/feat-cart/cart-data-table';
import { CartDataTableSummary } from '@/feat-cart/cart-data-table-summary';
import { CartState, selectCartState } from '@/feat-cart/cart.store';
import { SecureCheckoutButton } from '@/feat-cart/secure-checkout-button';
import * as styles from './cart-page.css';

export const CartPage: React.FC = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const cartState: CartState = useAppSelector(selectCartState);
  const isCartEmpty = cartState.cartItems.length === 0;

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <Loader variant="short" />;
  }

  return (
    <>
      <CartDataTable cartData={cartState.cartItems} />
      {!isCartEmpty && <CartDataTableSummary cartState={cartState} />}
      {!isCartEmpty && <SecureCheckoutButton className={styles.checkoutButton} />}
    </>
  );
};
