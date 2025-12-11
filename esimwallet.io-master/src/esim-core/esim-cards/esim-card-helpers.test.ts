import { describe, expect, test } from 'vitest';

import { EsimCardDto } from '@/payload/app-types';

import { addEsimCardHistoryItem, EsimCardHistoryItem } from './esim-card-helpers';

describe('esim-card-helpers:', function () {
  test('addEsimCardHistoryItem', () => {
    const esimHistory: EsimCardDto['esimHistory'] = [
      {
        happenedAt: '2024-08-23T09:45',
        iccid: '1234',
        supplierOrderId: 'Order-X',
        installationStatus: 'new',
        installedAt: null,
      },
    ];

    // Case: same, but with `installedAt` as undefined (so slightly different ;-)
    const { installedAt, ...newEntrySame } = esimHistory[0];
    expect(addEsimCardHistoryItem(esimHistory, newEntrySame as EsimCardHistoryItem)).toBe(
      esimHistory,
    );

    // Case: new entry, different
    const newEntryDifferent = { ...newEntrySame, iccid: '567890' } as EsimCardHistoryItem;
    expect(addEsimCardHistoryItem(esimHistory, newEntryDifferent)).not.toBe(esimHistory);
    expect(addEsimCardHistoryItem(esimHistory, newEntryDifferent)).toEqual([
      newEntryDifferent,
      ...esimHistory,
    ]);

    // Case: no history before
    expect(addEsimCardHistoryItem([], newEntryDifferent)).toEqual([newEntryDifferent]);
  });
});
