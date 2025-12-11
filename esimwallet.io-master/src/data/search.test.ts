import { describe, expect, test } from 'vitest';

import { Destination } from '@/data/destination';
import { productStats } from '@/data/location-product-stats';
import { searchDestinations } from '@/data/search';

describe('Search', () => {
  describe('searchDestinations', () => {
    const destinations: Destination[] = [
      {
        id: 'JP',
        slug: 'for-japan',
        region: { id: 'asia', name: 'Asia', slug: 'asia', productStats },
        name: 'Japan',
        keywords: 'Tokyo',
        productStats,
      },
      {
        id: 'IT',
        name: 'Italy',
        region: { id: 'europe', name: 'Europe', slug: 'europe', productStats },
        keywords: 'Roma',
        slug: 'for-italy',
        productStats,
      },
      {
        id: 'PL',
        slug: 'for-poland',
        region: { id: 'europe', name: 'Europe', slug: 'europe', productStats },
        name: 'Poland',
        keywords: 'Warsaw',
        productStats,
      },
      {
        id: 'RO',
        slug: 'for-romania',
        region: { id: 'europe', name: 'Europe', slug: 'europe', productStats },
        name: 'Romania',
        keywords: 'Bucuresti',
        productStats,
      },
    ];

    test('should not return results: for gibberish/unknown search query', () => {
      const query = 'Abracadabra';
      const res = searchDestinations(destinations, query);
      expect(res.length).toBe(0);
    });

    test('should not return results: for empty query', () => {
      const query = '';
      const res = searchDestinations(destinations, query);
      expect(res.length).toBe(0);
    });

    test('should search by country name', () => {
      const query = 'Pol';
      const res = searchDestinations(destinations, query);
      expect(res.length).toBe(1);
      expect(res[0].name).toEqual('Poland');
    });

    test('should search by country ID', () => {
      const query = 'Pl';
      const res = searchDestinations(destinations, query);
      expect(res.length).toBe(1);
      expect(res[0].name).toEqual('Poland');
    });

    test('should search by country name and then by city name', () => {
      const query = 'Rom';
      const res = searchDestinations(destinations, query);
      expect(res.length).toBe(2);
      expect(res[0].name).toEqual('Romania');
      expect(res[1].name).toEqual('Italy');
    });

    test('should search by city name', () => {
      const query = 'Warsaw';
      const res = searchDestinations(destinations, query);
      expect(res.length).toBe(1);
      expect(res[0].name).toEqual('Poland');
    });
  });
});
