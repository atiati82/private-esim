import React, { Suspense, use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageParams } from '@/lib/types';

import { AccountVerifyRes } from '@/app/[locale]/account/verify/[token]/AccountVerifyRes';
import { Loader } from '@/components/ui/loader';

// export const dynamic = 'force-dynamic';

interface AccountVerifyPageArgs {
  params: Promise<
    RootPageParams & {
      token: string;
    }
  >;
}

/**
 * Show confirmation page after user click on confirmation link from the email.
 * It should show a success message, that account has been confirmed.
 * Can also show errors in case of errors in token, invalid token, already activate token etc.
 */
const AccountEmailVerifyPage: React.FC<AccountVerifyPageArgs> = ({ params }) => {
  const { locale, token } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <>
      <Suspense fallback={<Loader variant="short" />}>
        <AccountVerifyRes token={token} />
      </Suspense>
    </>
  );
};

export default AccountEmailVerifyPage;
