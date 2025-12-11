import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { RootPageArgs } from '@/lib/types';
import { RegionEsimsUrlSegment } from '@/lib/urls';

import { HomePageTabRegions } from '@/app/[locale]/(esims)/regional-esim/tab-regions';
import { MainTabsAndSearch } from '@/app/[locale]/(home-page-components)/main-tabs-and-search';

const RegionsIndexPage: React.FC<RootPageArgs> = ({ params }) => {
  const { locale } = use(params);
  unstable_setRequestLocale(locale);
  return (
    <div className="text-center">
      <MainTabsAndSearch activeSlug={RegionEsimsUrlSegment} />
      <HomePageTabRegions />
    </div>
  );
};
export default RegionsIndexPage;
