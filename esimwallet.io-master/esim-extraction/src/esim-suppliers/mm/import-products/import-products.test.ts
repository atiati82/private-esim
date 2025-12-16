import { afterEach, beforeEach, describe, expect, MockInstance, test, vi } from 'vitest';
import type { Payload } from 'payload';

import { EsimProductDto } from '@/payload/app-types';
import { EsimProductsCollectionId, EsimProvidersCollectionId } from '@/payload/collections';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { MmProduct, MmProductCategory } from '../mm-products.types';
import { mockMmProduct_Dtac, mockMmProduct_Viettel_eSIM } from '../mocks/mm-products.mock';
import { getProductsToProcess, importMobiMatterProducts } from './import-products';
import { mmMakeProduct } from './make-product';

describe('MM: import products', function () {
  const mmProductsToIds = (product: MmProduct): string => product.productId;

  describe('cleanImport', () => {
    let payload: Payload;
    let deleteSpy: MockInstance;
    beforeEach(async () => {
      payload = await appGetPayloadStandalone();
      deleteSpy = vi.spyOn(payload, 'delete');
    });
    afterEach(() => deleteSpy.mockRestore());

    test('perform database clean if cleanImport requested', async () => {
      await importMobiMatterProducts([], true);
      expect(deleteSpy).toHaveBeenCalledOnce();
    });
    test('do not clear database if cleanImport was not requested', async () => {
      await importMobiMatterProducts([]);
      expect(deleteSpy).not.toHaveBeenCalled();
    });
  });

  describe('import products', () => {
    let payload: Payload;
    beforeEach(async () => {
      payload = await appGetPayloadStandalone();
      await payload.delete({ collection: EsimProvidersCollectionId, where: {} });
    });

    test('should import new products', async () => {
      const productsToImport: MmProduct[] = [
        { ...mockMmProduct_Dtac, productId: 'AB' },
        { ...mockMmProduct_Viettel_eSIM, productId: 'CD' },
      ];
      const dbCreateSpy = vi.spyOn(payload, 'create');
      const dbUpdateSpy = vi.spyOn(payload, 'update');
      const [importedOrSyncedProducts, totalProductsToImportOrSync] =
        await importMobiMatterProducts(productsToImport);

      expect(dbCreateSpy).toHaveBeenCalledTimes(2);
      expect(dbUpdateSpy).toHaveBeenCalledTimes(0);
      expect(importedOrSyncedProducts).toBe(2);
      expect(totalProductsToImportOrSync).toBe(2);

      const dbProducts = await payload.find({ collection: EsimProductsCollectionId });
      const dbProductIds = dbProducts.docs.map((p) => p.supplierProductId);
      expect(dbProductIds).toContainEqual('AB');
      expect(dbProductIds).toContainEqual('CD');

      dbCreateSpy.mockRestore();
      dbUpdateSpy.mockRestore();
    });

    test('should sync existing and insert new products', async () => {
      // Initial product, to be updated/synced later
      const initProduct: MmProduct = { ...mockMmProduct_Dtac, productId: 'Existing' };
      const initProduct2: MmProduct = {
        ...mockMmProduct_Viettel_eSIM,
        productId: 'AnotherExisting',
      };

      await importMobiMatterProducts([initProduct, initProduct2], true);
      const existingProducts = await payload.find({ collection: EsimProductsCollectionId });
      expect(existingProducts.totalDocs).toBe(2);

      // MmProducts to import/sync
      // 1. Updated/changed product, should be updated
      // 2. Same product, should be ignored
      // 3. New product, should be created
      const productsToImportOrSync: MmProduct[] = [
        { ...initProduct, updated: '2030-01-01' }, // this product should be in the db, use future date to mark it for update
        { ...initProduct2 }, // same, should not need update/sync
        { ...mockMmProduct_Viettel_eSIM, productId: 'NewProduct' },
      ];

      const dbCreateSpy = vi.spyOn(payload, 'create');
      const dbUpdateSpy = vi.spyOn(payload, 'update');
      const [importedOrSyncedProducts, totalProductsToImportOrSync] =
        await importMobiMatterProducts(productsToImportOrSync);

      expect(importedOrSyncedProducts).toBe(2);
      expect(totalProductsToImportOrSync).toBe(2);

      expect(dbCreateSpy).toHaveBeenCalledTimes(1);
      expect(dbUpdateSpy).toHaveBeenCalledTimes(1);

      const dbProducts = await payload.find({ collection: EsimProductsCollectionId });
      const dbProductIds = dbProducts.docs.map((p) => p.supplierProductId);
      expect(dbProductIds).toContainEqual('Existing');
      expect(dbProductIds).toContainEqual('AnotherExisting');
      expect(dbProductIds).toContainEqual('NewProduct');
    });
  });

  describe('getProductsToSync()', () => {
    test('should get new products to import (excl. unsupported)', () => {
      const mockMmProductsToSync: MmProduct[] = [
        { ...mockMmProduct_Viettel_eSIM, productId: 'A' },
        { ...mockMmProduct_Dtac, productId: 'B' },
        { ...mockMmProduct_Dtac, productId: 'C', productCategory: MmProductCategory.Replacement },
      ];
      const [productsToSync, productsToImport] = getProductsToProcess(mockMmProductsToSync, []);
      expect(productsToSync.map(mmProductsToIds)).toEqual([]);
      expect(productsToImport.map(mmProductsToIds)).toEqual(['A', 'B']);
    });
    test('should ignore already existing, unchanged products', () => {
      const products: MmProduct[] = [
        { ...mockMmProduct_Dtac, productId: 'A' },
        { ...mockMmProduct_Viettel_eSIM, productId: 'B' },
      ];
      const existingProducts: EsimProductDto[] = products.map(
        (p) => mmMakeProduct(p) as EsimProductDto,
      );

      // same update dates - no need to sync
      const [productsToSync, productsToImport] = getProductsToProcess(products, existingProducts);
      expect(productsToSync.map(mmProductsToIds)).toEqual([]);
      expect(productsToImport.map(mmProductsToIds)).toEqual([]);
    });
    test('should only get changed/updated products', () => {
      const products: MmProduct[] = [
        { ...mockMmProduct_Dtac, productId: 'A' },
        { ...mockMmProduct_Viettel_eSIM, productId: 'B' },
      ];
      const existingProducts: EsimProductDto[] = products.map(
        (p) => mmMakeProduct(p) as EsimProductDto,
      );

      // mock newer date - should get that product for syncing
      products[0] = { ...products[0], updated: '2030-01-01' };
      const [productsToSync, productsToImport] = getProductsToProcess(products, existingProducts);
      expect(productsToSync.map(mmProductsToIds)).toEqual(['A']);
      expect(productsToImport.map(mmProductsToIds)).toEqual([]);

      products[1] = { ...products[1], updated: '2040-01-01' };
      const [productsToSync2, productsToImport2] = getProductsToProcess(products, existingProducts);
      expect(productsToSync2.map(mmProductsToIds)).toEqual(['A', 'B']);
      expect(productsToImport2.map(mmProductsToIds)).toEqual([]);
    });
  });
});
