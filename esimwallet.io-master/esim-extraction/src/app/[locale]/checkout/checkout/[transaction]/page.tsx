import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { RootPageParams } from '@/lib/types';
import { appGetPayload } from '@/payload/utils/get-payload';

import { CheckoutTransactionPage } from '@/feat-ordering/checkout-transaction.page';
import { findTransaction } from '@/feat-ordering/transactions/find-transactions';

export const dynamic = 'force-dynamic';

export interface NextCheckoutTransactionPageParams {
  transaction: string;
}
export interface NextCheckoutTransactionPageArgs {
  params: Promise<RootPageParams & NextCheckoutTransactionPageParams>;
}

const NextCheckoutTransactionPage: React.FC<NextCheckoutTransactionPageArgs> = async ({
  params,
}) => {
  const { transaction: transactionId } = await params;
  const payload = await appGetPayload();
  const transaction = await findTransaction(payload, transactionId);
  if (!transaction) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <CheckoutTransactionPage transaction={transaction} />
    </Suspense>
  );
};

export default NextCheckoutTransactionPage;
