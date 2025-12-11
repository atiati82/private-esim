import React from 'react';

import { isDestinationLocation, isRegionLocation } from '@/data/data-helpers';
import { Destination } from '@/data/destination';
import { Region } from '@/data/region';
import { urlForProductsList } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { FlagIcon } from '@/components/icons/FlagIcon';
import { RegionIcon } from '@/components/icons/RegionIcon';
import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { Headline } from '@/components/ui/Headline';
import { fontSemibold } from '@/styles/typography.css';
import * as styles from './location-card.css';

export interface LocationCardProps {
  className?: string;
  data: Destination | Region;
}

/**
 * Country / City destination card
 *
 * TODO: make region destination a separate component
 */
export const LocationCard: React.FC<LocationCardProps> = ({ className, data }) => {
  const isDestination = isDestinationLocation(data);
  const isRegion = isRegionLocation(data);
  const url = urlForProductsList(data.slug);

  return (
    <Link
      className={cn('location-card', styles.wrapper, className)}
      href={url}
      role="link"
      title={'See best eSIM deals for ' + data.name}
      data-testid={`${isRegion ? 'region' : 'destination'}-${data.id}`}
    >
      {isDestination && <FlagIcon code={data.id} className={cn('card-image', styles.cardImage)} />}
      {isRegion && <RegionIcon code={data.id} className={cn('card-image', styles.cardImage)} />}

      <span className={styles.cardData}>
        <Headline as="span" like="h4" className={cn('card-title', styles.cardTitle)}>
          {data.name}
        </Headline>
        <span className={cn('card-subtitle', styles.cardSubtitle)}>
          <span className={fontSemibold}>{data.productStats.eSimProducts}</span> deals from{' '}
          <CurrencyFormatter
            amount={data.productStats.pricePerGbFrom}
            suffix={'/ GB'}
            narrowVariant={true}
          />
        </span>
      </span>
    </Link>
  );
};
