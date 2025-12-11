import React from 'react';

import { findRegions } from '@/data/find-regions';
import { Region } from '@/data/region';
import { appGetPayload } from '@/payload/utils/get-payload';

import { LocationCard } from '@/components/location-card/location-card';
import { Headline } from '@/components/ui/Headline';
import * as styles from './tab-regions.css';

export const HomePageTabRegions: React.FC = async () => {
  const payload = await appGetPayload();
  const regions: Region[] = await findRegions(payload);

  return (
    <div className={styles.pageWrapper}>
      <Headline like="h2-large" className={styles.headline}>
        Get eSIM data for entire continent
      </Headline>
      <div className={styles.cardsGrid}>
        {regions.map((region: Region) => {
          return <LocationCard key={region.id} className={styles.cardGridEl} data={region} />;
        })}
      </div>
    </div>
  );
};
