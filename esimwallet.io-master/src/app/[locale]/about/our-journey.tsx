import React from 'react';

import { Headline } from '@/components/ui/Headline';
import * as styles from './our-journey.css';

export const OurJourney: React.FC = () => {
  return (
    <div className={styles.ourJourneyContainer}>
      <Headline as="h1">Our Journey</Headline>
      <p className={styles.ourJourneySubtitle}>
        From humble beginnings to a global connectivity leader.
      </p>
      <p className={styles.ourJourneyParagraph}>
        Founded in [Year], eSIMWorld was born out of a desire to simplify and enhance the way people
        connect to the world. Our mission is to provide seamless, reliable, and innovative eSIM
        solutions that empower users to stay connected wherever they are. Over the years, we have
        grown from a small startup to a leading provider of eSIM technology, partnering with top
        carriers and device manufacturers worldwide.
      </p>
    </div>
  );
};
