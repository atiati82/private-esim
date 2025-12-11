import { describe, expect, test } from 'vitest';

import { DestinationDto } from '@/payload/app-types';
import { findByCountryId, makeDestinations } from '@/payload/import-destinations/makeDestinations';

describe('Import: Make Destinations', () => {
  test('should make list of destinations', () => {
    const destinations = makeDestinations();
    const pl = destinations.find(findByCountryId('PL'));
    expect(pl).toEqual({
      id: 'pl',
      slug: 'poland',
      region: 'europe',
      name: 'Poland',
      published: true,
      isTopDestination: false,
      keywords: 'Warszawa, Warsaw, Krakow, Crakov, Gdansk, Gdynia, Sopot, Zakopane',
      currency: 'PLN',
    } as DestinationDto);
  });

  test('should make list of extra destinations', () => {
    const destinations = makeDestinations();
    const pl = destinations.find(findByCountryId('tw'));
    expect(pl).toEqual({
      id: 'tw',
      slug: 'taiwan',
      region: 'asia',
      name: 'Taiwan',
      published: true,
      isTopDestination: false,
      keywords: 'Taipei City',
      currency: 'TWD',
    } as DestinationDto);
  });

  test('should make list of destinations: Timor-Leste case', () => {
    const destinations = makeDestinations();
    const tl = destinations.find(findByCountryId('tl'));
    expect(tl).toEqual({
      id: 'tl',
      slug: 'timor-leste',
      region: 'asia',
      name: 'Timor-Leste',
      published: true,
      isTopDestination: false,
      keywords: expect.stringContaining('Dili'),
      currency: 'USD',
      altIsoCodes: ['tp'],
    } as DestinationDto);
  });

  test('should make list of destinations: Northern Ireland case', () => {
    const destinations = makeDestinations();
    const d = destinations.find(findByCountryId('gb-nir'));
    expect(d).toEqual({
      id: 'gb-nir',
      slug: 'northern-ireland',
      region: 'europe',
      name: 'Northern Ireland',
      published: true,
      isTopDestination: false,
      parentDestination: 'gb',
      keywords: expect.stringContaining('Belfast'),
      currency: 'GBP',
    } as DestinationDto);
  });

  test('should make list of TOP destinations', () => {
    const destinations = makeDestinations();
    const jp = destinations.find(findByCountryId('jp'));
    expect(jp).toEqual({
      id: 'jp',
      slug: 'japan',
      region: 'asia',
      name: 'Japan',
      published: true,
      isTopDestination: true,
      keywords: 'Tokyo',
      currency: 'JPY',
    } as DestinationDto);
  });

  test('should enrich keywords', () => {
    const destinations = makeDestinations();
    const id = destinations.find(findByCountryId('ID'));
    expect(id!.keywords).toContain('Bali');
    const gb = destinations.find(findByCountryId('gb'));
    expect(gb!.keywords).toContain('London');
  });

  test('should enrich altIsoCodes', () => {
    const destinations = makeDestinations();
    const id = destinations.find(findByCountryId('ht'));
    expect(id!.name).toContain('Haiti');
    expect(id!.altIsoCodes).toContain('us-hi');
  });

  test('should add capital city to the keywords', () => {
    const destinations = makeDestinations();
    const id = destinations.find(findByCountryId('ID'));
    expect(id!.keywords).toContain('Jakarta');
    const pl = destinations.find(findByCountryId('pl'));
    expect(pl!.keywords).toContain('Warszawa');
    const gb = destinations.find(findByCountryId('gb'));
    expect(gb!.keywords).toContain('London');
  });

  test('findByCountryId() should find by country code and/or alt iso code', () => {
    const destinations = makeDestinations();

    const res1 = destinations.find(findByCountryId('pl'));
    expect(res1?.name).toEqual('Poland');

    const res2 = destinations.find(findByCountryId('Tw'));
    expect(res2?.name).toEqual('Taiwan');

    const res3 = destinations.find(findByCountryId('US-HI'));
    expect(res3?.name).toEqual('Haiti');
  });
});
