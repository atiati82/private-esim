import React from 'react';

import { isDestinationLocation, isRegionLocation } from '@/data/data-helpers';
import { Destination } from '@/data/destination';
import { Region } from '@/data/region';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { FlagIcon } from '@/components/icons/FlagIcon';
import { RegionIcon } from '@/components/icons/RegionIcon';
import { Headline } from '@/components/ui/Headline';
import { fontSemibold } from '@/styles/typography.css';
import * as styles from './products-list-destination-title.css';

interface ProductsListDestinationTitleProps extends React.PropsWithChildren {
  className?: string;
  /**
   * Destination aka. country, Region or Global (for `undefined`).
   * Based on that we determine where the product is being displayed.
   */
  location: Destination | Region | undefined;
  productsCount?: number;
  href?: string;
}

export const ProductsListDestinationTitle: React.FC<ProductsListDestinationTitleProps> = ({
  className,
  children,
  location,
  productsCount,
  href,
}) => {
  const isDestination = isDestinationLocation(location);
  const isRegion = isRegionLocation(location);
  const titleToShow = children || location?.name;
  if (!titleToShow) {
    return null;
  }

  return (
    <div className={cn(styles.wrapper, className)}>
      {isDestination && <FlagIcon code={location.id} />}
      {isRegion && <RegionIcon code={location.id} />}

      <div className={styles.data}>
        <Headline as="h3" className={styles.title}>
          {href && <Link href={href}>{titleToShow}</Link>}
          {!href && titleToShow}
        </Headline>

        {productsCount !== undefined && (
          <div className={styles.subtitle}>
            <span className={fontSemibold}>{productsCount}</span> eSIM deal(s) found
          </div>
        )}
      </div>
    </div>
  );
};
