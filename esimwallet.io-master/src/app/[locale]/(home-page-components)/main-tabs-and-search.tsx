import React from 'react';

import { cn } from '@/lib/utils';

import { DestinationsSearch } from '@/app/[locale]/(home-page-components)/destinations-search';
import { LocationTabs } from '@/app/[locale]/(home-page-components)/location-tabs';
import * as styles from './main-tabs-and-search.css';

type MainTabsAndSearchProps = {
  className?: string;
  activeSlug?: string;
};

export const MainTabsAndSearch: React.FC<MainTabsAndSearchProps> = ({ activeSlug, className }) => {
  return (
    <div className={cn(styles.container, className)}>
      <LocationTabs activeSlug={activeSlug} />
      <DestinationsSearch />
    </div>
  );
};
