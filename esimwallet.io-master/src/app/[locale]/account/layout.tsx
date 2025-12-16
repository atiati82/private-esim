import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';

import { narrowPageContainer } from '@/styles/layout.css';
import { AccountProviders } from './AccountProviders';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const AccountLayout: React.FC<LayoutProps> = ({ children, params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale as Locale);
  return (
    <AccountProviders locale={locale as Locale}>
      <div className={narrowPageContainer} data-testid="my-account-section">
        {children}
      </div>
    </AccountProviders>
  );
};
export default AccountLayout;
