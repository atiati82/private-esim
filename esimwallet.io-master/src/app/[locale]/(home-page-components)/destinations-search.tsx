'use client';

import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { LoaderIcon, SearchIcon } from 'lucide-react';

import { searchQuery, selectSearchQuery } from '@/data-store/destinations';
import { useGetDestinationsQuery } from '@/data-store/destinations-api';
import { selectRouterParam } from '@/data-store/router/router';
import { useAppDispatch, useAppSelector } from '@/data-store/store-hooks';
import { Destination } from '@/data/destination';
import { Region } from '@/data/region';
import { searchDestinations } from '@/data/search';
import { urlForProductsList } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { useRouter } from '@/navigation';

import { LocationsList } from '@/components/location-card/locations-list';
import { formItemWithIcon } from '@/components/ui.shadcn/form/form.css';
import { Input } from '@/components/ui.shadcn/form/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui.shadcn/popover';
import { animSpinner } from '@/styles/animations/animations.css';
import * as styles from './destinations-search.css';

export const DestinationsSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const { data: destinations, error, isLoading } = useGetDestinationsQuery();
  const currentSearchQuery = useAppSelector(selectSearchQuery);
  const storeRouterParam = useAppSelector(selectRouterParam('store'));

  useEffect(() => {
    const isStoreLink = storeRouterParam !== undefined;
    if (isStoreLink) {
      setOpen(true);
    } else {
      setOpen(false); // w/o this, it keeps re-opening after navigating to sub-pages
    }
  }, [storeRouterParam]);

  // Only show spinner when search field is FOCUSED (OPEN)
  const InputIcon =
    open && isLoading ? (
      <LoaderIcon strokeWidth={1} className={animSpinner} />
    ) : (
      <SearchIcon strokeWidth={1} />
    );

  const onCloseAutoFocus = (e: Event): void => {
    e.preventDefault(); // don't re-focus on trigger INPUT (after router.push() navigation)
  };
  const onDestinationSelected = (destination: Destination | Region): void => {
    setOpen(false);
    router.push(urlForProductsList(destination.slug));
  };
  const handleKeyDownOnFakeInput = (ev: React.KeyboardEvent<HTMLInputElement>): void => {
    ev.preventDefault(); // prevent UI scrolling
    setOpen(true);
  };
  const handleInputChange = useCallback(
    debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(searchQuery(ev.target.value));
    }, 200),
    [],
  );

  const foundDestinations = searchDestinations(destinations ?? [], currentSearchQuery);
  const hasFoundDestinations = foundDestinations.length > 0;
  const hasSearchQuery = currentSearchQuery.length > 0;

  let searchResultsInfo = '';
  if (isLoading && hasSearchQuery) {
    searchResultsInfo = 'Still loading...';
  } else if (error) {
    searchResultsInfo = 'Error while loading search results. Please reload the page and try again.';
  } else if (hasSearchQuery && !hasFoundDestinations) {
    searchResultsInfo = 'Nothing found. Search for country or city name.';
  }
  // const focusWithinClassNames = open ? [] : [];

  return (
    <div className={styles.container}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={cn(formItemWithIcon, styles.popoverTrigger)}>
          {InputIcon}
          <Input
            placeholder="Where Do You Want To Go?"
            aria-label="Where Do You Want To Go?"
            role="searchbox"
            className={cn(styles.searchInput)}
            onChange={handleInputChange}
            onKeyDown={handleKeyDownOnFakeInput}
          />
        </PopoverTrigger>
        <PopoverContent
          // margin-top -3px to align edge of the popover under the INPUT (normally it has a bit of offset)
          className={styles.popoverContent}
          align="start"
          onCloseAutoFocus={onCloseAutoFocus}
          avoidCollisions={false}
        >
          <LocationsList
            className={styles.myLocationsList}
            dataItems={foundDestinations}
            emptySearchResMsg={searchResultsInfo}
            onLocationSelect={(d) => onDestinationSelected(d)}
          >
            <div className={cn(formItemWithIcon)}>
              {InputIcon}
              <Input
                placeholder="Where Do You Want To Go?"
                aria-label="Where Do You Want To Go?"
                role="searchbox"
                className={cn(styles.searchInput)}
                onChange={handleInputChange}
              />
            </div>
          </LocationsList>
        </PopoverContent>
      </Popover>
    </div>
  );
};
