import { LocationProductStats, makeLocationProductStats } from '@/data/location-product-stats';
import { makeRegionObj, Region } from '@/data/region';
import { DestinationDto, RegionDto } from '@/payload/app-types';
import { isObject, makeMinimalRelationObj } from '@/payload/utils/data-utils';

/**
 * Destination obj used on the client-side
 * @see DestinationDto
 */
export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: Region;
  keywords: string;
  isTopDestination?: boolean;
  productStats: LocationProductStats;
}

export function makeDestinationObj(data: DestinationDto): Destination {
  if (!isObject(data)) {
    return makeMinimalRelationObj(data);
  }

  const destination: Destination = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    region: makeRegionObj(data.region as RegionDto),
    keywords: data.keywords ?? '',
    productStats: makeLocationProductStats(data.productStats),
  };

  if (data.isTopDestination) {
    destination.isTopDestination = true;
  }

  return destination;
}
