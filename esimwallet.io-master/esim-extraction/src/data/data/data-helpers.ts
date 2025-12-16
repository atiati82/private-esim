import { Destination } from '@/data/destination';
import { Region } from '@/data/region';

export function isDestinationLocation(
  item: Destination | Region | undefined | null,
): item is Destination {
  return !!item && 'region' in item;
}
export function isRegionLocation(item: Destination | Region | undefined | null): item is Region {
  return !!item && !isDestinationLocation(item);
}
