import React from 'react';

import { Headline } from '@/components/ui/Headline';
import * as styles from './cutting-edge-technology.css';

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type CuttingEdgeTechnologyProps = {
  features: Feature[];
};

export const CuttingEdgeTechnology: React.FC<CuttingEdgeTechnologyProps> = ({ features }) => {
  return (
    <div className={styles.cuttingEdgeTechnologyContainer}>
      <Headline as="h1">Cutting-Edge Technology</Headline>
      <p className={styles.cuttingEdgeTechnologySubTitle}>
        Leading the way with innovative eSIM solutions.
      </p>
      <p className={styles.cuttingEdgeTechnologyDescription}>
        At eSIMWorld, we leverage the latest advancements in eSIM technology to provide our
        customers with unparalleled connectivity solutions. Our technology is designed to be
        user-friendly, secure, and adaptable to various devices and networks.
      </p>
      <div className={styles.dataInfo}>
        {features.map((data) => (
          <div key={data.title} className={styles.cardDataInfo}>
            {data.icon}
            <p className={styles.cardDataInfoTitle}>{data.title}</p>
            <p>{data.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
