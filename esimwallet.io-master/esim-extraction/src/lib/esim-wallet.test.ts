import { describe, expect, test } from 'vitest';

import { EsimProduct } from '@/data/esim-product';
import {
  amountToCents,
  formatCurrencyVal,
  getFamilyNameFromProduct,
  getPlanExpiryDate,
} from '@/lib/esim-wallet';

describe('esim-wallet lib', () => {
  describe('formatCurrencyVal()', () => {
    test('should format currency val', () => {
      expect(formatCurrencyVal(1)).toBe('1.00');
      expect(formatCurrencyVal(1.2)).toBe('1.20');
      expect(formatCurrencyVal(1.25)).toBe('1.25');
      expect(formatCurrencyVal(1.259)).toBe('1.26');
    });
    test('should format currency val from cents', () => {
      expect(formatCurrencyVal(1, true)).toBe('0.01');
      expect(formatCurrencyVal(1.2, true)).toBe('0.01');
      expect(formatCurrencyVal(1.9, true)).toBe('0.01');
      expect(formatCurrencyVal(125, true)).toBe('1.25');
      expect(formatCurrencyVal(1299, true)).toBe('12.99');
    });
  });

  describe('amountToCents()', () => {
    test('should convert amount to currency cents', () => {
      expect(amountToCents(1)).toBe(100);
      expect(amountToCents(100)).toBe(10000);
      expect(amountToCents(100.569)).toBe(10057);
    });
  });

  describe('getFamilyNameFromProducts()', () => {
    test('should get name - without data segments', () => {
      const res = getFamilyNameFromProduct({ name: 'Europe and USA 1 GB' } as EsimProduct);
      expect(res).toBe('Europe and USA');
    });
    test('should get name - without double data segments', () => {
      const res = getFamilyNameFromProduct({ name: 'Europe and USA 50 GB 60 Days' } as EsimProduct);
      expect(res).toBe('Europe and USA');
    });
    test('should get name - when data segments inside', () => {
      const res = getFamilyNameFromProduct({ name: 'Global 5 GB NonStop' } as EsimProduct);
      expect(res).toBe('Global NonStop');
    });

    test('should leave title unchanged, when no data segments', () => {
      const res = getFamilyNameFromProduct({ name: 'Happy Tourist' } as EsimProduct);
      expect(res).toBe('Happy Tourist');
    });
    test('should remove set of words, like FREE', () => {
      const res = getFamilyNameFromProduct({ name: 'Europe USA 20+5 GB FREE' } as EsimProduct);
      expect(res).toBe('Europe USA');
    });
  });

  test(`getPlanExpiryDate()`, () => {
    expect(getPlanExpiryDate(null, 30)).toBe(undefined);
    expect(getPlanExpiryDate('', 30)).toBe(undefined);
    expect(getPlanExpiryDate('2024-10-10T01:00:00.000Z', 3)).toMatch(/^2024-10-13T/);
    expect(getPlanExpiryDate('2024-12-10T01:00:00.000Z', 30)).toMatch(/^2025-01-09T/);
  });
});
