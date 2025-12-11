import React, { Suspense, use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';

import { AccountCreateForm } from '@/app/[locale]/account/create/AccountCreateForm';
import { Loader } from '@/components/ui/loader';

const AccountCreatePage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <AccountCreateForm />
      </Suspense>
    </>
  );
};

export default AccountCreatePage;
