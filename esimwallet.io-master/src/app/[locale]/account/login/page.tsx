import React, { Suspense, use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';

import { LoginForm } from '@/app/[locale]/account/login/LoginForm';
import { Loader } from '@/components/ui/loader';

const AccountCreatePage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <LoginForm />
      </Suspense>
    </>
  );
};

export default AccountCreatePage;
