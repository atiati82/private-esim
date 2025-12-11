import React from 'react';

import { cn } from '@/lib/utils';

import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { getCartOrderTotal } from '@/feat-cart/cart-helpers';
import { CartState } from '@/feat-cart/cart.store';
import * as styles from './cart-data-table-summary.css';

export interface CartSummaryProps {
  cartState: CartState;
}

export const CartDataTableSummary: React.FC<CartSummaryProps> = ({ cartState }) => {
  const total = getCartOrderTotal(cartState.cartItems);
  return (
    <div className={styles.container}>
      <div className={styles.summaryRow}>
        <div className={styles.columnDescr}>Subtotal</div>
        <div className={styles.columnAmount}>
          <CurrencyFormatter amount={total} />
        </div>
      </div>
      <div className={styles.summaryRow}>
        <div className={styles.columnDescr}>Tax 0%</div>
        <div className={styles.columnAmount}>
          <CurrencyFormatter amount={0} />
        </div>
      </div>
      <div className={cn(styles.summaryRow, styles.summaryRowFinal)}>
        <div className={styles.columnDescr}>Total</div>
        <div className={styles.columnAmount}>
          <CurrencyFormatter amount={total} />
        </div>
      </div>
    </div>
  );
};
