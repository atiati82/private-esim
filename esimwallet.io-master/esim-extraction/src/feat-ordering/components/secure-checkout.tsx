import React from 'react';
import { ShieldCheckIcon } from 'lucide-react';

import { Headline } from '@/components/ui/Headline';
import { Message, MessageProps } from '@/components/ui/message/message';
import { narrowPageContainer, screenReaderOnly } from '@/styles/layout.css';
import { textErrorCode } from '@/styles/typography.css';
import * as styles from './secure-checkout.css';

export const SecureCheckout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className={narrowPageContainer}>
    <Headline className={styles.headline}>
      <ShieldCheckIcon size={32} className={styles.headlineIcon} />
      <span className={styles.poweredByContainer}>
        Secure Checkout
        <PoweredByStripe />
      </span>
    </Headline>
    {children}
  </div>
);

type SecureCheckoutStatusProps = React.PropsWithChildren & {
  title: string;
  variant: MessageProps['variant'];
  errorCode?: string;
  showIcon?: boolean;
};
export const SecureCheckoutStatus: React.FC<SecureCheckoutStatusProps> = ({
  title,
  children,
  errorCode,
  variant,
  showIcon = false,
}) => {
  return (
    <Message title={title} variant={variant} showIcon={showIcon}>
      <div>{children}</div>
      {errorCode && <code className={textErrorCode}>{errorCode}</code>}
    </Message>
  );
};

const PoweredByStripe: React.FC = () => (
  <a
    href="https://stripe.com/"
    className={styles.poweredBy}
    title="Secure payments by stripe.com"
    target="_blank"
    rel="noreferrer"
  >
    <span className={screenReaderOnly}>Powered by stripe</span>
  </a>
);
