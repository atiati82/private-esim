import React from 'react';

import { CompatibleDevicesCard } from '@/app/[locale]/(home-page-components)/compatible-devices-card';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import * as styles from './compatible-devices.css';

export const CompatibleDevices: React.FC = () => {
  return (
    <div className={styles.compatibleDevicesWrapper}>
      <Headline like="h1" className={styles.compatibleDevicesHeadline}>
        Compatible Devices
      </Headline>
      <Textual variant="muted" className={styles.compatibleDevicesSubtitle}>
        Your hassle-free solution to switch and manage mobile networks anywhere, anytime
      </Textual>
      <CompatibleDevicesCard />
    </div>
  );
};
