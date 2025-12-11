import { describe, expect, test } from 'vitest';

import { getRegionForCountry, makeRegions } from '@/payload/import-destinations/makeRegions';

describe('Import: Make Regions', () => {
  test('should make list of regions', () => {
    const regions = makeRegions();
    expect(regions.length).toBe(7);
    expect(regions[0].id).toEqual('asia');
    expect(regions[0].name).toEqual('Asia');
    expect(regions[0].slug).toEqual('asia');
    expect(regions[4].id).toEqual('latin-america');
    expect(regions[4].name).toEqual('Latin America');
    expect(regions[4].slug).toEqual('latin-america');
    expect(regions[6].id).toEqual('america');
    expect(regions[6].name).toEqual('America');
    expect(regions[6].slug).toEqual('america');
  });

  test('should get region for country', () => {
    expect(getRegionForCountry('Poland')).toEqual('europe');
    expect(getRegionForCountry('United Kingdom')).toEqual('europe');
    expect(getRegionForCountry('Northern Ireland')).toEqual('europe');
    expect(getRegionForCountry('Yemen')).toEqual('middle-east');
    expect(getRegionForCountry('Vatican')).toEqual('europe');
    expect(getRegionForCountry('Jersey')).toEqual('europe');
    expect(getRegionForCountry('Timor-Leste')).toEqual('asia');
  });
});
