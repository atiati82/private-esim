import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Headline } from '@/components/ui/Headline';
import * as styles from './headline-hero.css';

interface HeadlineHeroProps extends HeadlineHeroTip {
  title: string;
  subtitle?: string;
  className?: string;
}

interface HeadlineHeroTip {
  tip?: string;
  tipIcon?: ReactNode;
}

export const HeadldineHeroTip: React.FC<HeadlineHeroTip> = ({ tip, tipIcon }) => {
  return (
    <div className={styles.headlineHeroTip}>
      {tipIcon}
      <p>{tip}</p>
    </div>
  );
};
export const HeadlineHero: React.FC<HeadlineHeroProps> = ({ title, subtitle, tip, tipIcon, className }) => {
  return (
    <div className={cn(styles.headlineHeroContainer, className)}>
      {tip && <HeadldineHeroTip tip={tip} tipIcon={tipIcon} />}
      <Headline like="h1" align="center" className={styles.headlineHeroTitle}>
        {title}
      </Headline>
      {subtitle && (
        <Headline like="h2" align="center" className={styles.headlineHeroSubtitle}>
          {subtitle}
        </Headline>
      )}
    </div>
  );
};
