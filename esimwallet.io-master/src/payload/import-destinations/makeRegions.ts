import database from 'country-json/src/country-by-region-in-world.json';

import type { RegionId } from '@/data/region';
import { slug } from '@/lib/utils';
import type { RegionDto } from '@/payload/app-types';
import {
  extraCountriesByRegion,
  jsonDbGetNormalisedCountryName,
} from '@/payload/import-destinations/enrichments';

/**
 * Prepare Regions database, ready to import into CMS
 */
export function makeRegions(): RegionDto[] {
  const regions: RegionDto[] = [];

  database.forEach((dbItem) => {
    const region = getNormalisedRegion(dbItem.country, dbItem.location);
    if (!region) {
      // console.log('Regions: skipping for ' + dbItem.location + ' / ' + dbItem.country);
      return; // some regions might be excluded
    }

    const regionAlreadyPresent = regions.find((item) => item.id === region.id);
    if (regionAlreadyPresent) {
      return;
    }

    const newRegion: Partial<RegionDto> = { ...region, slug: region.id, published: true };
    regions.push(newRegion as RegionDto);
  });

  return regions;
}

function makeCountriesByRegion(): Record<string, RegionId> {
  return database.reduce((list: Record<string, RegionId>, dbItem) => {
    const countryName = jsonDbGetNormalisedCountryName(dbItem.country);
    const region = getNormalisedRegion(countryName, dbItem.location);
    if (region) {
      list[countryName] = region.id;
    } else {
      // console.warn('Could not determine region for ' + dbItem.country);
    }
    return list;
  }, extraCountriesByRegion);
}

export function getRegionForCountry(countryName: string): RegionId | undefined {
  if (!_countriesByRegion) {
    _countriesByRegion = makeCountriesByRegion();
  }
  return _countriesByRegion[jsonDbGetNormalisedCountryName(countryName)];
}
let _countriesByRegion: Record<string, RegionId>;

function getNormalisedRegion(
  countryName?: string | null,
  regionName?: string | null,
): { id: RegionId; name: string } | undefined {
  const regionSlug = slug(regionName);
  if (
    regionSlug.match(/europe|baltic|british-isles|nordic/) ||
    countryName?.match(/England|Ireland|Scotland|Wales/)
  ) {
    return { id: 'europe', name: 'Europe' };
  }
  if (regionSlug.match(/africa/) || countryName?.match(/Congo/)) {
    return { id: 'africa', name: 'Africa' };
  }
  if (regionSlug.match(/asia/)) {
    return { id: 'asia', name: 'Asia' };
  }
  if (regionSlug.match(/north-america/)) {
    return { id: 'america', name: 'America' };
  }
  if (
    regionSlug.match(/caribbean|central-america|south-america/) ||
    countryName?.match(/Virgin Islands/)
  ) {
    return { id: 'latin-america', name: 'Latin America' };
  }
  if (regionSlug.match(/australia|melanesia|micronesia|polynesia/)) {
    return { id: 'australia-oceania', name: 'Australia and Oceania' };
  }
  if (regionSlug.match(/australia|melanesia|micronesia|polynesia/)) {
    return { id: 'australia-oceania', name: 'Australia and Oceania' };
  }
  if (regionSlug.match(/middle-east/)) {
    return { id: 'middle-east', name: 'Middle East' };
  }

  return;
}
