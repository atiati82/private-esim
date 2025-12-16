import React, { Suspense } from 'react';

import { RootPageArgs } from '@/lib/types';

import { CheckoutPage } from '@/feat-ordering/checkout.page';

export const dynamic = 'force-dynamic';

const NextCheckoutPage: React.FC<RootPageArgs> = () => {
  return (
    <Suspense fallback={null}>
      <CheckoutPage />
    </Suspense>
  );
};

export default NextCheckoutPage;
