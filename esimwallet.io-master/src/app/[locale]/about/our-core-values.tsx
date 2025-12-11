import React from 'react';

import { Headline } from '@/components/ui/Headline';
import * as styles from './our-core-values.css';

type CoreValues = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type OurCoreValuesProps = {
  values: CoreValues[];
};

export const OurCoreValues: React.FC<OurCoreValuesProps> = ({ values }) => {
  return (
    <div className={styles.ourCoreValuesContainer}>
      <Headline as="h1">Our Core Values</Headline>
      <p className={styles.ourCoreValuesSubTitle}>
        Driving innovation and connectivity for a better future.
      </p>
      <div className={styles.ourCoreValuesGrid}>
        {values.map((data) => (
          <div key={data.title} className={styles.ourCoreValuesItem}>
            <div className={styles.valuesItemIcon}>
              {data.icon}
              <p className={styles.valuesItemTitle}>{data.title}</p>
            </div>
            <p className={styles.valuesItemDescription}>{data.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
