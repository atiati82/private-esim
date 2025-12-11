import { describe, expect, test } from 'vitest';

import { EsimCardIdRegexp, makeEsimCardId } from './esim-card';

describe('eSIM Cards', function () {
  test('makeEsimCardId', () => {
    const id = makeEsimCardId('Provider-X', '898520310300874177');
    expect(id).toMatch(/369providerx\d{5}-874177/);
    expect(id).toMatch(EsimCardIdRegexp);
  });
});
