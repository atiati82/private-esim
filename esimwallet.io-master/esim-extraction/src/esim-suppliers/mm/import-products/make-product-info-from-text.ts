import upperFirst from 'lodash/upperFirst';

import {
  EsimPlanKyC,
  EsimPlanType,
  EsimProductAttribute,
  EsimProductAttributeItem,
  makeActivationPolicyProductAttribute,
  makeNetworkProductAttribute,
  makeProductAttribute,
} from '@/data/esim-product';
import { isTestingEnv } from '@/env-helpers';

import { MmProduct, MmProductDetailsType } from '../mm-products.types';
import { getCleanProductDetail } from './get-clean-product-detail';

export interface ProductDataFromText {
  kycPolicy?: EsimPlanKyC;

  /**
   * Info in the text might influence plan type - if we detected something,
   * here we indicate what the plan should be, according to the new info
   */
  suggestedPlanType?: EsimPlanType;
  /**
   * If voice info found in the text, this will contain num of minutes in the package
   */
  planVoiceAllowance?: number;

  productAttributes: EsimProductAttributeItem[];
}

interface Extracted {
  productData: ProductDataFromText;
  allItemsToProcess: string[];
  itemsProcessed: string[];
  itemsUnprocessed: string[];
}

const ignoredTextPatterns: RegExp[] = [
  //
  // Heading / description patterns
  //
  /Instant delivery.+?No Contract/i,
  /ADD[\s-]ON (PACKAGE|PACAKGE) FOR/i,
  /TOP QUALITY.+?PREPAID/i,
  /BEST DEAL.+?LOCAL/i,
  /eSIM can be downloaded only once on a single device.+?non-recoverable if deleted/i,
  /Top[ -]quality .+?eSIM/i,
  /PACKAGE VALIDITY STARTS UPON PURCHASE/, // this is repeated in text items, so in heading/description can be ignored
  /KYC is mandatory to enable usage in (Hong Kong|Taiwan)/i, // this one has repeated info in AdditionalDetails
  /Registration not required/,
  //
  // Text item patterns
  //
  // Make this one very exact - there are some other like this, and they might contain info about activation etc.
  /Simply scan the QR code to download and use the eSIM\./i,
  /Usable only with eSIM compatible phones/i,
  /does not come with a phone number/i,
  /No auto-renewals, no contracts/i,
  /5G availability depends on network coverage/i,
  /automatically connect to.+? local mobile network/i,
  /connects automatically to.+? local mobile network/i,
  /can be added .+? add-on. Any existing allowances and packages .+? remain unchanged/i,
  /prepaid package.+?rechargeable.+?can be topped up with additional packages/,
  /Includes.+?data.+?unlimited incoming calls/i,
];

// Our text descriptions, instead original/detected ones
const VoiceRechargeTitle = 'This is an add-on to add Voice/SMS to your eSIM package.';
const PolicyCanBeDownloadedOnlyOnce =
  'Can be downloaded only once. Non-replaceable and non-recoverable if lost/deleted.';

/**
 * Main function extracting info from product details and additional (textual) fields
 */
export function makeProductInfoFromText(mmData: MmProduct): Extracted {
  const res: Extracted = {
    productData: { productAttributes: [] },
    allItemsToProcess: [],
    itemsProcessed: [],
    itemsUnprocessed: [],
  };

  res.allItemsToProcess = getAllTextItemsToProcess(mmData);
  res.allItemsToProcess.forEach((textItem) => {
    _processWarnings(res, textItem);
    _processTechnicalInfo(res, textItem);
    _processFeatures(res, textItem);
    _processLimits_NoLimits(res, textItem);
    _processLimits(res, textItem);
    _processActivationPolicy(res, textItem, mmData);
    _processValidityPolicy(res, textItem);
    _processCellNetworks(res, textItem);
    _processPhoneNumber(res, textItem);
    _processExtras(res, textItem);
    _processKyc_HkTw(res, textItem, mmData);
    _processKyc_Other(res, textItem);
    _processDataVoiceInfo(res, textItem);
    _processVoiceRecharge(res, textItem, mmData);
  });
  res.productData.productAttributes = getSortedProductAttributes(res.productData.productAttributes);

  // Extract all unprocessed items, so they're easy to spot / alert about
  res.itemsUnprocessed = res.allItemsToProcess.filter(
    (textVal) => !res.itemsProcessed.includes(textVal),
  );

  if (res.itemsUnprocessed.length && !isTestingEnv) {
    const { productAttributes, ...preparedOtherInfo } = res.productData;
    console.warn('EXTRACT RESULTS: UNPROCESSED ITEMS FOUND for', `[${mmData.productId}] product`);
    // console.warn({ productSoFar: product, planDetails, additionalDetails });
    console.warn({
      preparedProductAttributes: productAttributes,
      preparedOtherInfo,
      itemsUnprocessed: res.itemsUnprocessed,
    });
  }
  return res;
}

function isValidTextPattern(textItem: string | null | undefined): textItem is string {
  if (!textItem || !textItem.trim().length) {
    return false;
  }
  return !ignoredTextPatterns.some((re) => re.test(textItem));
}

/**
 * Prepares all textual items, valid for processing
 */
function getAllTextItemsToProcess(mmData: MmProduct): string[] {
  const planDetails = getCleanProductDetail(mmData, MmProductDetailsType.PlanDetails);
  const additionalDetails = getCleanProductDetail(mmData, MmProductDetailsType.AdditionalDetails);
  const allItemsToProcess = [
    planDetails?.heading,
    planDetails?.description,
    ...(planDetails?.items ?? []),
    additionalDetails?.heading,
    ...(additionalDetails?.items ?? []),
  ].filter((str) => isValidTextPattern(str));
  return allItemsToProcess as string[];
}

function ensureStringEndsWithDot(str: string): string {
  return str.trim().endsWith('.') ? str : `${str}.`;
}

function getSortedProductAttributes(
  productAttributes: EsimProductAttributeItem[],
): EsimProductAttributeItem[] {
  return productAttributes.sort((a, b) => a.name.localeCompare(b.name));
}

const _processWarning_DoesNotWorkInXRe = /Attention:\s?(.+does not work.+)/i;
const _processWarning_NotCompatibleWithPhonesXRe =
  /((Not compatible|Cannot be used).+?with.+?phones?)/i;
const _processWarning_MayNotHaveCoverageRe =
  /Attention:\s?(.+may not have coverage in other areas of.+)/i;
function _processWarnings(res: Extracted, textItem: string): void {
  const warningMatch =
    textItem.match(_processWarning_DoesNotWorkInXRe) ||
    textItem.match(_processWarning_NotCompatibleWithPhonesXRe) ||
    textItem.match(_processWarning_MayNotHaveCoverageRe);
  if (warningMatch) {
    const attributeDescription = ensureStringEndsWithDot(warningMatch[1].trim());
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.Warning, attributeDescription),
    );
    res.itemsProcessed.push(textItem);
  }
}

/**
 * Technical info, contacts, usage checking etc.
 */
const _processTechnicalInfoRe = /can contact the operator in .+? directly/i;
const _processTechnicalInfoRe2 = 'To check data usage';
function _processTechnicalInfo(res: Extracted, textItem: string): void {
  const techInfoMatch =
    textItem.match(_processTechnicalInfoRe) || textItem.match(_processTechnicalInfoRe2);
  if (techInfoMatch) {
    const attributeDescription = ensureStringEndsWithDot((techInfoMatch.input ?? '').trim());
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.Technical, attributeDescription),
    );
    res.itemsProcessed.push(textItem);
  }
}

const _processMobileHotspotRe = /Mobile hotspot is supported/i;
const _processWidestCoverageRe = 'Widest network coverage in';
function _processFeatures(res: Extracted, textItem: string): void {
  const hotspotMatch = textItem.match(_processMobileHotspotRe);
  if (hotspotMatch) {
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.FeatHotspot, ''),
    );
    res.itemsProcessed.push(textItem);
  }

  const coverageMatch = textItem.match(_processWidestCoverageRe);
  if (coverageMatch) {
    res.productData.productAttributes.push(
      makeProductAttribute(
        EsimProductAttribute.FeatBestCoverage,
        ensureStringEndsWithDot(textItem),
      ),
    );
    res.itemsProcessed.push(textItem);
  }
}

const _processLimits_NoLimitsRe = /no daily limits, no throttling/i;
function _processLimits_NoLimits(res: Extracted, textItem: string): void {
  const noLimitsMatch = textItem.match(_processLimits_NoLimitsRe);
  if (noLimitsMatch) {
    res.productData.productAttributes.push({ name: EsimProductAttribute.NoLimits, value: '' });
    res.itemsProcessed.push(textItem);
  }
}

/**
 * Usage limits, daily limits, other limits
 */
const _processLimitsRe = /Usage limit/i;
const _processLimits_DailyRe = /ATTENTION:\s?(.+?daily.+?allowance.+)/i;
function _processLimits(res: Extracted, textItem: string): void {
  const usageLimits = textItem.match(_processLimitsRe);
  if (usageLimits) {
    res.itemsProcessed.push(textItem);
    res.productData.productAttributes.push({
      name: EsimProductAttribute.Limits,
      value: ensureStringEndsWithDot(textItem),
    });
  }

  const dailyAllowanceMatch = textItem.match(_processLimits_DailyRe);
  if (dailyAllowanceMatch) {
    res.itemsProcessed.push(textItem);
    res.productData.productAttributes.push({
      name: EsimProductAttribute.LimitsDaily,
      value: ensureStringEndsWithDot(dailyAllowanceMatch[1].trim()),
    });
  }
}

/**
 * Activation policy/info
 */
const _processPolicy_CanBeDownloadedOnlyOnceRe =
  /ATTENTION: .+can be downloaded only once.+?non-recoverable if deleted/i;
const _processPolicy_DialToActivate1 = /Dial.+?to activate the data package./i;
const _processPolicy_DialToActivate2 = /Dial.+?to activate the data package once connected/i;
const _processPolicy_WontActivateOnNight = /Will not activate on \w+ night/;
const _processPolicy_WontActivateOnNight2 = /weekly maintenance/;
function _processActivationPolicy(res: Extracted, textItem: string, mmProduct: MmProduct): void {
  const activationMatch =
    textItem.match(_processPolicy_DialToActivate1) ||
    textItem.match(_processPolicy_DialToActivate2);
  if (activationMatch) {
    res.productData.productAttributes.push(
      makeActivationPolicyProductAttribute(ensureStringEndsWithDot(textItem)),
    );
    res.itemsProcessed.push(textItem);
  }

  const caBeDownloadedMatch = textItem.match(_processPolicy_CanBeDownloadedOnlyOnceRe);
  if (caBeDownloadedMatch) {
    res.productData.productAttributes.push(
      makeActivationPolicyProductAttribute(PolicyCanBeDownloadedOnlyOnce),
    );
    res.itemsProcessed.push(textItem);
  }

  if (textItem.match(_processPolicy_WontActivateOnNight)) {
    let message = ensureStringEndsWithDot(textItem);
    const planAdditionalDetails = getCleanProductDetail(
      mmProduct,
      MmProductDetailsType.AdditionalDetails,
    );
    const extraMessage = planAdditionalDetails?.items.find((str) =>
      str.match(_processPolicy_WontActivateOnNight2),
    );
    if (extraMessage) {
      message += '\n' + ensureStringEndsWithDot(extraMessage.trim());
      res.itemsProcessed.push(extraMessage);
    }
    res.productData.productAttributes.push(makeActivationPolicyProductAttribute(message));
    res.itemsProcessed.push(textItem);
  }
}

/**
 * Package validity starts...
 */
const _processValidityPolicyRe = /validity.+?start.+?upon|start using.+?esim.+?after purchase/i;
function _processValidityPolicy(res: Extracted, textItem: string): void {
  const validityMatch = textItem.match(_processValidityPolicyRe);
  if (validityMatch) {
    res.productData.productAttributes.push(
      makeActivationPolicyProductAttribute(ensureStringEndsWithDot(textItem)),
    );
    res.itemsProcessed.push(textItem);
  }
}

const _processPhoneNumberRe = /comes with (.+) (phone|mobile) number/i;
function _processPhoneNumber(res: Extracted, textItem: string): void {
  const phoneNumberMatch = textItem.match(_processPhoneNumberRe);
  if (phoneNumberMatch) {
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.VoicePhoneNumber, phoneNumberMatch[1]),
    );
    res.itemsProcessed.push(textItem);
  }
}

/**
 * Extract cell network name from text item
 */
const _processCellNetworksRe =
  /ATTENTION: (Digicel) eSIMs can be downloaded only once|from local mobile operator (\w+)./i;
const _processCellNetworksRe2 = /(?:^|\W)(Docomo) network/i;
const _processCellNetworks_ConnectsToRe = /Connects? to/;
const _processCellNetworks_ConnectsToRe1 = /connects? to ([-()/\w]+) (network|telecom)/i;
const _processCellNetworks_ConnectsToRe2 = /and ([-()/\w, ]+)network/;
const _processCellNetworks_WorksOnRe = 'Works on';
const _processCellNetworks_WorksOnRe1 = /(?:([-()/\w]+) and )?([-()/\w]+) in /g;
function _processCellNetworks(res: Extracted, textItem: string): void {
  const cellNetworkMatch =
    textItem.match(_processCellNetworksRe) || textItem.match(_processCellNetworksRe2);
  if (cellNetworkMatch) {
    res.productData.productAttributes.push(makeNetworkProductAttribute(cellNetworkMatch[1]));
    res.itemsProcessed.push(textItem);
  }

  if (textItem.match(_processCellNetworks_ConnectsToRe)) {
    const networksMatch1st = textItem.match(_processCellNetworks_ConnectsToRe1);
    if (networksMatch1st) {
      const networks = networksMatch1st[1].split(',').map(makeNetworkProductAttribute);
      res.productData.productAttributes.push(...networks);
    }
    const networksMatch2nd = textItem.match(_processCellNetworks_ConnectsToRe2);
    if (networksMatch2nd) {
      const networks = networksMatch2nd[1].split(',').map(makeNetworkProductAttribute);
      res.productData.productAttributes.push(...networks);
    }
    res.itemsProcessed.push(textItem);
  }

  if (textItem.startsWith(_processCellNetworks_WorksOnRe)) {
    const networksMatch3rd = [...textItem.matchAll(_processCellNetworks_WorksOnRe1)];
    networksMatch3rd.forEach((networkMatch) => {
      if (networkMatch[1]) {
        res.productData.productAttributes.push(makeNetworkProductAttribute(networkMatch[1]));
      }
      if (networkMatch[2]) {
        res.productData.productAttributes.push(makeNetworkProductAttribute(networkMatch[2]));
      }
    });
    res.itemsProcessed.push(textItem);
  }
}

const _processExtrasRe =
  /(Also works in|apps.+?are free to use|NonStop - |Unlimited - |includes.+?data.+?plus.+?data)/i;
function _processExtras(res: Extracted, textItem: string): void {
  const extrasMatch = textItem.match(_processExtrasRe);
  if (extrasMatch) {
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.Extras, textItem),
    );
    res.itemsProcessed.push(textItem);
  }
}

/**
 * Case: voice info, switch to Data&Voice plan type
 */
const _processDataVoiceInfoRe1 = /includes\W([0-9.,]+).+minutes.+?and.+?data/;
const _processDataVoiceInfoRe2 =
  /(?:includes|contains) .+ data.+?\W([0-9.,]+).+(?:voice|local)? minutes/i;
const _processDataVoiceInfoRe3 = /(unlimited calls.+?)$/;
const _processDataVoiceInfo_AdditionalMinutesRe = /(additional.+?minutes|credit).+?included/i;
const _processDataVoiceInfo_phoneNumBySmsRe = /number.+?sent by SMS|SMS with your phone number/i;
function _processDataVoiceInfo(res: Extracted, textItem: string): void {
  const voiceMatch =
    textItem.match(_processDataVoiceInfoRe1) || textItem.match(_processDataVoiceInfoRe2);
  if (voiceMatch) {
    const voiceAllowanceStr = voiceMatch[1].replace('.', '').replace(',', '');
    const voiceAllowance = parseInt(voiceAllowanceStr);
    if (voiceAllowance > 0) {
      res.productData.planVoiceAllowance = voiceAllowance;
    }
    res.productData.suggestedPlanType = EsimPlanType.VoiceAndData;
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.VoiceInfo, textItem),
    );
    res.itemsProcessed.push(textItem);
  }

  const voiceUnlimitedMatch = textItem.match(_processDataVoiceInfoRe3);
  if (voiceUnlimitedMatch) {
    res.productData.planVoiceAllowance = -1;
    res.productData.suggestedPlanType = EsimPlanType.VoiceAndData;
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.VoiceInfo, upperFirst(voiceUnlimitedMatch[1])),
    );
    res.itemsProcessed.push(textItem);
  }

  // 2nd item is sometimes present, with additional (to the above) extras.
  const additionalVoiceMatch = textItem.match(_processDataVoiceInfo_AdditionalMinutesRe);
  if (additionalVoiceMatch) {
    res.productData.suggestedPlanType = EsimPlanType.VoiceAndData;
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.VoiceInfo, textItem),
    );
    res.itemsProcessed.push(textItem);
  }

  const phoneNumViaSmsMatch = textItem.match(_processDataVoiceInfo_phoneNumBySmsRe);
  if (phoneNumViaSmsMatch) {
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.VoiceInfo, ensureStringEndsWithDot(textItem)),
    );
    res.itemsProcessed.push(textItem);
  }
}

/**
 * case: Voice recharge (special top-up with only pay-as-you go (according to a separate price list)
 */
const _processVoiceRechargeRe = /RECHARGE TO MAKE.+VOICE CALLS/i;
function _processVoiceRecharge(res: Extracted, textItem: string, mmProduct: MmProduct): void {
  const rechargeMatch = textItem.match(_processVoiceRechargeRe);
  if (rechargeMatch) {
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.VoiceInfo, VoiceRechargeTitle),
    );

    const planDetails = getCleanProductDetail(mmProduct, MmProductDetailsType.PlanDetails);
    const extraInfo = (planDetails?.items ?? []).filter(isValidTextPattern);
    const extraInfoAttributes = extraInfo.map((info) =>
      makeProductAttribute(EsimProductAttribute.VoiceInfo, info),
    );
    res.productData.productAttributes.push(...extraInfoAttributes);
    res.productData.suggestedPlanType = EsimPlanType.VoiceOnly;
    res.itemsProcessed.push(textItem, ...extraInfo);
  }
}

/**
 * Case: eKYC for HK/TW
 */
const _processKyc_HkOnly_Re = 'To use in Hong Kong';
const _processKyc_HkTw_Re = 'It WILL NOT WORK in Hong Kong and Taiwan';
function _processKyc_HkTw(res: Extracted, textItem: string, mmProduct: MmProduct): void {
  const kycMatch = textItem.match(_processKyc_HkOnly_Re) || textItem.match(_processKyc_HkTw_Re);
  if (kycMatch) {
    // Set KYC=1 but only if the plan is for HK/TW
    // There are cases when they include KYC info, but the plan is for America.
    const destinations: string[] = (mmProduct.countries as string[]) ?? [];
    const isPlanForHkTw = destinations.includes('HK') || destinations.includes('TW');
    const otherDestinations = destinations.filter((d) => d !== 'HK' && d !== 'TW');
    const hasOtherDestinations = !!otherDestinations.length;
    if (isPlanForHkTw && !hasOtherDestinations) {
      res.productData.kycPolicy = EsimPlanKyC.Required;
    }
    res.productData.productAttributes.push(
      makeProductAttribute(`${EsimProductAttribute.KYC}:hk`, ''),
    );
    res.itemsProcessed.push(textItem);

    // AdditionalInfo should contain detailed info for HK and TW
    const planAdditionalDetails = getCleanProductDetail(
      mmProduct,
      MmProductDetailsType.AdditionalDetails,
    );
    if (planAdditionalDetails?.heading.includes(_processKyc_HkOnly_Re)) {
      res.itemsProcessed.push(planAdditionalDetails.heading);
      res.itemsProcessed.push(...planAdditionalDetails!.items);
    }
    if (planAdditionalDetails?.heading.includes(_processKyc_HkTw_Re)) {
      res.productData.productAttributes.push(
        makeProductAttribute(`${EsimProductAttribute.KYC}:tw`, ''),
      );
      res.itemsProcessed.push(planAdditionalDetails.heading);
      res.itemsProcessed.push(...planAdditionalDetails!.items);
    }
  }
}

function _processKyc_Other(res: Extracted, textItem: string): void {
  if (textItem.includes('KYC')) {
    const kycNotRequired = textItem.includes('not required');
    const kycIsRequired =
      !kycNotRequired && (textItem.includes('required') || textItem.includes('mandatory'));

    res.productData.kycPolicy = kycIsRequired ? EsimPlanKyC.Required : EsimPlanKyC.No;
    res.productData.productAttributes.push(
      makeProductAttribute(EsimProductAttribute.KYC, textItem),
    );
    res.itemsProcessed.push(textItem);
  }
}
