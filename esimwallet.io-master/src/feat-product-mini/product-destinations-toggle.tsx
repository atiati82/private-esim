import React from 'react';

import { isDestinationLocation } from '@/data/data-helpers';
import { Destination } from '@/data/destination';
import { EsimProduct } from '@/data/esim-product';
import { Region } from '@/data/region';
import { cn, pluralize } from '@/lib/utils';

import { FlagIcon } from '@/components/icons/FlagIcon';
import { LocationsList } from '@/components/location-card/locations-list';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui.shadcn/popover';
import { Separator } from '@/components/ui.shadcn/separator';
import { fontSemibold, textSm } from '@/styles/typography.css';
import * as styles from './product-destinations-toggle.css';

interface EsimProductCountriesProps {
  className?: string;
  product: EsimProduct;
  /**
   * When undefined, it means we show info in global context (where location isn't provided
   * nor is relevant).
   */
  currentLocation: Destination | Region | undefined;

  /**
   * Long version inside product details card
   */
  isDetailsView?: boolean;

  /**
   * Extra label to render (ATM, only for the short view) after the icon / badge
   */
  suffixLabel?: string;
}

/**
 * Renders info about destinations for given product.
 *
 * Detailed list of destination (cards) is being shown on click, on the popover.
 */
export const ProductDestinationsToggle: React.FC<EsimProductCountriesProps> = ({
  className,
  product,
  currentLocation,
  isDetailsView,
  suffixLabel,
}) => {
  const destinationsCount = product.destinations.length;
  const hasOtherDestinations = product.destinations.length > 1;
  const otherDestinationsCount = product.destinations.length - 1;

  /**
   * Destination info is being shown in a Destination context (i.e. not regional or global listing)
   */
  const isDestinationView = isDestinationLocation(currentLocation);

  const actualDestination = isDestinationView
    ? currentLocation
    : !hasOtherDestinations
      ? product.destinations[0]
      : undefined;

  let tooltipTitle = `Works in ${destinationsCount} ${pluralize(destinationsCount, 'destination')}`;
  if (actualDestination) {
    if (hasOtherDestinations) {
      tooltipTitle += `, incl. ${actualDestination!.name}`;
    } else {
      tooltipTitle += `: ${actualDestination!.name}`;
    }
  }
  tooltipTitle += hasOtherDestinations ? '. Click to view full list.' : '.';

  const TriggerShortView: React.FC = () => (
    <>
      {(actualDestination && (
        <>
          <FlagIcon code={actualDestination.id} className={styles.triggerFlagIcon} />
          {hasOtherDestinations && (
            <span className={cn(styles.triggerCountBadge, styles.triggerCountBadgeAsSuffix)}>
              +{otherDestinationsCount}
            </span>
          )}
        </>
      )) || (
        <>
          <span className={styles.triggerCountBadge}>{destinationsCount}</span>
        </>
      )}
      {suffixLabel}
    </>
  );
  const TriggerDetailsView: React.FC = () => (
    <>
      {(actualDestination && (
        <>
          Works in {actualDestination.name}
          {hasOtherDestinations && (
            <>
              <span className={cn(styles.triggerCountBadge, styles.triggerCountBadgeDetailsView)}>
                +{otherDestinationsCount}
              </span>
              <span>other {pluralize(otherDestinationsCount, 'destination')}.</span>
            </>
          )}
          {!hasOtherDestinations && <span>&nbsp;only.</span>}
        </>
      )) || (
        <>
          Works in{' '}
          <span className={cn(styles.triggerCountBadge, styles.triggerCountBadgeDetailsView)}>
            {destinationsCount}
          </span>
          <span>{pluralize(otherDestinationsCount, 'destination')}.</span>
        </>
      )}
    </>
  );

  return (
    <div
      className={cn(
        styles.container,
        isDetailsView ? styles.containerDetailsView : styles.containerShortView,
        className,
      )}
    >
      <Popover>
        <PopoverTrigger className={styles.popoverTriggerButton} title={tooltipTitle}>
          {(isDetailsView && <TriggerDetailsView />) || <TriggerShortView />}
        </PopoverTrigger>

        {((isDestinationView && hasOtherDestinations) || !isDestinationView) && (
          <PopoverContent style={{ width: '16rem' }}>
            <p className={textSm}>
              <span className={fontSemibold}>{product.name}</span> {product.productTypeLabel} works
              in {pluralize(destinationsCount, 'this', 'these')}
              <span
                className={cn(
                  styles.triggerCountBadge,
                  styles.triggerCountBadgeDetailsView,
                  styles.triggerCountBadgeInPopoverContent,
                )}
              >{` ${destinationsCount} `}</span>
              {pluralize(destinationsCount, 'destination')}:
            </p>
            <Separator space="s1" className={styles.popoverContentSeparator} />
            <LocationsList
              className={styles.locationsList}
              dataItems={product.destinations}
              variant="mini"
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
};
