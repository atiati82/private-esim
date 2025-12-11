import uniqBy from 'lodash/uniqBy';

import { Destination } from '@/data/destination';

export function searchDestinations(destinations: Destination[], query: string): Destination[] {
  if (!query.length) {
    return [];
  }

  const querySanitized = query.toLowerCase();

  const destinationsStartingWith = destinations.filter((destination): boolean => {
    return (
      destination.name.toLowerCase().startsWith(querySanitized) ||
      destination.id.toLowerCase().startsWith(querySanitized)
    );
  });
  const remainingDestinations = destinations.filter((destination): boolean => {
    const searchIndex =
      `${destination.id} ${destination.name} ${destination.keywords} ${destination.region}`.toLowerCase();
    return searchIndex.includes(querySanitized);
  });

  return uniqBy([...destinationsStartingWith, ...remainingDestinations], 'id');
}
