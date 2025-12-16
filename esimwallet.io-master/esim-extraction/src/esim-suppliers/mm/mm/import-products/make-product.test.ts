import { describe, expect, test } from 'vitest';

import { EsimPlanType, EsimProductType } from '@/data/esim-product';
import { ProductSupplier } from '@/esim-core/suppliers';

import { mockDestinationsDto } from '@/testing/destinations.mock';
import { MmProduct, MmProductCategory, MmProductDetailsType } from '../mm-products.types';
import {
  mockMmProduct_3HK_TopUp_Kyc,
  mockMmProduct_3HK_VoiceAndDataText,
  mockMmProduct_3HK_VoiceOnlyTopUp,
  mockMmProduct_Dtac,
  mockMmProduct_Facil_VoiceAndData,
  mockMmProduct_restrictedSpeed,
  mockMmProduct_Viettel_eSIM,
} from '../mocks/mm-products.mock';
import { mmMakeProduct } from './make-product';

describe('MM: make product', function () {
  test('make product name', () => {
    const product = mmMakeProduct(mockMmProduct_Viettel_eSIM);
    expect(product.name).toEqual('Vietnam 75 GB');
  });

  test('make product id', () => {
    const product = mmMakeProduct(mockMmProduct_Viettel_eSIM);
    expect(product.id).toEqual('vietnam-15d75gb-viettel-mmc003a2.esim');
  });

  test('make product type', () => {
    const eSim = mmMakeProduct(mockMmProduct_Viettel_eSIM);
    expect(eSim.productType).toEqual(EsimProductType.eSIM);
    const topUp = mmMakeProduct(mockMmProduct_3HK_TopUp_Kyc);
    expect(topUp.productType).toEqual(EsimProductType.TopUp);
  });
  test('make product type: should throw error for unrecognized type', () => {
    const unsupportedMmProduct: MmProduct = {
      ...mockMmProduct_Viettel_eSIM,
      productCategory: 'unsupported' as MmProductCategory,
    };
    expect(() => mmMakeProduct(unsupportedMmProduct)).toThrowError(/Can't detect product type/);
  });

  test('make product provider', () => {
    const product = mmMakeProduct(mockMmProduct_3HK_VoiceAndDataText);
    expect(product.provider).toEqual('three-hk');
  });

  test('make product family', () => {
    const product = mmMakeProduct(mockMmProduct_3HK_VoiceAndDataText, {
      destinations: [],
      availableTopUps: 333,
    });
    expect(product.productFamily).toEqual('3HK');
    expect(product.productFamilyTopUpsCount).toEqual(333);
  });

  test('make destinations / regions', () => {
    const product = mmMakeProduct(mockMmProduct_Dtac, { destinations: mockDestinationsDto });
    expect(product.destinations).toEqual(['th', 'ph']);
    expect(product.regions).toEqual(['asia']);
  });

  describe('product pricing', () => {
    test('supplier price from wholesale price', () => {
      const product = mmMakeProduct({
        ...mockMmProduct_Viettel_eSIM,
        wholesalePrice: 567.89,
      });
      expect(product.productPricing.supplierPrice).toBe(567.89);
    });
    test('list price', () => {
      const product = mmMakeProduct({
        ...mockMmProduct_Viettel_eSIM,
        retailPrice: 500,
      });
      expect(product.productPricing.listPrice).toBe(500);
    });
  });

  describe('plan details', () => {
    test('make plan type: DataOnly', () => {
      const product = mmMakeProduct(mockMmProduct_Viettel_eSIM);
      expect(product.planType).toBe(EsimPlanType.DataOnly);
      expect(product.planDataAllowance).toBe(75);
      expect(product.planVoiceAllowance).toBe(0);
    });
    test('make plan type: VoiceAndData', () => {
      const product = mmMakeProduct(mockMmProduct_Facil_VoiceAndData);
      expect(product.planType).toBe(EsimPlanType.VoiceAndData);
      expect(product.planDataAllowance).toBe(42);
      expect(product.planVoiceAllowance).toBe(10000);
    });
    test('make plan type: VoiceAndData (voice info from text)', () => {
      const product = mmMakeProduct(mockMmProduct_3HK_VoiceAndDataText);
      expect(product.planType).toBe(EsimPlanType.VoiceAndData);
      expect(product.planDataAllowance).toBe(120);
      expect(product.planVoiceAllowance).toBe(10000);
    });
    test('make plan type: DataOnly', () => {
      const product = mmMakeProduct(mockMmProduct_3HK_VoiceOnlyTopUp);
      expect(product.planType).toBe(EsimPlanType.VoiceOnly);
      expect(product.planDataAllowance).toBe(0);
      expect(product.planVoiceAllowance).toBe(0); // pay-as-you-go
    });

    test('make plan validity period: should convert MM hours into days', () => {
      const product = mmMakeProduct(mockMmProduct_Viettel_eSIM);
      expect(product.planValidity).toBe(15);
    });

    test('make plan data allowance', () => {
      const product = mmMakeProduct(mockMmProduct_Viettel_eSIM);
      expect(product.planDataAllowance).toBe(75);
      expect(product.planVoiceAllowance).toBe(0);
    });

    test('make plan voice allowance', () => {
      const product = mmMakeProduct(mockMmProduct_Facil_VoiceAndData);
      expect(product.planDataAllowance).toBe(42);
      expect(product.planVoiceAllowance).toBe(10000);
    });
    test('make plan voice allowance: from text description', () => {
      const product = mmMakeProduct(mockMmProduct_3HK_VoiceAndDataText);
      expect(product.planDataAllowance).toBe(120);
      expect(product.planVoiceAllowance).toBe(10000);
    });
  });

  describe('supplier info', () => {
    test('set supplier name (MobiMatter)', () => {
      const product = mmMakeProduct(mockMmProduct_Viettel_eSIM);
      expect(product.supplier).toBe(ProductSupplier.MobiMatter);
    });

    test('set supplier product id', () => {
      const product = mmMakeProduct({
        ...mockMmProduct_Viettel_eSIM,
        productId: 'some-unique-product-id',
      });
      expect(product.supplierProductId).toBe('some-unique-product-id');
    });

    test('set supplier product creation/update date', () => {
      const product = mmMakeProduct(mockMmProduct_Viettel_eSIM);
      expect(product.supplierProductCreationDate).toContain('2024-03-29T');
      expect(product.supplierProductLastUpdate).toContain('2024-04-26T');
    });

    test('supplier raw import data (cleaned!)', () => {
      const product = mmMakeProduct(mockMmProduct_3HK_TopUp_Kyc);
      const importData = product.supplierImportData as unknown as MmProduct;
      expect(importData.productDetails.length).toBeGreaterThan(5);

      // originally, product details were under broken name (PlanDetails2, with extra space)
      // After cleansing, they should be under the corrected key (PlanDetails, no extra space)
      const originalPlanDetails = mockMmProduct_3HK_TopUp_Kyc.productDetails.find(
        (d) => d.name === MmProductDetailsType.PlanDetails2,
      );
      expect(originalPlanDetails).toBeDefined();
      const ourPlanDetails = importData.productDetails.find(
        (d) => d.name === MmProductDetailsType.PlanDetails,
      );
      expect(ourPlanDetails).toBeDefined();

      // Originally, additional details contain HTML
      // Our should be nicely parsed into structured text
      const originalAdditionalDetails = mockMmProduct_3HK_TopUp_Kyc.productDetails.find(
        (d) => d.name === MmProductDetailsType.AdditionalDetails,
      );
      expect(originalAdditionalDetails?.value).toContain('<h1>');
      const ourAdditionalDetails = importData.productDetails.find(
        (d) => d.name === MmProductDetailsType.AdditionalDetails,
      );
      expect(JSON.stringify(ourAdditionalDetails?.value).length).toBeGreaterThan(100);
      expect(JSON.stringify(ourAdditionalDetails?.value)).not.toContain('<h1>');
    });
  });

  test('usageTracking', () => {
    const product = mmMakeProduct(mockMmProduct_restrictedSpeed);
    expect(product.usageTracking).toBe(true);

    const productNoTracking = mmMakeProduct(mockMmProduct_3HK_VoiceAndDataText);
    expect(productNoTracking.usageTracking).toBe(false);
  });
});
