import { beforeEach, describe, expect, test } from 'vitest';
import nock from 'nock';

import { EsimProviderDto } from '@/payload/app-types';
import { EsimProvidersCollectionId } from '@/payload/collections';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { mockImageData } from '../../../../tests/mocks';
import { MmProvider } from '../mm-products.types';
import {
  mockMmProduct_3HK_VoiceAndDataText,
  mockMmProduct_3HK_VoiceOnlyTopUp,
  mockMmProduct_Dtac,
  mockMmProduct_Facil_VoiceAndData,
  mockMmProduct_Viettel_eSIM,
} from '../mocks/mm-products.mock';
import { mockMmProviders } from '../mocks/mm-providers.mock';
import { collectProviders, importMobiMatterProviders, mmMakeProvider } from './import-providers';

describe('import-mobimatter/import-providers', function () {
  const mockMmProducts: MmProvider[] = [
    mockMmProduct_3HK_VoiceAndDataText,
    mockMmProduct_3HK_VoiceOnlyTopUp,
    mockMmProduct_Dtac,
    mockMmProduct_Facil_VoiceAndData,
    mockMmProduct_Viettel_eSIM,
  ];

  describe('importMobiMatterProviders()', () => {
    // Mock requests to provider images
    // For one of them respond with error - to make sure we catch it
    nock(/mobimatter/)
      .persist()
      .get(/viettel/)
      .replyWithError({ code: 'AWFUL_ERROR' })
      .get(/.+?/)
      .reply(200, mockImageData, { 'content-type': 'image/png' });

    beforeEach(async () => {
      const payload = await appGetPayloadStandalone();
      await payload.delete({ collection: EsimProvidersCollectionId, where: {} });
    });

    test('should import providers into CMS', async () => {
      const importRes = await importMobiMatterProviders(mockMmProducts);
      expect(importRes.length).toBeGreaterThan(3);

      const hasSkippedProviders = importRes.filter((p) => !p);
      expect(hasSkippedProviders.length).toBe(0);
    });

    test('should import provider logos', async () => {
      const importRes = await importMobiMatterProviders(mockMmProducts);
      const dtac = importRes.find((p) => p && p.id === 'dtac') as EsimProviderDto;
      expect(dtac).toBeDefined();
      expect(dtac.url).contain('/esim-providers/file/dtac.jpeg');
      expect(dtac.mimeType).toBe('image/jpeg');
      expect(dtac.width).toBeDefined();
      expect(dtac.height).toBeDefined();
    });

    test('should not import faulty logos', async () => {
      const importRes = await importMobiMatterProviders(mockMmProducts);
      // Req to Viettel logo is mocked up to return an error, so it won't be imported,
      // but it shouldn't break the script, the error should be caught.
      const viettel = importRes.find((p) => p && p.id === 'viettel') as EsimProviderDto;
      expect(viettel).toBeDefined();
      expect(viettel.filesize).toBeFalsy();
      expect(viettel.url).toBeFalsy();
    });

    test('should skip providers already in database', async () => {
      const payload = await appGetPayloadStandalone();
      await payload.create({
        collection: EsimProvidersCollectionId,
        data: { id: 'facil', name: 'facil provider' },
      });
      const importRes = await importMobiMatterProviders(mockMmProducts);
      const hasSkippedProviders = importRes.filter((p) => !p);
      expect(hasSkippedProviders.length).toBe(1);
    });
  });

  describe('mmMakeProvider()', () => {
    test('should make provider', () => {
      const provider = mmMakeProvider(mockMmProviders[0]); // Viettel
      expect(provider).toEqual({
        id: 'viettel',
        name: 'Viettel',
        thumbnailURL: expect.stringContaining('viettel.png'),
        websiteUrl: undefined,
      } as EsimProviderDto);
    });

    test('should map provider names and slugs', () => {
      const threeHkProvider = mmMakeProvider(mockMmProviders[2]); // 3 HK
      expect(threeHkProvider.id).toEqual('three-hk');
      expect(threeHkProvider.name).toEqual('3 HK');
      expect(threeHkProvider.websiteUrl).toContain('three.com.hk');
    });
  });

  describe('collectProviders()', () => {
    test('should extract (unique) providers', () => {
      expect(mockMmProviders.length).toBe(4);
      expect(collectProviders(mockMmProviders).length).toBe(3);
    });

    test('should map provider names and slugs', () => {
      const providers = collectProviders(mockMmProviders);

      const threeHkProvider = providers.find((p) => p.name?.includes('HK'));
      expect(threeHkProvider?.id).toEqual('three-hk');
      expect(threeHkProvider?.name).toEqual('3 HK');

      const provider2 = providers.find((p) => p.name?.includes('Viettel'));
      expect(provider2?.id).toEqual('viettel');
      expect(provider2?.name).toEqual('Viettel');
    });

    test('should get logo URL to import', () => {
      const providers = collectProviders(mockMmProviders);
      const provider = providers.find((p) => p.name?.includes('Viettel'));
      expect(provider?.thumbnailURL).toContain('assets/viettel.png');
    });

    test('should get website url', () => {
      const providers = collectProviders(mockMmProviders);
      const provider = providers.find((p) => p.name?.includes('dtac'));
      expect(provider?.websiteUrl).toContain('dtac.co.th');
    });
  });
});
