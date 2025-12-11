import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { RootPageParams } from '@/lib/types';
import { appGetPayload } from '@/payload/utils/get-payload';

import { TransactionPage } from '@/feat-ordering/transactions-listing/transaction.page';
import { findTransaction } from '@/feat-ordering/transactions/find-transactions';
import { narrowPageContainer } from '@/styles/layout.css';

export const dynamic = 'force-dynamic';

export interface NextTransactionPageParams {
  transaction: string;
}
export interface NextTransactionPageArgs {
  params: Promise<RootPageParams & NextTransactionPageParams>;
}

const NextTransactionPage: React.FC<NextTransactionPageArgs> = async ({ params }) => {
  const { transaction: transactionId } = await params;
  const payload = await appGetPayload();
  const transaction = await findTransaction(payload, transactionId);
  if (!transaction) {
    notFound();
  }

  return (
    <div className={narrowPageContainer}>
      <Suspense fallback={null}>
        <TransactionPage transaction={transaction} />
      </Suspense>
    </div>
  );
};

export default NextTransactionPage;
