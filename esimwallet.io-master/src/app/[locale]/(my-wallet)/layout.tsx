import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';

import { Headline } from '@/components/ui/Headline';
import { narrowPageContainer } from '@/styles/layout.css';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const MyWalletLayout: React.FC<LayoutProps> = ({ children, params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale as Locale);

  return (
    <div className={narrowPageContainer}>
      <Headline>My Wallet</Headline>
      {children}
    </div>
  );
};
export default MyWalletLayout;
