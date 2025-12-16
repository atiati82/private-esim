import { describe, expect, test } from 'vitest';

import { EsimProduct } from '@/data/esim-product';

import { sortProducts } from '@/feat-products-listing/product-list-helpers';
import { mockProduct } from '@/testing/products.mock';

describe('Products Listing: helpers', function () {
  describe('sortProducts()', () => {
    test('should sort increasingly by plan days, then data allowance', () => {
      const p1 = mockProduct({ id: '1', planValidity: 1, planDataAllowance: 10 });
      const p2 = mockProduct({ id: '2', planValidity: 1, planDataAllowance: 30 });
      const p3 = mockProduct({ id: '3', planValidity: 3, planDataAllowance: 20 });
      const p4 = mockProduct({ id: '4', planValidity: 7, planDataAllowance: 15 });
      const p5 = mockProduct({ id: '5', planValidity: 7, planDataAllowance: 25 });
      const p6 = mockProduct({ id: '6', planValidity: 7, planDataAllowance: 25 });

      const arr: EsimProduct[] = [p2, p1, p5, p4, p6, p3];
      const arrSorted: EsimProduct[] = [p1, p2, p3, p4, p5, p6];
      sortProducts(arr);

      expect(arr).toStrictEqual(arrSorted);
    });
    test('should sort increasingly by price', () => {
      const p1 = mockProduct({ id: '1', planValidity: 1 }, { listPrice: 1 });
      const p2 = mockProduct({ id: '2', planValidity: 1 }, { listPrice: 2 });
      const p3 = mockProduct({ id: '3', planValidity: 7 }, { listPrice: 3 });
      const p4 = mockProduct({ id: '4', planValidity: 7 }, { listPrice: 4 });

      const arr: EsimProduct[] = [p2, p1, p4, p3];
      const arrSorted: EsimProduct[] = [p1, p2, p3, p4];
      sortProducts(arr);

      expect(arr).toStrictEqual(arrSorted);
    });
  });
});
