import React from 'react';

import { Headline } from '@/components/ui/Headline';
import * as styles from './about-hero.css';

export const AboutHero: React.FC = () => {
  return (
    <div className={styles.aboutHeroContainer}>
      <p className={styles.aboutHeroSubTitle}>
        Connecting the world with Innovative eSIM Solutions
      </p>
      <Headline as="h1" align="center">
        About eSIMwallet
      </Headline>
      <p className={styles.aboutHeroDescription}>
        Your trusted partner in seamless global connectivity.
      </p>
    </div>
  );
};
