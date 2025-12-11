/**
 * Sandbox/test product *Test 1GB* which doesn't cost money when ordered from MM.
 * But it also doesn't appear in ordered eSIMs nor can't be usage-tracked.
 */
export const MmSandboxProductId = '75b98dc7-c026-48c1-9fee-465681382d39';

export enum MmProductCategory {
  eSIM = 'esim_realtime',
  eSIMdelayed = 'esim_delayed',
  TopUp = 'esim_addon',
  Replacement = 'esim_replacement',
}
export type MmProductCategories =
  | MmProductCategory
  | 'esim_realtime'
  | 'esim_delayed'
  | 'esim_addon'
  | 'esim_replacement';

export interface MmProvider {
  providerId: number;
  providerName: string;
  providerLogo: string;
}

export interface MmProduct extends MmProvider {
  productId: string;
  uniqueId: string;
  rank: number;
  merchantId: string;
  productFamilyId: number;
  productFamilyName: string;
  productCategory: MmProductCategories;
  productCategoryId: number;
  wholesalePrice: number;
  retailPrice: number;
  currencyCode: string;
  created: string; // ISO 8601 datetime string
  updated: string; // ISO 8601 datetime string with higher precision
  regions: string[];
  countries: string[];
  displayAttributes?: unknown[];
  productDetails: MmProductDetail[];
}

export enum MmProductDetailsType {
  HasTopUps = 'TOPUP',
  PlanTitle = 'PLAN_TITLE',
  PlanDetails = 'PLAN_DETAILS',
  PlanDetails2 = 'PLAN_DETAILS ',
  AdditionalDetails = 'ADDITIONAL_DETAILS',
  ActivationPolicy = 'ACTIVATION_POLICY',
  PlanValidity = 'PLAN_VALIDITY',
  HasData = 'HAS_DATA',
  PlanDataLimit = 'PLAN_DATA_LIMIT',
  PlanDataUnit = 'PLAN_DATA_UNIT',
  HasSms = 'HAS_SMS',
  HasVoice = 'HAS_CALLS',
  PlanVoiceLimit = 'PLAN_VOICE_LIMIT',
  HotSpot = 'HOTSPOT',
  SpeedLimit = 'SPEED', // Unrestricted | Limited | xMBit
  SpeedExtraInfo = 'SPEED_LONG',
  Tags = 'TAGS',
  FiveG = 'FIVEG',
  FiveGLabel = 'NETWORKS_SHORT',
  UsageTracking = 'USAGE_TRACKING',
  ExternallyShown = 'EXTERNALLY_SHOWN',
  CheckUsage = 'CHECK_USAGE_PACKAGES',
  Rank = 'OFFER_RANK',
}
type MmProductDetailsTypes =
  | MmProductDetailsType
  | 'TOPUP'
  | 'PLAN_TITLE'
  | 'PLAN_DETAILS'
  | 'PLAN_DETAILS '
  | 'ADDITIONAL_DETAILS'
  | 'ACTIVATION_POLICY'
  | 'PLAN_VALIDITY'
  | 'HAS_DATA'
  | 'PLAN_DATA_LIMIT'
  | 'PLAN_DATA_UNIT'
  | 'HAS_SMS'
  | 'HAS_CALLS'
  | 'PLAN_VOICE_LIMIT'
  | 'HOTSPOT'
  | 'SPEED'
  | 'SPEED_LONG'
  | 'TAGS'
  | 'FIVEG'
  | 'NETWORKS_SHORT'
  | 'USAGE_TRACKING'
  | 'EXTERNALLY_SHOWN'
  | 'CHECK_USAGE_PACKAGES'
  | 'OFFER_RANK';

export interface MmProductDetail<T = unknown> {
  name: MmProductDetailsTypes;
  value: T;
}

/**
 * Info inside productDetails.PLAN_DETAILS
 * or productDetails.ADDITIONAL_DETAILS (after parsing the html)
 **/
export interface MmProductDetails_PlanDetails {
  heading: string;
  description?: string;
  items: string[];
  links?: string[];
}
