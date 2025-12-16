import React from 'react';
import { ShieldCheckIcon } from 'lucide-react';

import { urlForCheckout } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { ButtonLink } from '@/navigation';

import * as styles from './secure-checkout-button.css';

type SecureCheckoutProps = {
  className?: string;
  children?: React.ReactNode | undefined;
  style?: React.CSSProperties;
};

export const SecureCheckoutButton: React.FC<SecureCheckoutProps> = ({
  children = 'Secure Checkout',
  className,
  style,
}) => {
  return (
    <ButtonLink
      style={style}
      href={urlForCheckout()}
      className={cn(styles.checkoutButton, className)}
    >
      <ShieldCheckIcon className={styles.checkoutButtonIcon} /> {children}
    </ButtonLink>
  );
};
