import React from 'react';
import Image from 'next/image';

import * as styles from './main-hero-card.css';

export const MainHeroCard: React.FC = () => {
  return (
    <div className={styles.mainCardHeroImage}>
      <Image
        alt="hero-card-image"
        src="/images/hero-card-image.svg"
        width={545}
        height={352}
        loading="lazy"
        className={styles.mainHeroImage}
      />
    </div>
  );
};
