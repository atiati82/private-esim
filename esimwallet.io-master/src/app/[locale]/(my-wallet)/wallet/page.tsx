import React, { Suspense, use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageParams } from '@/lib/types';

import { WalletPage } from '@/feat-wallet/wallet.page';

export interface NextWalletPageParams {
  order: string;
}
export interface NextWalletPageArgs {
  params: Promise<RootPageParams & NextWalletPageParams>;
}

const NextMyWalletPage: React.FC<NextWalletPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <WalletPage />
    </Suspense>
  );
};

export default NextMyWalletPage;
