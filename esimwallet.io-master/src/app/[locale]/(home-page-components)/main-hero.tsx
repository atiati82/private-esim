import React from 'react';
import { useTranslations } from 'next-intl';
import { ShipWheel } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { MainHeroCard } from '@/app/[locale]/(home-page-components)/main-hero-card';
import { MainTabsAndSearch } from '@/app/[locale]/(home-page-components)/main-tabs-and-search';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import { flexContainerCC } from '@/styles/layout.css';
import * as styles from './main-hero.css';

export const MainHero: React.FC = () => {
  const t = useTranslations();
  return (
    <div className={styles.heroWrapper}>
      <main className={styles.heroContainer}>
        <p className={cn(flexContainerCC, styles.badge)}>
          <ShipWheel strokeWidth={1} size={20} />
          <span>Get Internet Access Anywhere Anytime!</span>
        </p>
        <Headline as="h1" className={styles.headline}>
          <Link href="/">{t('Index.welcome')}</Link>
        </Headline>
        <Textual variant="muted" className={styles.subtitle}>
          {t('Index.welcome2')}
        </Textual>
        <MainTabsAndSearch />
      </main>
      <MainHeroCard />
    </div>
  );
};
