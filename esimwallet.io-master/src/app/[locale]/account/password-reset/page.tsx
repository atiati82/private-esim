import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';

import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';

const AccountPasswordPage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <>
      <Headline>Reset your password</Headline>
      <Textual>@TODO</Textual>
    </>
  );
};

export default AccountPasswordPage;
