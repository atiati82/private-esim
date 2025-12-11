import { describe, expect, test } from 'vitest';

import { Destination } from '@/data/destination';
import { EsimPlanKyC, EsimProductAttributeItem } from '@/data/esim-product';
import { EsimProductsContent } from '@/payload/app-types';
import { esimProductsSeedContent } from '@/payload/collections/esim-products/esim-products-content.seed';

import { compileProductFeatures, ProductFeature } from '@/feat-product/compile-product-features';
import {
  mockDestinationHk,
  mockDestinationTw,
  mockDestinationUK,
} from '@/testing/destinations.mock';
import { mockProduct } from '@/testing/products.mock';

describe('compile-product-features', () => {
  const destinations: Destination[] = [mockDestinationUK, mockDestinationHk, mockDestinationTw];
  const productsContent: EsimProductsContent = esimProductsSeedContent;

  describe('KYC info', () => {
    const kycAttributes: EsimProductAttributeItem[] = [
      { name: 'kyc', value: 'Lorem ipsum dolor sit amet. KYC extra info.' },
      { name: 'kyc:hk', value: '' },
      { name: 'kyc:tw', value: '' },
    ];

    test('kyc overview: when KYC required', () => {
      const pf = compileProductFeatures(
        mockProduct({ planKycPolicy: EsimPlanKyC.Required, productAttributes: [] }),
        { productsContent, destinations },
      );
      const kycOverview = pf.specsTab.kycOverview as ProductFeature;
      expect(kycOverview.name).toMatch(/KYC.+?Verification/i);
      expect(kycOverview.icon).toBeDefined();
      expect(kycOverview.descriptionHtml).toMatch(/KYC is required.+?See tab below/i);
    });
    test('kyc tab: when KYC required', () => {
      const pf = compileProductFeatures(
        mockProduct({ planKycPolicy: EsimPlanKyC.Required, productAttributes: kycAttributes }),
        { productsContent, destinations },
      );

      const kycTabContentCount = Object.values(pf.kycTab!).length;
      expect(kycTabContentCount, 'There should be 4 content items in the KYC tab').toBe(4);

      const kycExplanation = pf.kycTab?.kycExplanation as ProductFeature;
      expect(kycExplanation.name).toBe('KYC (ID Verification)');
      expect(kycExplanation.descriptionHtml).toMatch(/KYC might be required in some cases/i);

      const kycContent = pf.kycTab?.kycContent as ProductFeature;
      expect(kycContent.name).toBe('KYC Extra Information');
      expect(kycContent.description?.[0]).toBe(kycAttributes[0].value);

      const kycHk = pf.kycTab?.['kyc:hk'] as ProductFeature;
      expect(kycHk.name).toBe('KYC for Hong Kong');
      expect(kycHk.descriptionHtml).toMatch(/KYC is required for Hong-Kong./i);
      const kycTw = pf.kycTab?.['kyc:tw'] as ProductFeature;
      expect(kycTw.name).toBe('KYC for Taiwan');
      expect(kycTw.descriptionHtml).toMatch(/KYC is required for Taiwan./i);
    });
    test('kyc tab: when KYC required (when destination is missing in destinations db)', () => {
      const pf = compileProductFeatures(
        mockProduct({ planKycPolicy: EsimPlanKyC.Required, productAttributes: kycAttributes }),
        { productsContent, destinations: [] },
      );
      expect(pf.kycTab?.['kyc:hk'].name).toBe('KYC for HK');
      expect(pf.kycTab?.['kyc:tw'].name).toBe('KYC for TW');
    });

    test('kyc overview: when KYC NOT required', () => {
      const pf = compileProductFeatures(mockProduct({}), {
        productsContent,
        destinations,
      });
      const kycOverview = pf.specsTab.kycOverview as ProductFeature;
      expect(kycOverview.name).toMatch(/KYC.+?Verification/i);
      expect(kycOverview.icon).toBeDefined();
      expect(kycOverview.descriptionHtml).toMatch(/KYC not required. Enjoy anonymous internet/i);
    });
    test('kyc tab: when KYC NOT required', () => {
      const pf = compileProductFeatures(mockProduct({}), {
        productsContent,
        destinations,
      });
      expect(pf.kycTab).toBe(undefined);
    });

    test('kyc overview: when KYC NOT required, with some exceptions', () => {
      const pf = compileProductFeatures(
        mockProduct({
          planKycPolicy: EsimPlanKyC.No,
          productAttributes: kycAttributes,
        }),
        {
          productsContent,
          destinations,
        },
      );
      const kycOverview = pf.specsTab.kycOverview as ProductFeature;
      expect(kycOverview.name).toMatch(/KYC.+?Verification/i);
      expect(kycOverview.icon).toBeDefined();
      expect(kycOverview.descriptionHtml).toMatch(/not required.+?there are some exemptions/i);
    });
    test('kyc tab: when KYC NOT required, with some exceptions', () => {
      const pf = compileProductFeatures(
        mockProduct({
          planKycPolicy: EsimPlanKyC.No,
          productAttributes: kycAttributes,
        }),
        {
          productsContent,
          destinations,
        },
      );
      const kycTabContentCount = Object.values(pf.kycTab ?? {}).length;
      expect(kycTabContentCount, 'There should be 4 content items in the KYC tab').toBe(4);
    });
  });
});
