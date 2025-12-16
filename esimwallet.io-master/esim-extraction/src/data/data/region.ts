import { LocationProductStats, makeLocationProductStats } from '@/data/location-product-stats';
import { RegionDto } from '@/payload/app-types';
import { isObject, makeMinimalRelationObj } from '@/payload/utils/data-utils';

/**
 * Region obj used in the app
 * @see RegionDto
 */
export interface Region {
  id: RegionId;
  name: string;
  slug: string;
  productStats: LocationProductStats;
}

export type RegionId =
  | 'europe'
  | 'asia'
  | 'africa'
  | 'america'
  | 'latin-america'
  | 'middle-east'
  | 'australia-oceania';

/**
 * Region id / slugs (consistent with list from CMS)
 */
const regionIds: RegionId[] = [
  'europe',
  'asia',
  'africa',
  'america',
  'latin-america',
  'middle-east',
  'australia-oceania',
];
export function isRegionId(
  regionSlug: RegionId | string | undefined | null,
): regionSlug is RegionId {
  return !!regionSlug && regionIds.includes(regionSlug as RegionId);
}

export function makeRegionObj(dto: RegionDto): Region {
  if (!isObject(dto)) {
    return makeMinimalRelationObj(dto);
  }
  return {
    id: dto.id as RegionId,
    name: dto.name,
    slug: dto.slug,
    productStats: makeLocationProductStats(dto.productStats),
  };
}
