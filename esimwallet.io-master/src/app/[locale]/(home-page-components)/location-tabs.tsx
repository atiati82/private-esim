import React from 'react';
import { useTranslations } from 'next-intl';

import { GlobalEsimsUrlSegment, RegionEsimsUrlSegment } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { ButtonLink } from '@/navigation';

import { ButtonGroup } from '@/components/ui.shadcn/form/button-group';
import * as styles from './location-tabs.css';

type LocationTabsProps = {
  className?: string;
  activeSlug?: string;
};

/**
 * Main location tabs: Local | Regional | Global
 */
export const LocationTabs: React.FC<LocationTabsProps> = ({ activeSlug = '', className }) => {
  const t = useTranslations();

  const tabItems = [
    {
      label: t('IndexHero.tab-local-esims'),
      slug: '',
    },
    {
      label: t('IndexHero.tab-region-esims'),
      slug: RegionEsimsUrlSegment,
    },
    {
      label: t('IndexHero.tab-global-esims'),
      slug: GlobalEsimsUrlSegment,
    },
  ];

  return (
    <div className={cn(styles.container, className)}>
      <ButtonGroup className={styles.buttonGroup}>
        {tabItems.map((tabItem) => {
          return (
            <ButtonLink
              key={tabItem.slug}
              className={cn(tabItem.slug === activeSlug && 'active')}
              href={`/${tabItem.slug}`}
            >
              {tabItem.label}
            </ButtonLink>
          );
        })}
      </ButtonGroup>
    </div>
  );
};
