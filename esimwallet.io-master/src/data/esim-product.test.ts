import { describe, expect, test } from 'vitest';

import { makeProductId } from '@/data/esim-product';

import {
  mockProductDefaultEsimVoiceKyc,
  mockProductEsimUk,
  mockProductEsimUk2,
  mockProductTopUp,
} from '@/testing/products.mock';

describe('EsimProduct', () => {
  describe('makeProductId()', () => {
    test('make id', () => {
      expect(makeProductId(mockProductEsimUk)).toEqual('uk-premium-30d50gb-ubigi-mm16da1f.esim');
      expect(makeProductId(mockProductEsimUk2)).toEqual(
        'us-ca-uk-au-nz-30d100gb-3hk-l9-mm5e2c54.esim',
      );
      expect(makeProductId(mockProductDefaultEsimVoiceKyc)).toEqual(
        'hk-tw-us-uk-30d100gb100min-3hk-l4-mm5e2c54.esim',
      );
      expect(makeProductId(mockProductTopUp)).toEqual('hk-tw-us-uk-30d100gb-3hk-l4-mm5e2c54.topup');
    });
  });
});
