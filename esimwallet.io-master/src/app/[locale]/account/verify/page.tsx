import React, { Suspense, use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';

import { Loader } from '@/components/ui/loader';
import { RenderFlashMessage } from '@/components/ui/message/render-flash-message';

const AccountVerifyPage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <>
      <Suspense fallback={<Loader variant="short" />}>
        <RenderFlashMessage />
      </Suspense>
    </>
  );
};

export default AccountVerifyPage;
