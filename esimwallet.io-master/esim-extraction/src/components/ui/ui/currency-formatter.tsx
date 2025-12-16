import React from 'react';

import { formatCurrencyVal } from '@/lib/esim-wallet';
import { cn } from '@/lib/utils';

import * as styles from './currency-formatter.css';

export interface CurrencyFormatterProps {
  className?: string;
  amount: number | undefined | null;
  amountInCents?: boolean;
  suffix?: string;
  narrowVariant?: boolean;
}

export const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({
  className,
  amount,
  amountInCents,
  suffix,
  narrowVariant,
}) => {
  const isNullishVal = amount === null || amount === undefined;
  const val = isNullishVal ? '—' : formatCurrencyVal(amount as number, amountInCents);
  return (
    <span className={cn('currency-formatter', styles.container, className)}>
      <span className={cn('currency-amount', styles.amount)}>
        ${narrowVariant ? '' : ' '}
        {val}
      </span>
      {suffix && <span className={cn('currency-amount-suffix', styles.suffix)}>{suffix}</span>}
    </span>
  );
};
