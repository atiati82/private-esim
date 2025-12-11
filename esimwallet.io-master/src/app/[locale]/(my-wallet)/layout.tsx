import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootLayoutArgs } from '@/lib/types';

import { Headline } from '@/components/ui/Headline';
import { narrowPageContainer } from '@/styles/layout.css';

const MyWalletLayout: React.FC<RootLayoutArgs> = ({ children, params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <div className={narrowPageContainer}>
      <Headline>My Wallet</Headline>
      {children}
    </div>
  );
};
export default MyWalletLayout;
