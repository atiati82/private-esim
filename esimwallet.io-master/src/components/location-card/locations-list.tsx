import React from 'react';

import { Destination } from '@/data/destination';
import { Region } from '@/data/region';
import { cn } from '@/lib/utils';

import { LocationCard } from '@/components/location-card/location-card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui.shadcn/command';
import * as styles from './locations-list.css';

export interface LocationsListProps<T = Destination | Region> extends React.PropsWithChildren {
  className?: string;
  variant?: 'mini';
  dataItems: T[];
  emptySearchResMsg?: string;
  onLocationSelect?: (location: T) => void;
}

/**
 * Render list of location (cards) as a scrollable `<Command>` items.
 * It's meant to be shown on the popover / dropdown menu (e.g. on product card,
 * where we show list of destinations... or destinations search dropdown).
 */
export const LocationsList: React.FC<LocationsListProps> = ({
  children,
  className,
  variant,
  dataItems,
  emptySearchResMsg,
  onLocationSelect,
}) => {
  const isMiniVariant = variant === 'mini';
  return (
    <Command
      className={cn(
        styles.command_base,
        isMiniVariant ? styles.command_miniVariant : styles.command_defaultVariant,
        className,
      )}
    >
      {/** children might contain Input or CommandInput to filter items on the list */}
      {children}

      <CommandList>
        {emptySearchResMsg && (
          <CommandEmpty data-testid="search-results-info">{emptySearchResMsg}</CommandEmpty>
        )}

        <CommandGroup>
          {dataItems.map((location) => (
            <CommandItem
              key={location.id}
              value={location.id}
              forceMount={true}
              onSelect={onLocationSelect ? () => onLocationSelect(location) : undefined}
              className={styles.commandItem}
            >
              <LocationCard
                data={location}
                className={cn(
                  styles.commandItemLocationCard,
                  isMiniVariant
                    ? styles.commandItemLocationCard_miniVariant
                    : styles.commandItemLocationCard_defaultVariant,
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
