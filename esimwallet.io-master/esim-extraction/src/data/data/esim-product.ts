import type { OptionObject } from 'payload';

import { Destination, makeDestinationObj } from '@/data/destination';
import { EsimProvider, getShortProviderId, makeProviderObj } from '@/data/provider';
import { makeRegionObj, Region } from '@/data/region';
import { ProductSupplier } from '@/esim-core/suppliers';
import { formatPlanAllowanceNum, getFamilyNameFromProduct } from '@/lib/esim-wallet';
import { slug } from '@/lib/utils';
import {
  DestinationDto,
  EsimProductDto,
  EsimProductPricing,
  EsimProviderDto,
  RegionDto,
} from '@/payload/app-types';
import {
  getOptionLabel,
  getRelationIdVal,
  isObject,
  makeMinimalRelationObj,
} from '@/payload/utils/data-utils';

/**
 * Representation of eSIM product, from {@link EsimProductDto}
 */
export interface EsimProduct {
  id: string;
  name: string;

  /**
   * eSIM, top-up, replacement
   */
  productType: EsimProductType;
  productTypeLabel: string;

  productFamily: string;
  productFamilyTopUpsCount: number;

  productPricing: EsimProductPricing;
  productAttributes: EsimProductAttributeItem[];

  provider: EsimProvider;
  /**
   * Data or voice
   */
  planType: EsimPlanType;
  planTypeLabel: string;

  planKycPolicy: EsimPlanKyC;
  /**
   * Plan validity, in days
   */
  planValidity: number;
  /**
   * Plan data allowance, in GB
   */
  planDataAllowance: number;
  /**
   * Plan voice allowance, in minutes
   */
  planVoiceAllowance: number;
  planMaxSpeed: EsimPlanMaxSpeed;
  planMaxSpeedLabel: string;

  destinations: Destination[];
  regions: Region[];

  supplier: ProductSupplier;
  supplierProductId: string;
  supplierProductCreationDate: string;
  supplierProductLastUpdate: string;

  /**
   * When true, user will be able to track usage in the app (via API)
   * Otherwise, dialing #short code is necessary, to get back usage info
   */
  usageTracking: boolean;
}

export enum EsimProductAttribute {
  /**
   * Additional info about KYC
   */
  KYC = 'kyc',
  /**
   * Information about eSIM activation, when the activation needs to happen etc
   */
  ActivationPolicy = 'activation-policy',
  /**
   * Technical info, contacts, usage checking etc.
   */
  Technical = 'technical',
  /**
   * Different warnings: doesn't work here or there, not compatible with this or that
   */
  Warning = 'warning',
  /**
   * Flag indicating there's no limits, no throttling, no speed limits
   */
  NoLimits = 'limits:no-limits',
  /**
   * Might contain extra information about limits (daily, speed)
   */
  Limits = 'limits:yes',
  LimitsDaily = 'limits:yes:daily',
  /**
   * Which network eSIM connects to
   */
  Network = 'network',
  /**
   * If there are extras, freebies, this field will contain the info about it
   */
  Extras = 'extras',
  /**
   * Additional info about voice allowance, extras, SMSes etc.
   */
  VoiceInfo = 'voice:info',
  /**
   * Flag indicating eSIM comes with phone number.
   * It usually will contain info from which country and what prefix the number will be.
   */
  VoicePhoneNumber = 'voice:phone-number',
  /**
   * When present, indicates HotSpot/tethering woks on the eSIM
   */
  FeatHotspot = 'feature:hotspot',
  /**
   * Sometimes present in MobiMatter cards, it indicates that eSIM has the best coverage
   * in given destinations, in comparison to other providers.
   */
  FeatBestCoverage = 'feature:best-coverage',
}

export interface EsimProductAttributeItem {
  name: EsimProductAttribute | string;
  value: string;
}

export function makeEsimProductObj(p: EsimProductDto): EsimProduct {
  if (!isObject(p)) {
    return makeMinimalRelationObj(p);
  }

  return {
    id: p.id,
    name: p.name,
    productType: p.productType as EsimProductType,
    productTypeLabel: getOptionLabel(esimProductTypeOptions, p.productType),
    productFamily: p.productFamily,
    productFamilyTopUpsCount: p.productFamilyTopUpsCount ?? 0,
    productPricing: p.productPricing,
    productAttributes: p.productAttributes?.map((a) => ({ name: a.name!, value: a.value! })) ?? [],
    provider: makeProviderObj(p.provider as EsimProviderDto),
    planType: p.planType as EsimPlanType,
    planTypeLabel: getOptionLabel(esimPlanTypeOptions, p.planType),
    planKycPolicy: p.planKycPolicy as EsimPlanKyC,
    planValidity: p.planValidity,
    planDataAllowance: p.planDataAllowance,
    planVoiceAllowance: p.planVoiceAllowance,
    planMaxSpeed: p.planMaxSpeed as EsimPlanMaxSpeed,
    planMaxSpeedLabel: getOptionLabel(esimPlanMaxSpeedOptions, p.planMaxSpeed),
    destinations: p.destinations?.map((d) => makeDestinationObj(d as DestinationDto)) ?? [],
    regions: p.regions?.map((r) => makeRegionObj(r as RegionDto)) ?? [],
    supplier: p.supplier as ProductSupplier,
    supplierProductId: p.supplierProductId,
    supplierProductCreationDate: p.supplierProductCreationDate,
    supplierProductLastUpdate: p.supplierProductLastUpdate,
    usageTracking: p.usageTracking ?? false,
  };
}

export function makeProductId(product: EsimProductDto | EsimProduct): string {
  const planInfo = [
    product.planValidity + 'd',
    isDataPlanType(product) && formatPlanAllowanceNum(product.planDataAllowance) + 'gb',
    isVoicePlanType(product) && formatPlanAllowanceNum(product.planDataAllowance) + 'min',
  ]
    .filter(Boolean)
    .join('')
    .replace('Unlimited', 'unl')
    .replace('.', ''); // convert 0.5gb => 05gb

  const locationCount = product.destinations?.length ?? 1;
  const locationInfo = locationCount === 1 ? '' : 'l' + locationCount;

  const productName = slug(getFamilyNameFromProduct(product as EsimProduct))
    .replace('-and-', '-')
    .replace('-yearly', '-')
    .replace('top-up-', '');

  const segments = [
    productName,
    planInfo,
    getShortProviderId(getRelationIdVal(product.provider) ?? 'missing-provider'),
    locationInfo,
    product.supplier.toLowerCase() +
      product.supplierProductId.substring(product.supplierProductId.length - 6).toLowerCase(),
  ];
  return segments.filter(Boolean).join('-') + '.' + product.productType.toLowerCase();
}

export function makeProductAttribute(
  name: EsimProductAttribute | string,
  value: string | undefined,
): EsimProductAttributeItem {
  return { name, value: value ? value.trim() : '' };
}

export function makeActivationPolicyProductAttribute(policyText: string): EsimProductAttributeItem {
  return makeProductAttribute(EsimProductAttribute.ActivationPolicy, policyText);
}

export function makeNetworkProductAttribute(networkName: string): EsimProductAttributeItem {
  return makeProductAttribute(EsimProductAttribute.Network, networkName);
}

export function getProductAttributes(
  attributes: EsimProductAttributeItem[],
  byType: EsimProductAttribute | string,
  allowLooseMatch = true,
): EsimProductAttributeItem[] {
  return attributes.filter(
    (attrib) => attrib.name === byType || (allowLooseMatch && attrib.name.startsWith(byType)),
  );
}

export function getProductAttribute(
  attributes: EsimProductAttributeItem[],
  byType: EsimProductAttribute | string,
): EsimProductAttributeItem | undefined {
  return getProductAttributes(attributes, byType, false).shift();
}

export const productSupplierOptions: OptionObject[] = [
  { value: ProductSupplier.MobiMatter, label: 'MobiMatter' },
];

export enum EsimProductType {
  eSIM = 'eSIM',
  eSIMdelayed = 'eSIMdelayed',
  TopUp = 'TopUp',
  Replacement = 'Replacement',
}
export const esimProductTypeOptions: OptionObject[] = [
  { value: EsimProductType.eSIM, label: 'eSIM' },
  { value: EsimProductType.eSIMdelayed, label: 'eSIM delayed' },
  { value: EsimProductType.TopUp, label: 'Top-Up' },
  { value: EsimProductType.Replacement, label: 'eSIM replacement' },
];

export function isEsimStarter(productType: `${EsimProductType}` | EsimProductType): boolean {
  return productType === EsimProductType.eSIM || productType === EsimProductType.eSIMdelayed;
}
export function isEsimTopUp(productType: `${EsimProductType}` | EsimProductType): boolean {
  return productType === EsimProductType.TopUp;
}
export function isEsimReplacement(productType: `${EsimProductType}` | EsimProductType): boolean {
  return productType === EsimProductType.Replacement;
}

export enum EsimPlanType {
  DataOnly = '0',
  VoiceAndData = '1',
  VoiceOnly = '2',
}
export const esimPlanTypeOptions: OptionObject[] = [
  { value: EsimPlanType.DataOnly, label: 'Data Only' },
  { value: EsimPlanType.VoiceAndData, label: 'Voice & Data' },
  { value: EsimPlanType.VoiceOnly, label: 'Voice Only' },
];

export enum EsimPlanMaxSpeed {
  '4G' = '4g',
  '5G' = '5g',
}
export const esimPlanMaxSpeedOptions: OptionObject[] = [
  { value: EsimPlanMaxSpeed['4G'], label: '4G LTE' },
  { value: EsimPlanMaxSpeed['5G'], label: '5G' },
];

export enum EsimPlanKyC {
  No = '0',
  Required = '1',
}
export const esimPlanKycOptions: OptionObject[] = [
  { value: EsimPlanKyC.No, label: 'No' },
  { value: EsimPlanKyC.Required, label: 'Required' },
];

export function isDataPlanType(product: EsimProduct | EsimProductDto): boolean {
  return (
    product.planType === EsimPlanType.DataOnly || product.planType === EsimPlanType.VoiceAndData
  );
}
export function isVoicePlanType(product: EsimProduct | EsimProductDto): boolean {
  return (
    product.planType === EsimPlanType.VoiceOnly || product.planType === EsimPlanType.VoiceAndData
  );
}
