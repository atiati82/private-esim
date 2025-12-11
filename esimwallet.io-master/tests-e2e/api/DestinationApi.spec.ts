import { expect, test } from '@playwright/test';

import { Destination } from '@/data/destination';

import * as config from '../e2e-config';

test.describe(config.DestinationsApiUrl, () => {
  test('should return list of destinations', async ({ request }) => {
    const res = await request.get(config.DestinationsApiUrl);
    expect(res).toBeOK();

    const destinations = (await res.json()) as Destination[];
    expect(destinations.length).toBeGreaterThan(200);

    const pl = destinations.find((d) => d.id === 'pl');
    expect(pl).toEqual({
      id: 'pl',
      slug: 'poland',
      name: 'Poland',
      region: { id: 'europe', slug: 'europe', name: 'Europe', productStats: expect.any(Object) },
      keywords: 'Warszawa, Warsaw, Krakow, Crakov, Gdansk, Gdynia, Sopot, Zakopane',
      productStats: expect.any(Object),
    });
  });

  test('should serve cached content', async ({ request }) => {
    const res = await request.get(config.DestinationsApiUrl);
    expect(res).toBeOK();

    expect(res.headers()).toHaveProperty('cache-control', 'public, max-age=259200, immutable');
  });
});
