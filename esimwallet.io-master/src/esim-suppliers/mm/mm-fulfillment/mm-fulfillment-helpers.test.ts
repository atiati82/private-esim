import { describe, expect, test } from 'vitest';

import { EsimCardSmDpStatus } from '@/esim-core/esim-cards/collection';

import { ensureOrderId, getEsimSmdpStatus } from './mm-fulfillment-helpers';

describe('fulfillment-helpers:', function () {
  test('ensureOrderId', () => {
    expect(() => ensureOrderId(null)).toThrowError(/Fulfillment: missing order id/);
    expect(() => ensureOrderId('')).toThrowError(/Fulfillment: missing order id/);
    expect(ensureOrderId('SUPPLIER-ORDER-ID')).toEqual('SUPPLIER-ORDER-ID');
  });

  test('getEsimSmdpStatus should determine SM-DP+ status', () => {
    expect(getEsimSmdpStatus('activated')).toEqual(EsimCardSmDpStatus.Activated);
    expect(getEsimSmdpStatus('disabled')).toEqual(EsimCardSmDpStatus.Disabled);
    expect(getEsimSmdpStatus('xyz')).toEqual(EsimCardSmDpStatus.Unrecognized);
    // when 'disabled/suspended' flag provided, it takes priority
    expect(getEsimSmdpStatus('activated', true)).toEqual(EsimCardSmDpStatus.Disabled);
    expect(getEsimSmdpStatus('xyz', true)).toEqual(EsimCardSmDpStatus.Disabled);
  });
});
