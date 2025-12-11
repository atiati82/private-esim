import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootLayoutArgs } from '@/lib/types';

import { narrowPageContainer } from '@/styles/layout.css';
import { AccountProviders } from './AccountProviders';

const AccountLayout: React.FC<RootLayoutArgs> = ({ children, params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);
  return (
    <AccountProviders locale={locale}>
      <div className={narrowPageContainer} data-testid="my-account-section">
        {children}
      </div>
    </AccountProviders>
  );
};
export default AccountLayout;
