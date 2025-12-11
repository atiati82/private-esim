import React from 'react';

import { urlForCart } from '@/lib/urls';
import { cn, pluralize } from '@/lib/utils';
import { Link } from '@/navigation';

import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { Transaction } from '../transactions/transactions';
import * as styles from './checkout-order-summary.css';

type CheckoutOrderSummaryProps = {
  transaction: Transaction;
};

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({ transaction }) => {
  const transactionItems = transaction.orderItems?.length ?? 0;
  const itemsLabel = transactionItems + ' ' + pluralize(transactionItems, 'order item');

  const editLinkUrl = urlForCart();
  const editLinkTitle = 'Go back and change your order';

  return (
    <div className={cn(styles.wrapper)}>
      <div>
        <Link href={editLinkUrl} className={cn(styles.itemsLine)} title={editLinkTitle}>
          {itemsLabel}
        </Link>
        <span className={styles.orderId}>
          Order ID <code>#{transaction.id}</code>
        </span>
      </div>

      <div className={styles.columnEnd}>
        <CurrencyFormatter amount={transaction.total} amountInCents={true} />
        <br />
        <Link href={editLinkUrl} className={styles.orderEditLink} title={editLinkTitle}>
          Edit
        </Link>
      </div>
    </div>
  );
};
