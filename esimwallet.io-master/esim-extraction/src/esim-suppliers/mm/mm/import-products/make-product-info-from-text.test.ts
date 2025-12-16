import { describe, expect, test } from 'vitest';

import {
  EsimPlanKyC,
  EsimPlanType,
  EsimProductAttribute,
  EsimProductAttributeItem,
  getProductAttributes,
  makeProductAttribute,
} from '@/data/esim-product';

import {
  mockMmProduct_3HK_VoiceAndDataText,
  mockMmProduct_additionalDetails_kycForHongKongAndTaiwan,
  mockMmProduct_additionalDetails_kycForHongKongOnly,
  mockMmProduct_additionalDetails_wontActivateOnTuesday,
  mockMmProduct_dataVoiceUnlimitedEU,
  mockMmProduct_Facil_VoiceAndData,
  mockMmProduct_productDetails_kycForHongKongAndTaiwan,
  mockMmProduct_productDetails_voiceRecharge,
  mockMmProduct_Spark_RegionalAmEu,
  mockMmProduct_Viettel_eSIM,
} from '../mocks/mm-products.mock';
import {
  mockMmProductWithAdditionalDetails,
  mockMmProductWithDetails,
} from '../mocks/mock-mm-utils';
import { makeProductInfoFromText } from './make-product-info-from-text';

describe('MM: makeProductInfoFromText()', function () {
  describe('_processWarnings()', () => {
    test('warning: DoesNotWorkInX', () => {
      const mockTextItem = 'ATTENTION: This package does not work in Alaska';
      const expectedWarning = 'This package does not work in Alaska.';
      const { productData, allItemsToProcess, itemsProcessed, itemsUnprocessed } =
        makeProductInfoFromText(mockMmProduct_Spark_RegionalAmEu);
      expect(allItemsToProcess).toContainEqual(expect.stringContaining(mockTextItem));
      expect(itemsProcessed).toContainEqual(expect.stringContaining(mockTextItem));
      expect(itemsUnprocessed).not.toContainEqual(expect.stringContaining(mockTextItem));
      expect(productData.productAttributes).toContainEqual(
        makeProductAttribute(EsimProductAttribute.Warning, expectedWarning),
      );
    });
    test('warning: NotCompatibleWithPhonesX', () => {
      const mockTextItem = 'Not compatible to use in Japan with Google Pixel phones';
      const expectedWarning = mockTextItem + '.';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(expect.stringContaining(mockTextItem));
      expect(itemsProcessed).toContainEqual(expect.stringContaining(mockTextItem));
      expect(productData.productAttributes).toContainEqual(
        makeProductAttribute(EsimProductAttribute.Warning, expectedWarning),
      );
    });
    test('warning: NotCompatibleWithPhonesX (2)', () => {
      const mockTextItem = 'Cannot be used in Saudi Arabia with Google Pixel phones';
      const expectedWarning = mockTextItem + '.';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(expect.stringContaining(mockTextItem));
      expect(itemsProcessed).toContainEqual(expect.stringContaining(mockTextItem));
      expect(productData.productAttributes).toContainEqual(
        makeProductAttribute(EsimProductAttribute.Warning, expectedWarning),
      );
    });
  });

  describe('_processTechnicalInfo()', () => {
    test('contact operator directly', () => {
      const mockTextItem = 'You can contact the operator in Brazil directly at +5521981908190.';
      const mockMmProduct = mockMmProductWithAdditionalDetails(mockTextItem);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockTextItem);
      expect(itemsProcessed).toContainEqual(mockTextItem);
      expect(productData.productAttributes).toContainEqual(
        makeProductAttribute(EsimProductAttribute.Technical, mockTextItem),
      );
    });
  });

  describe('_processFeatures()', () => {
    test('FeatHotspot', () => {
      const expected = 'Mobile hotspot is supported';
      const { productData, itemsProcessed } = makeProductInfoFromText(
        mockMmProduct_Facil_VoiceAndData,
      );
      expect(itemsProcessed).toContainEqual(expect.stringContaining(expected));
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.FeatHotspot,
        value: '',
      });
    });
    test('FeatBestCoverage', () => {
      const mockedDescription = 'Widest network coverage in Mexico on X network';
      const mockMmProduct = mockMmProductWithDetails(mockedDescription);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockedDescription);
      expect(itemsProcessed).toContainEqual(mockedDescription);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.FeatBestCoverage,
        value: mockedDescription + '.',
      });
    });
  });

  describe('parsing limits:', () => {
    test('_processLimits_NoLimits()', () => {
      const expected = 'Full data speeds - no daily limits, no throttling';
      const { productData, itemsProcessed } = makeProductInfoFromText(
        mockMmProduct_Facil_VoiceAndData,
      );
      expect(itemsProcessed).toContainEqual(expect.stringContaining(expected));
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.NoLimits,
        value: '',
      });
    });
    test('_processLimits() some limits', () => {
      const mockDailyLimits = 'Usage limitation: 5 GB per day';
      const { productData, allItemsToProcess, itemsProcessed } = makeProductInfoFromText(
        mockMmProduct_Viettel_eSIM,
      );
      expect(allItemsToProcess).toContainEqual(expect.stringContaining(mockDailyLimits));
      expect(itemsProcessed).toContainEqual(expect.stringContaining(mockDailyLimits));
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Limits,
        value: expect.stringContaining(mockDailyLimits),
      });
    });
    test('_processLimits() daily', () => {
      const mockDailyLimits =
        'ATTENTION: In case of exceeding daily 1 GB high-speed allowance, speed will be limited to 512 Kbps for the remainder of the day';
      const expectedLimitsInfo =
        'In case of exceeding daily 1 GB high-speed allowance, speed will be limited to 512 Kbps for the remainder of the day.';
      const mockMmProduct = mockMmProductWithDetails(mockDailyLimits);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(expect.stringContaining(mockDailyLimits));
      expect(itemsProcessed).toContainEqual(expect.stringContaining(mockDailyLimits));
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.LimitsDaily,
        value: expectedLimitsInfo,
      });
    });
  });

  describe('_processActivationPolicy()', () => {
    test('Can be downloaded only once', () => {
      const mockDescription =
        'ATTENTION: Digicel eSIMs can be downloaded only once on a single device. They are non-replaceable, non-transferable and non-recoverable if deleted';
      const mockMmProduct = mockMmProductWithDetails(mockDescription);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(expect.stringContaining(mockDescription));
      expect(itemsProcessed).toContainEqual(expect.stringContaining(mockDescription));
      expect(productData.productAttributes).toContainEqual({
        name: EsimProductAttribute.ActivationPolicy,
        value: expect.stringContaining('Can be downloaded only once'),
      });
    });
    test('Dial XYZ to activate the data package.', () => {
      const mockDescription = 'Dial 6699 to activate the data package.';
      const mockMmProduct = mockMmProductWithAdditionalDetails(mockDescription);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual({
        name: EsimProductAttribute.ActivationPolicy,
        value: mockDescription,
      });
    });
    test('Dial XYZ to activate the data package once connected', () => {
      const mockDescription = 'Dial 6677 to activate the data package once connected';
      const mockMmProduct = mockMmProductWithAdditionalDetails(mockDescription);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual({
        name: EsimProductAttribute.ActivationPolicy,
        value: mockDescription + '.',
      });
    });
    test('Once connected, dial XYZ to activate the data package', () => {
      const mockDescription =
        'Once connected to network in one of the eligible countries, dial *122# to activate the data package.';
      const mockMmProduct = mockMmProductWithAdditionalDetails(mockDescription);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual({
        name: EsimProductAttribute.ActivationPolicy,
        value: mockDescription,
      });
    });
    test('Will not activate on Tuesday night', () => {
      const mockDescription = mockMmProduct_additionalDetails_wontActivateOnTuesday.value as string;
      const mockMmProduct = mockMmProductWithAdditionalDetails(mockDescription);
      const { productData, itemsProcessed } = makeProductInfoFromText(mockMmProduct);
      expect(itemsProcessed).toContainEqual(
        expect.stringContaining('Will not activate on Tuesday night'),
      );
      expect(itemsProcessed).toContainEqual(expect.stringContaining('weekly maintenance'));
      expect(productData.productAttributes).toContainEqual({
        name: EsimProductAttribute.ActivationPolicy,
        value: expect.stringContaining('Will not activate on Tuesday night.'),
      });
      expect(productData.productAttributes).toContainEqual({
        name: EsimProductAttribute.ActivationPolicy,
        value: expect.stringContaining('weekly maintenance'),
      });
    });
  });
  describe('_processValidityPolicy()', () => {
    test('extract validity policy', () => {
      const expected = 'Package validity will start upon scanning the QR code.';
      const { productData, itemsProcessed } = makeProductInfoFromText(
        mockMmProduct_3HK_VoiceAndDataText,
      );
      expect(itemsProcessed).toContainEqual(expect.stringContaining(expected));
      expect(productData.productAttributes).toContainEqual({
        name: EsimProductAttribute.ActivationPolicy,
        value: expect.stringContaining(expected),
      });
    });
  });

  describe('_processPhoneNumber', () => {
    test('extract phone number', () => {
      const mockTextItem =
        'This is a 3 Hong Kong local prepaid line and comes with Hong Kong (+852) phone number.';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockTextItem);
      expect(itemsProcessed).toContainEqual(mockTextItem);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoicePhoneNumber,
        value: 'Hong Kong (+852)',
      });
    });
  });

  describe('_processCellNetworks', () => {
    test('Connects to X network', () => {
      const mockDescription = 'Connects to Orange network in Madagascar with 4G LTE speeds.';
      const mockMmProduct = mockMmProductWithDetails(mockDescription, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Orange',
      });
    });
    test('Connects to X and Y networks', () => {
      const mockDescription = 'Connects to Vivo network in Brazil and Movistar networks elsewhere.';
      const mockMmProduct = mockMmProductWithDetails(mockDescription, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Vivo',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Movistar',
      });
    });
    test('Connects to X and Z networks', () => {
      const mockDescription =
        'Connects to Maroc Telecom and Orange (Medi) networks in Morocco with 4G LTE speeds.';
      const mockMmProduct = mockMmProductWithDetails(mockDescription, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Maroc',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Orange (Medi)',
      });
    });
    test('Connects to X and Y, Z networks', () => {
      const mockDescription =
        'Connects to T-Mobile network in USA and Bell, Telus networks in Canada with 5G or 4G LTE speeds.';
      const mockMmProduct = mockMmProductWithDetails(mockDescription, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'T-Mobile',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Bell',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Telus',
      });
    });
    test('Works to X,Y,Z in multiple countries', () => {
      const mockDescription =
        'Works on VIETTEL and VINAPHONE in Vietnam, SMART and METFONE in Cambodia, CELCOM in Malaysia and CSL in Hong Kong with 4G speeds.';
      const mockMmProduct = mockMmProductWithDetails(mockDescription, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'VIETTEL',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'VINAPHONE',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'CELCOM',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'CSL',
      });
    });
    test('Docomo network', () => {
      const mockDescription = 'Docomo network';
      const mockMmProduct = mockMmProductWithDetails(mockDescription);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Docomo',
      });
    });
    test('from: XYZ eSIMs can be downloaded only once', () => {
      const mockDescription = 'ATTENTION: Digicel eSIMs can be downloaded only once';
      const mockMmProduct = mockMmProductWithDetails(mockDescription, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockDescription);
      expect(itemsProcessed).toContainEqual(mockDescription);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Network,
        value: 'Digicel',
      });
    });
  });

  describe('_processTechnicalInfo()', () => {
    test('To check data usage:', () => {
      const mockedDescription = 'To check data usage: Send a message with the content XYZ to 191';
      const mockMmProduct = mockMmProductWithAdditionalDetails(mockedDescription);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockedDescription);
      expect(itemsProcessed).toContainEqual(mockedDescription);
      expect(productData.productAttributes).toContainEqual({
        name: EsimProductAttribute.Technical,
        value: mockedDescription + '.',
      });
    });
  });

  describe('_processExtras', () => {
    test('Also works in...', () => {
      const mockTextItem = 'Also works in neighboring France and Spain.';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockTextItem);
      expect(itemsProcessed).toContainEqual(mockTextItem);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.Extras,
        value: mockTextItem,
      });
    });
  });

  describe('_processDataVoiceInfo()', () => {
    test('includes data and XXX voice minutes', () => {
      const mockTextItem = 'The package includes 36GB of data, plus 5,000 Hong Kong Voice minutes.';
      const mockTextItem2 = 'Additional 100 minutes included to call numbers in 10 Asian countries';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem, undefined, [mockTextItem2]);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockTextItem);
      expect(allItemsToProcess).toContainEqual(mockTextItem2);
      expect(itemsProcessed).toContainEqual(mockTextItem);
      expect(itemsProcessed).toContainEqual(mockTextItem2);
      expect(productData.suggestedPlanType).toBe(EsimPlanType.VoiceAndData);
      expect(productData.planVoiceAllowance).toBe(5000);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoiceInfo,
        value: expect.stringContaining(mockTextItem),
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoiceInfo,
        value: expect.stringContaining(mockTextItem2),
      });
    });
    test('includes unlimited calls', () => {
      const { productData } = makeProductInfoFromText(mockMmProduct_dataVoiceUnlimitedEU);
      expect(productData.planVoiceAllowance).toBe(-1);
      expect(productData.suggestedPlanType).toBe(EsimPlanType.VoiceAndData);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoiceInfo,
        value: 'Unlimited calls within EU, and incoming SMS. Sending SMS is not allowed.',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoiceInfo,
        value: expect.stringContaining('credit included to call'),
      });
    });
    test('contains data and XXX local minutes', () => {
      const mockTextItem =
        'The bundle contains 50 GB of high-speed data, 100 local minutes call any Thailand network numbers';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockTextItem);
      expect(itemsProcessed).toContainEqual(mockTextItem);
      expect(productData.suggestedPlanType).toBe(EsimPlanType.VoiceAndData);
      expect(productData.planVoiceAllowance).toBe(100);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoiceInfo,
        value: mockTextItem,
      });
    });
    test('contains XXX minutes and data', () => {
      const mockTextItem =
        'The starting package includes 2,000 Hong Kong Voice minutes and 2 GB of data.';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(allItemsToProcess).toContainEqual(mockTextItem);
      expect(itemsProcessed).toContainEqual(mockTextItem);
      expect(productData.suggestedPlanType).toBe(EsimPlanType.VoiceAndData);
      expect(productData.planVoiceAllowance).toBe(2000);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoiceInfo,
        value: mockTextItem,
      });
    });
    test('phone num by SMS', () => {
      const { productData, itemsProcessed } = makeProductInfoFromText(
        mockMmProduct_dataVoiceUnlimitedEU,
      );
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoiceInfo,
        value: 'Phone number will be sent by SMS.',
      });
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.VoiceInfo,
        value: expect.stringContaining('SMS with your phone number'),
      });
      expect(itemsProcessed).toContain('Phone number will be sent by SMS');
    });
  });

  test('_processVoiceRecharge()', () => {
    const mockProductDetails = mockMmProduct_productDetails_voiceRecharge;
    const mockMmProduct = mockMmProductWithDetails(mockProductDetails);
    const { productData, allItemsToProcess, itemsProcessed } =
      makeProductInfoFromText(mockMmProduct);
    expect(allItemsToProcess).toContainEqual(expect.stringContaining(mockProductDetails.heading));
    expect(itemsProcessed).toContainEqual(expect.stringContaining(mockProductDetails.heading));
    expect(itemsProcessed.length).toBeGreaterThanOrEqual(3);

    expect(productData.suggestedPlanType).toBe(EsimPlanType.VoiceOnly);
    expect(productData.planVoiceAllowance).toBeUndefined(); // this one doesn't have info about num of minutes, it's pay-as-you-go

    const productVoiceAttributes = getProductAttributes(
      productData.productAttributes,
      EsimProductAttribute.VoiceInfo,
    );
    expect(productVoiceAttributes.length).toBeGreaterThanOrEqual(3); // heading + 2 extra text items
    expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
      name: EsimProductAttribute.VoiceInfo,
      value: expect.stringContaining('call prices vary by destination'),
    });
  });

  describe('_processKyc', () => {
    const kycForHongKong: EsimProductAttributeItem = { name: 'kyc:hk', value: '' };
    const kycForTaiwan: EsimProductAttributeItem = { name: 'kyc:tw', value: '' };

    test('KYC for HK only', () => {
      const mockMmProduct = mockMmProductWithAdditionalDetails(
        mockMmProduct_additionalDetails_kycForHongKongOnly.value as string,
      );
      mockMmProduct.countries = ['HK'];
      const { productData, itemsProcessed } = makeProductInfoFromText(mockMmProduct);
      expect(productData.kycPolicy).toBe(EsimPlanKyC.Required);
      expect(productData.productAttributes).toContainEqual(kycForHongKong);
      expect(productData.productAttributes).not.toContainEqual(kycForTaiwan); // the info was only for HK, not for TW
      expect(itemsProcessed).toContainEqual(expect.stringContaining('To use in Hong Kong'));
      expect(itemsProcessed).toContainEqual(expect.stringContaining('manual review'));
    });
    test('KYC for HK only, when multiple countries', () => {
      const mockMmProduct = mockMmProductWithAdditionalDetails(
        mockMmProduct_additionalDetails_kycForHongKongOnly.value as string,
      );
      mockMmProduct.countries = ['HK', 'US', 'BR'];
      const { productData, itemsProcessed } = makeProductInfoFromText(mockMmProduct);

      // We didn't mock any destinations, so the package can be for other destinations (i.e. America)
      // We only mark KYC if it's for HK/TW destination, otherwise it's NO, with exceptions from kycExtraInfo
      expect(productData.kycPolicy).toBeUndefined();
      expect(productData.productAttributes).toContainEqual(kycForHongKong);
      expect(productData.productAttributes).not.toContainEqual(kycForTaiwan); // the info was only for HK, not for TW
      expect(itemsProcessed).toContainEqual(expect.stringContaining('To use in Hong Kong'));
      expect(itemsProcessed).toContainEqual(expect.stringContaining('manual review'));
    });
    test('KYC for HK/TW destinations', () => {
      const mockProductDetails = mockMmProduct_productDetails_kycForHongKongAndTaiwan;
      const mockMmProduct = mockMmProductWithAdditionalDetails(
        mockMmProduct_additionalDetails_kycForHongKongAndTaiwan.value as string,
        mockMmProductWithDetails(mockProductDetails),
      );
      const { productData, itemsProcessed } = makeProductInfoFromText(mockMmProduct);

      // We didn't mock any destinations, so the package can be for other destinations (i.e. America)
      // We only mark KYC if it's for HK/TW destination, otherwise it's NO, with exceptions from kycExtraInfo
      expect(productData.kycPolicy).toBeUndefined();
      expect(productData.productAttributes).toContainEqual(kycForHongKong);
      expect(productData.productAttributes).toContainEqual(kycForTaiwan);
      expect(itemsProcessed).toContainEqual(expect.stringContaining('It WILL NOT WORK in Hong'));
      expect(itemsProcessed).toContainEqual(expect.stringContaining('manual review'));
    });
    test('KYC for HK/TW destinations: should set kyc=1 if HongKong destination', () => {
      const mockMmProduct = mockMmProductWithAdditionalDetails(
        mockMmProduct_additionalDetails_kycForHongKongAndTaiwan.value as string,
        mockMmProductWithDetails(mockMmProduct_productDetails_kycForHongKongAndTaiwan),
      );
      mockMmProduct.countries = ['HK'];
      const { productData } = makeProductInfoFromText(mockMmProduct);
      expect(productData.kycPolicy).toBe(EsimPlanKyC.Required);
    });
    test('KYC for HK/TW destinations: should set kyc=1 if Taiwan destination', () => {
      const mockMmProduct = mockMmProductWithAdditionalDetails(
        mockMmProduct_additionalDetails_kycForHongKongAndTaiwan.value as string,
        mockMmProductWithDetails(mockMmProduct_productDetails_kycForHongKongAndTaiwan),
      );
      mockMmProduct.countries = ['HK'];
      const { productData } = makeProductInfoFromText(mockMmProduct);
      expect(productData.kycPolicy).toBe(EsimPlanKyC.Required);
    });
    test('KYC: required', () => {
      const mockTextItem = 'KYC registration is mandatory. You will need to do this and that.';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(productData.kycPolicy).toBe(EsimPlanKyC.Required);
      expect(allItemsToProcess).toContainEqual(mockTextItem);
      expect(itemsProcessed).toContainEqual(mockTextItem);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.KYC,
        value: mockTextItem,
      });
    });
    test('KYC: not required', () => {
      const mockTextItem = 'KYC registration not required for the first 30 days.';
      const mockMmProduct = mockMmProductWithDetails(mockTextItem, undefined, []);
      const { productData, allItemsToProcess, itemsProcessed } =
        makeProductInfoFromText(mockMmProduct);
      expect(productData.kycPolicy).toBe(EsimPlanKyC.No);
      expect(allItemsToProcess).toContainEqual(mockTextItem);
      expect(itemsProcessed).toContainEqual(mockTextItem);
      expect(productData.productAttributes).toContainEqual(<EsimProductAttributeItem>{
        name: EsimProductAttribute.KYC,
        value: mockTextItem,
      });
    });
  });
});
