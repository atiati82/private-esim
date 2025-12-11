import React from 'react';

import { HowItWorksData } from '@/app/[locale]/(home-page-components)/how-it-works-data';
import { HowItWorksList } from '@/app/[locale]/(home-page-components)/how-it-works-list';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import * as styles from './how-it-works.css';

export const HowItWorks: React.FC = () => {
  return (
    <div className={styles.howItWorksWrapper}>
      <Headline like="h1">How Private eSIM Works</Headline>
      <Textual variant="muted" className={styles.howItWorksSubtitle}>
        Your hassle-free solution to switch and manage mobile networks anywhere, anytime
      </Textual>
      <HowItWorksList items={HowItWorksData} />
    </div>
  );
};
