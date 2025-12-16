import React from 'react';

import { Destination } from '@/data/destination';
import { findDestinations } from '@/data/find-destinations';
import { appGetPayload } from '@/payload/utils/get-payload';

import { LocationCard } from '@/components/location-card/location-card';
import { Headline } from '@/components/ui/Headline';
import { pageContainer } from '@/styles/layout.css';
import * as styles from './tab-local-destinations.css';

export const HomePageTabDestinations: React.FC = async () => {
  const payload = await appGetPayload();
  const allDestinations: Destination[] = await findDestinations(payload);
  const destinations = allDestinations.filter((d) => d.isTopDestination);

  return (
    <div className={pageContainer}>
      <div className={styles.headlineContainer}>
        <Headline like="h1-small">Most Popular Destinations</Headline>
      </div>
      <div className={styles.cardsGrid}>
        {destinations.map((destination) => {
          return (
            <LocationCard className={styles.cardGridEl} key={destination.id} data={destination} />
          );
        })}
      </div>
    </div>
  );
};
