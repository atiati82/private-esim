import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';

import { MyAccount } from '@/app/[locale]/account/MyAccount';
import { Headline } from '@/components/ui/Headline';

// export const dynamic = 'force-dynamic';

const AccountPage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <>
      <Headline>My Account</Headline>
      <MyAccount />
    </>
  );
};

export default AccountPage;
