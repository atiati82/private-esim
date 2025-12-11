import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlugIcon } from 'lucide-react';

import { UrlForPage, urlForPage } from '@/lib/urls';

import { dataSupported } from '@/app/[locale]/(home-page-components)/compatible-devices-data';
import { Button } from '@/components/ui.shadcn/form/button';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';
import { prose } from '@/styles/typography.css';
import * as styles from './compatible-devices-card.css';

export const CompatibleDevicesCard: React.FC = () => {
  return (
    <div className={styles.compatibleDevicesCardWrapper}>
      <PlugIcon className={styles.compatibleDevicesCardIcon} />
      <Headline as="h2">Check if your device supports eSIM</Headline>
      <div className={styles.compatibleDevicesCardWrapperImage}>
        {dataSupported.deviceImage.map((phone) => (
          <div key={phone.os} className={styles.compatibleDevicesCardImage}>
            <Image alt={phone.os} src={phone.url} width={430} height={662} loading="lazy" />
          </div>
        ))}
      </div>
      <div>
        <Headline as="h4">Devices 100% Supported:</Headline>
        {dataSupported.deviceSupported.map((device) => (
          <div key={device.brand} className={prose}>
            <Textual variant="footer">
              {device.brand}:{' '}
              {device.brand === 'Others' ? (
                <>
                  {device.series.split('here.')}
                  <Link href={`${urlForPage(UrlForPage.CompatibleDevices)}`}>here.</Link>
                </>
              ) : (
                device.series
              )}
            </Textual>
          </div>
        ))}
      </div>
      <Button variant="primary" className={styles.compatibleDevicesCardButton}>
        <Link href={`${urlForPage(UrlForPage.CompatibleDevices)}`}>Check Your Device</Link>
      </Button>
    </div>
  );
};
