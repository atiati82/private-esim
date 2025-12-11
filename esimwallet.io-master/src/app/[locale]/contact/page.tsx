import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';

import { Headline } from '@/components/ui/Headline';
import { pageContainer } from '@/styles/layout.css';

const ContactPage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <div className={pageContainer}>
      <Headline as="h1" align="center">
        Contact Us
      </Headline>
    </div>
  );
};

export default ContactPage;
