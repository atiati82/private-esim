import { describe, expect, test } from 'vitest';

import { MmProduct, MmProductDetail, MmProductDetailsType } from '../mm-products.types';
import {
  mockMmProduct_3HK_VoiceAndDataText,
  mockMmProduct_additionalDetails_kycForHongKongAndTaiwan,
  mockMmProduct_Facil_VoiceAndData,
  mockMmProduct_restrictedSpeed,
} from '../mocks/mm-products.mock';
import {
  getCleanAdditionalProductDetail,
  getCleanProductDetail,
  getCleanProductDetailsEntries,
} from './get-clean-product-detail';

describe('import-mobimatter/import-products/get-clean-product-detail', function () {
  describe('getCleanProductDetailsEntries()', () => {
    test('get all product details', () => {
      const productDetails = getCleanProductDetailsEntries(mockMmProduct_3HK_VoiceAndDataText);
      expect(productDetails.length).toBeGreaterThanOrEqual(6);
      const someDetails = productDetails[0];
      expect(someDetails.name).toBeDefined();
      expect(someDetails.value).toBeDefined();
    });
  });

  describe('getCleanProductDetail()', () => {
    test(`parse ${MmProductDetailsType.PlanTitle}`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_3HK_VoiceAndDataText,
        MmProductDetailsType.PlanTitle,
      );
      expect(productDetail).toContain('Yearly Voice and Data');
    });

    test(`parse '${MmProductDetailsType.PlanDetails}'`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_Facil_VoiceAndData,
        MmProductDetailsType.PlanDetails,
      );
      expect(productDetail?.heading).toContain('BRAZIL');
      expect(productDetail?.description).toContain('PURCHASE');
      expect(productDetail?.items.length).toBeGreaterThan(1);
    });

    test(`parse '${MmProductDetailsType.PlanDetails2}' (2nd)`, () => {
      const rawProductDetails1 = mockMmProduct_3HK_VoiceAndDataText.productDetails.find(
        (p) => p.name === MmProductDetailsType.PlanDetails,
      );
      const rawProductDetails2 = mockMmProduct_3HK_VoiceAndDataText.productDetails.find(
        (p) => p.name === MmProductDetailsType.PlanDetails2,
      );
      expect(rawProductDetails1).not.toBeDefined();
      expect(rawProductDetails2).toBeDefined();

      const productDetail = getCleanProductDetail(
        mockMmProduct_3HK_VoiceAndDataText,
        MmProductDetailsType.PlanDetails2,
      );
      expect(productDetail?.heading).toContain('READY TO CONNECT');
      expect(productDetail?.description).toContain('eKYC is mandatory');
      expect(productDetail?.items.length).toBeGreaterThan(1);
    });

    test(`parse '${MmProductDetailsType.PlanDetails}' and handle invalid JSON`, () => {
      const mockProduct = {
        productId: '1',
        productDetails: [
          { name: MmProductDetailsType.PlanDetails, value: '{ Invalid JSON }' },
        ] as MmProductDetail[],
      } as MmProduct;
      const productDetail = getCleanProductDetail(mockProduct, MmProductDetailsType.PlanDetails);
      expect(productDetail).toBeUndefined();
    });

    test(`parse '${MmProductDetailsType.AdditionalDetails}'`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_3HK_VoiceAndDataText,
        MmProductDetailsType.AdditionalDetails,
      );
      // More detailed tests for this below for getCleanAdditionalProductDetail()
      expect(productDetail?.heading).toBeDefined();
      expect(productDetail?.items.length).toBeGreaterThan(6);
      expect(productDetail?.links?.length).toBeGreaterThanOrEqual(2);
    });

    test(`parse ${MmProductDetailsType.PlanDataLimit}`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_3HK_VoiceAndDataText,
        MmProductDetailsType.PlanDataLimit,
      );
      expect(productDetail).toBe(120);
    });

    test(`parse ${MmProductDetailsType.PlanVoiceLimit}`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_Facil_VoiceAndData,
        MmProductDetailsType.PlanVoiceLimit,
      );
      expect(productDetail).toBe(10000);
    });

    test(`parse ${MmProductDetailsType.PlanValidity}`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_Facil_VoiceAndData,
        MmProductDetailsType.PlanValidity,
      );
      expect(productDetail).toBe(30);
    });

    test(`parse ${MmProductDetailsType.FiveG}`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_Facil_VoiceAndData,
        MmProductDetailsType.FiveG,
      );
      expect(productDetail).toBe(true);
      const productDetail2 = getCleanProductDetail(
        mockMmProduct_3HK_VoiceAndDataText,
        MmProductDetailsType.FiveG,
      );
      expect(productDetail2).toBe(undefined);
    });

    test(`parse ${MmProductDetailsType.UsageTracking}`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_Facil_VoiceAndData,
        MmProductDetailsType.UsageTracking,
      );
      expect(productDetail).toBeFalsy();
      const productDetail2 = getCleanProductDetail(
        mockMmProduct_restrictedSpeed,
        MmProductDetailsType.UsageTracking,
      );
      expect(productDetail2).toBe(true);
    });

    test(`parse ${MmProductDetailsType.Tags}`, () => {
      const productDetail = getCleanProductDetail(
        mockMmProduct_3HK_VoiceAndDataText,
        MmProductDetailsType.Tags,
      );
      expect(productDetail.length).toBe(1);
      expect(productDetail).toEqual(['BEST QUALITY']);
    });
  });

  describe('getCleanAdditionalProductDetail()', () => {
    test('parse gibberish HTML content', () => {
      const res = getCleanAdditionalProductDetail(
        mockMmProduct_additionalDetails_kycForHongKongAndTaiwan.value as string,
      );
      expect(res?.heading).toContain('WILL NOT WORK');
      expect(res?.items.length).toBeGreaterThan(6);
      expect(res?.links?.length).toBe(2);
      expect(res?.links).toContainEqual('https://www.three.com.hk/prepaid/account/en/rnr-reg');
      expect(res?.links).toContainEqual('https://www.three.com.hk/prepaid/account/en/tw-rnr');
    });
    test('parse empty HTML content', () => {
      const res = getCleanAdditionalProductDetail('' as unknown as string);
      expect(res?.heading).toBeDefined();
      expect(res?.items).toBeDefined(); // empty list of texts
      expect(res?.links).toBeDefined(); // empty list of links
    });
    test('parse invalid HTML content', () => {
      const res = getCleanAdditionalProductDetail('<h1>some content </span' as unknown as string);
      expect(res?.heading).toBeDefined();
      expect(res?.heading).toContain('some content');
    });
  });
});
