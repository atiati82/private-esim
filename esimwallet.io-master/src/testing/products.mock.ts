import {
  EsimPlanKyC,
  EsimPlanMaxSpeed,
  EsimPlanType,
  EsimProduct,
  EsimProductAttribute,
  EsimProductType,
  makeEsimProductObj,
} from '@/data/esim-product';
import { makeLocationProductStats } from '@/data/location-product-stats';
import { ProductSupplier } from '@/esim-core/suppliers';
import { EsimProductDto, EsimProductPricing } from '@/payload/app-types';

import {
  mockDestinationHk,
  mockDestinationTw,
  mockDestinationUK,
  mockDestinationUSA,
} from './destinations.mock';
import { mockRegionAmerica, mockRegionAsia, mockRegionAuO, mockRegionEurope } from './regions.mock';

const productStats = makeLocationProductStats({});
let _lastProductIdSeq = 0;

export type MockProductOpts = {
  listPrice: number;
};

export function mockProduct(
  dto: Partial<EsimProductDto> = {},
  opts: Partial<MockProductOpts> = {},
): EsimProduct {
  return makeEsimProductObj(mockProductDto(dto, opts));
}

export function mockProductDto(
  dto: Partial<EsimProductDto> = {},
  opts: Partial<MockProductOpts> = {},
): EsimProductDto {
  const productType = dto.productType || EsimProductType.eSIM;
  const productPricing: EsimProductPricing = {
    listPrice: opts.listPrice ?? 9.99,
    supplierPrice: 0.99,
    competitorPrices: {},
    ...dto.productPricing,
  };
  return {
    id: `mock-product-id-${++_lastProductIdSeq}`,
    name: `Mock ${productType} Product ${_lastProductIdSeq}`,
    productPricing,
    planType: EsimPlanType.DataOnly,
    planKycPolicy: EsimPlanKyC.No,
    planValidity: 7,
    planDataAllowance: 20,
    planVoiceAllowance: 0,
    planMaxSpeed: EsimPlanMaxSpeed['5G'],
    // destinations: [],
    // regions: [],
    productAttributes: [],

    supplier: ProductSupplier.MobiMatter,
    supplierProductId: `mock-supplier-product-id-${_lastProductIdSeq}`,
    supplierProductCreationDate: '2024-10-11T12:13:14.156+00:00',
    supplierProductLastUpdate: '2024-10-11T12:13:14.156+00:00',
    supplierImportData: {},

    productType,
    provider: 'three-hk',
    productFamily: 'X',
    productFamilyTopUpsCount: 5,
    usageTracking: true,

    createdAt: '',
    updatedAt: '',

    ...dto,
  };
}

export const mockProductEsimUk: EsimProduct = {
  id: '667e64d8f9a77c4ff5c1aa6a',
  name: 'UK Premium 50 GB',
  productType: EsimProductType.eSIM,
  productTypeLabel: 'eSIM',
  productFamily: 'Ubigi',
  productFamilyTopUpsCount: 500,
  productPricing: {
    listPrice: 41.99,
    supplierPrice: 27.06,
    pricePerGb: 0.84,
    competitorPrices: {},
  },
  productAttributes: [
    {
      name: 'activation-policy',
      value: 'Validity will start upon downloading the eSIM to your device.',
    },
    {
      name: 'activation-policy',
      value: 'Please start using the eSIM no more than 3 months after purchase.',
    },
    { name: 'feature:hotspot', value: '' },
    { name: 'limits:no-limits', value: '' },
    { name: 'network', value: 'Chunghwa' },
  ],
  provider: {
    id: 'ubigi',
    name: 'Ubigi',
    logoUrl: '/api/esim-providers/file/ubigi2.png',
    logoWidth: 63,
    logoHeight: 84,
  },
  planType: EsimPlanType.DataOnly,
  planTypeLabel: 'Data Only',
  planKycPolicy: EsimPlanKyC.No,
  planValidity: 30,
  planDataAllowance: 50,
  planVoiceAllowance: 0,
  planMaxSpeed: EsimPlanMaxSpeed['5G'],
  planMaxSpeedLabel: '5G',
  destinations: [
    {
      id: 'gb',
      name: 'United Kingdom',
      slug: 'united-kingdom',
      region: { id: 'europe', name: 'Europe', slug: 'europe', productStats },
      keywords: 'London, Scotland, Wales, Ireland, Birmingham, Manchester, Glasgow, Leeds',
      isTopDestination: true,
      productStats,
    },
  ],
  regions: [mockRegionEurope],
  supplier: ProductSupplier.MobiMatter,
  supplierProductId: 'A4965797-DB88-48C8-BDFC-7B90FF16DA1F',
  supplierProductCreationDate: '2020-10-27T06:28:55.930Z',
  supplierProductLastUpdate: '2024-06-28T00:20:17.003Z',
  usageTracking: true,
};

export const mockProductEsimUk2: EsimProduct = {
  id: '667e64dcf9a77c4ff5c1b14f',
  name: 'US CA UK AU NZ 100 GB',
  productType: EsimProductType.eSIM,
  productTypeLabel: 'eSIM',
  productFamily: '3HK',
  productFamilyTopUpsCount: 123,
  productPricing: { listPrice: 29.99, supplierPrice: 25.5, competitorPrices: {} },
  productAttributes: [
    {
      name: EsimProductAttribute.Warning,
      value: 'Cannot be used in Saudi Arabia with Google Pixel phones.',
    },
    {
      name: EsimProductAttribute.Warning,
      value: 'Another warning, if present. Lorem ipsum dolor sit amet.',
    },
    {
      name: EsimProductAttribute.Technical,
      value:
        'You can contact the operator in Brazil directly at +5521981908190 (call or WhatsApp)  if you face any connectivity problems.',
    },
    {
      name: 'activation-policy',
      value:
        'Package validity will start upon scanning the QR code. The eSIM must be activated within 6 months from purchase.',
    },
    { name: 'feature:hotspot', value: '' },
    {
      name: EsimProductAttribute.LimitsDaily,
      value:
        'In case of exceeding daily 1 GB high-speed allowance, speed will be limited to 512 Kbps for the remainder of the day, which may impact your experience with video streaming and other data-intensive applications',
    },
    { name: 'voice:phone-number', value: 'Hong Kong (+852)' },
    {
      name: 'voice:info',
      value:
        'The starting package includes 10,000 Hong Kong Voice minutes, 100GB of General data, plus 20GB of Social data usable for WhatsApp, Instagram, Facebook, Line and WeChat apps. If Social data balance is exhausted these apps will continue to work using the General data allowance.',
    },
    { name: EsimProductAttribute.Network, value: 'EE in United Kingdom' },
    { name: EsimProductAttribute.Network, value: 'Turkcell and Avea networks in Turkey' },
  ],
  provider: {
    id: 'three-hk',
    name: '3 HK',
    logoUrl: '/api/esim-providers/file/3HK.png',
    logoWidth: 128,
    logoHeight: 128,
  },
  planType: EsimPlanType.DataOnly,
  planTypeLabel: 'Data Only',
  planKycPolicy: EsimPlanKyC.Required,
  planValidity: 30,
  planDataAllowance: 100,
  planVoiceAllowance: 0,
  planMaxSpeed: EsimPlanMaxSpeed['4G'],
  planMaxSpeedLabel: '4G LTE',
  destinations: [
    {
      id: 'au',
      name: 'Australia',
      slug: 'australia',
      region: {
        id: 'australia-oceania',
        name: 'Australia and Oceania',
        slug: 'australia-oceania',
        productStats,
      },
      keywords: 'Canberra',
      isTopDestination: true,
      productStats,
    },
    {
      id: 'ca',
      name: 'Canada',
      slug: 'canada',
      region: { id: 'america', name: 'America', slug: 'america', productStats },
      keywords: 'Ottawa',
      productStats,
    },
    {
      id: 'hk',
      name: 'Hong Kong',
      slug: 'hong-kong',
      region: { id: 'asia', name: 'Asia', slug: 'asia', productStats },
      keywords: 'Victoria',
      productStats,
    },
    {
      id: 'nz',
      name: 'New Zealand',
      slug: 'new-zealand',
      region: {
        id: 'australia-oceania',
        name: 'Australia and Oceania',
        slug: 'australia-oceania',
        productStats,
      },
      keywords: 'Wellington',
      productStats,
    },
    {
      id: 'gb',
      name: 'United Kingdom',
      slug: 'united-kingdom',
      region: { id: 'europe', name: 'Europe', slug: 'europe', productStats },
      keywords: 'London, Scotland, Wales, Ireland, Birmingham, Manchester, Glasgow, Leeds',
      isTopDestination: true,
      productStats,
    },
    {
      id: 'ru',
      name: 'Russia',
      slug: 'russia',
      region: { id: 'europe', name: 'Europe', slug: 'europe', productStats },
      keywords: 'Moscow',
      isTopDestination: false,
      productStats,
    },
    {
      id: 'pl',
      name: 'Poland',
      slug: 'poland',
      region: { id: 'europe', name: 'Europe', slug: 'europe', productStats },
      keywords: 'Warszawa',
      isTopDestination: false,
      productStats,
    },
    {
      id: 'fj',
      name: 'Fiji',
      slug: 'fiji',
      region: {
        id: 'australia-oceania',
        name: 'Australia and Oceania',
        slug: 'australia-oceania',
        productStats,
      },
      keywords: 'Suva',
      isTopDestination: false,
      productStats,
    },
    {
      id: 'us',
      name: 'United States',
      slug: 'united-states',
      region: { id: 'america', name: 'America', slug: 'america', productStats },
      keywords:
        'Washington, USA, Alaska, Arizona, California, Chicago, Colorado, Florida, Hawaii, Los Angeles, Nevada, NY New York, SF San Francisco, Texas, Virginia',
      isTopDestination: true,
      productStats,
    },
  ],
  regions: [mockRegionAuO, mockRegionAmerica, mockRegionAsia],
  supplier: ProductSupplier.MobiMatter,
  supplierProductId: '11d8e3ca-f9ff-44a9-8005-0559cd5e2c54',
  supplierProductCreationDate: '2021-12-11T09:29:08.480Z',
  supplierProductLastUpdate: '2024-06-28T00:20:17.003Z',
  usageTracking: true,
};

export const mockProductDefaultEsimVoiceKyc: EsimProduct = {
  id: '667e64dcf9a77c4ab5c1b14f',
  name: 'HK TW US UK 100 GB',
  productType: EsimProductType.eSIM,
  productTypeLabel: 'eSIM',
  productFamily: '3HK',
  productFamilyTopUpsCount: 55,
  productPricing: { listPrice: 29.99, supplierPrice: 25.5, competitorPrices: {}, pricePerGb: 0.1 },
  productAttributes: [
    { name: EsimProductAttribute.Network, value: 'EE in United Kingdom' },
    { name: EsimProductAttribute.Network, value: 'Turkcell and Avea networks in Turkey' },
    {
      name: 'activation-policy',
      value:
        'Package validity will start upon scanning the QR code. The eSIM must be activated within 6 months from purchase.',
    },
    { name: 'feature:hotspot', value: '' },
    {
      name: 'kyc',
      value:
        'Here KYC content from product attributes - if present. Can be provided by supplier. Lorem ipsum dolor sit amet.',
    },
    { name: 'kyc:hk', value: '' },
    { name: 'kyc:tw', value: '' },
    { name: 'voice:phone-number', value: 'Hong Kong (+852)' },
    {
      name: 'voice:info',
      value:
        'The bundle contains 50 GB of high-speed data, 100 local minutes call any Thailand network numbers, 30 minutes to call India, South Korea, and Vietnam, and 15 Baht credit for other use.',
    },
    {
      name: EsimProductAttribute.Warning,
      value: 'Cannot be used in Saudi Arabia with Google Pixel phones.',
    },
    {
      name: EsimProductAttribute.Warning,
      value: 'Another warning, if present. Lorem ipsum dolor sit amet.',
    },
    {
      name: EsimProductAttribute.Technical,
      value:
        'You can contact the operator in Brazil directly at +5521981908190 (call or WhatsApp)  if you face any connectivity problems.',
    },
    {
      name: EsimProductAttribute.Extras,
      value:
        'Night Fever Unlimited - Usage between 23:00-07:00 does not count towards data allowance.',
    },
  ],
  provider: {
    id: 'three-hk',
    name: '3 HK',
    logoUrl: '/api/esim-providers/file/3HK.png',
    logoWidth: 128,
    logoHeight: 128,
  },
  planType: EsimPlanType.VoiceAndData,
  planTypeLabel: 'Voice & Data',
  planKycPolicy: EsimPlanKyC.Required,
  planValidity: 30,
  planDataAllowance: 100,
  planVoiceAllowance: 10000,
  planMaxSpeed: EsimPlanMaxSpeed['5G'],
  planMaxSpeedLabel: '5G',
  destinations: [mockDestinationHk, mockDestinationTw, mockDestinationUK, mockDestinationUSA],
  regions: [mockRegionAmerica, mockRegionAsia],
  supplier: ProductSupplier.MobiMatter,
  supplierProductId: '11d8e3ca-f9ff-44a9-8005-0559cd5e2c54',
  supplierProductCreationDate: '2021-12-11T09:29:08.480Z',
  supplierProductLastUpdate: '2024-06-28T00:20:17.003Z',
  usageTracking: true,
};

export const mockProductTopUp: EsimProduct = {
  id: '667e64dcf9a77c4ff5c1b14a',
  name: 'HK TW US UK 100 GB',
  productType: EsimProductType.TopUp,
  productTypeLabel: 'Top-Up',
  productFamily: '3HK',
  productFamilyTopUpsCount: 33,
  productPricing: { listPrice: 29.99, supplierPrice: 25.5, pricePerGb: 0.3, competitorPrices: {} },
  productAttributes: [
    { name: EsimProductAttribute.Network, value: 'EE in United Kingdom' },
    { name: EsimProductAttribute.Network, value: 'Turkcell and Avea networks in Turkey' },
    {
      name: 'activation-policy',
      value:
        'Package validity will start upon scanning the QR code. The eSIM must be activated within 6 months from purchase.',
    },
    { name: 'feature:hotspot', value: '' },
    {
      name: 'kyc',
      value:
        'Here KYC content from product attributes - if present. Can be provided by supplier. Lorem ipsum dolor sit amet.',
    },
    {
      name: EsimProductAttribute.Warning,
      value: 'Cannot be used in Saudi Arabia with Google Pixel phones.',
    },
    {
      name: EsimProductAttribute.Technical,
      value:
        'You can contact the operator in Brazil directly at +5521981908190 (call or WhatsApp)  if you face any connectivity problems.',
    },
  ],
  provider: {
    id: 'three-hk',
    name: '3 HK',
    logoUrl: '/api/esim-providers/file/3HK.png',
    logoWidth: 128,
    logoHeight: 128,
  },
  planType: EsimPlanType.DataOnly,
  planTypeLabel: 'Data Only',
  planKycPolicy: EsimPlanKyC.No,
  planValidity: 30,
  planDataAllowance: 100,
  planVoiceAllowance: 0,
  planMaxSpeed: EsimPlanMaxSpeed['5G'],
  planMaxSpeedLabel: '5G',
  destinations: [mockDestinationHk, mockDestinationTw, mockDestinationUK, mockDestinationUSA],
  regions: [mockRegionAmerica, mockRegionAsia],
  supplier: ProductSupplier.MobiMatter,
  supplierProductId: '11d8e3ca-f9ff-44a9-8005-0559cd5e2c54',
  supplierProductCreationDate: '2021-12-11T09:29:08.480Z',
  supplierProductLastUpdate: '2024-06-28T00:20:17.003Z',
  usageTracking: false,
};
