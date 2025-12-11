import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';

import AboutPageContent from '@/app/[locale]/about/about-content';
import { dataFeatures } from '@/app/[locale]/about/cutting-edge-technology-data';
import { dataOwner } from '@/app/[locale]/about/meet-our-team-data';
import { coreData } from '@/app/[locale]/about/our-core-values-data';

const AboutPage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);

  return (
    <div>
      <AboutPageContent features={dataFeatures} members={dataOwner} values={coreData} />
    </div>
  );
};

export default AboutPage;
