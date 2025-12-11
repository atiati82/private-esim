import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';

import { HomePageTabDestinations } from '@/app/[locale]/(esims)/tab-local-destinations';
import { HomePageBitsAndPieces } from '@/app/[locale]/(home-page-components)/HomePageBitsAndPieces';
import { LatestPosts } from '@/app/[locale]/(home-page-components)/latest-posts';
import { MainHero } from '@/app/[locale]/(home-page-components)/main-hero';

const LocalEsimsIndexPage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);
  return (
    <main style={{ background: 'transparent', minHeight: '100vh' }}>
      <MainHero />
      <HomePageTabDestinations />
      <HomePageBitsAndPieces />
      <LatestPosts />
    </main>
  );
};
export default LocalEsimsIndexPage;
