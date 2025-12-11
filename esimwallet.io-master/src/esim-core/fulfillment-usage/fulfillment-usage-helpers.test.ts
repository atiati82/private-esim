import { describe, expect, test } from 'vitest';

import { OrderFulfillment } from '@/payload/app-types';

import { mockEsimCardDto, mockEsimCardOrderedPackages } from '@/testing/esim-cards.mock';
import { mockOrderItemDto } from '@/testing/order-items.mock';
import { EsimCardSmDpStatus } from '../esim-cards/collection';
import { getInitialSupplierOrderId, shouldSyncEsimCard } from './fulfillment-usage-helpers';

describe('fulfillment-usage-helpers:', function () {
  test('shouldSyncEsimCard()', () => {
    const ephemeralEsimCard = mockEsimCardDto({ statusSmdp: EsimCardSmDpStatus.Ephemeral });
    expect.soft(shouldSyncEsimCard(ephemeralEsimCard)).toBe(false);
    const realEsimCard = mockEsimCardDto({ statusSmdp: EsimCardSmDpStatus.Created });
    expect.soft(shouldSyncEsimCard(realEsimCard)).toBe(true);
    const activatedEsimCard = mockEsimCardDto({ statusSmdp: EsimCardSmDpStatus.Activated });
    expect.soft(shouldSyncEsimCard(activatedEsimCard)).toBe(true);
  });

  describe('getInitialSupplierOrderId()', () => {
    test('when no ordered packages on eSIM', () => {
      const esimNoOrderedPackages = mockEsimCardDto({ orderedPackages: [] });
      expect.soft(getInitialSupplierOrderId(esimNoOrderedPackages)).toBe(undefined);
    });
    test('when no fulfillment data', () => {
      const packageX = mockOrderItemDto();
      const mockEsim = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages([packageX]),
      });
      expect.soft(getInitialSupplierOrderId(mockEsim)).toBe(undefined);
    });
    test('when fulfillment data present', () => {
      const supplierOrderId = 'RBL-XYZ-123';
      const packageX = mockOrderItemDto({ fulfillment: { supplierOrderId } as OrderFulfillment });
      const mockEsim = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages([packageX]),
      });
      expect.soft(getInitialSupplierOrderId(mockEsim)).toBe(supplierOrderId);
    });

    test('when fulfillment data present, but not in the last order', () => {
      const package0 = mockOrderItemDto();
      const package1 = mockOrderItemDto({
        fulfillment: { supplierOrderId: 'RBL-XYZ-1' } as OrderFulfillment,
      });
      const package2 = mockOrderItemDto({
        fulfillment: { supplierOrderId: 'RBL-XYZ-2' } as OrderFulfillment,
      });
      const mockEsim = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages([package2, package1, package0]),
      });
      expect.soft(getInitialSupplierOrderId(mockEsim)).toBe('RBL-XYZ-1');
    });
  });
});
