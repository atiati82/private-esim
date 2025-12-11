import memoize from 'lodash/memoize';
import { parse as htmlParse } from 'node-html-parser';

import { extractUrlLinks } from '@/lib/html-helpers';
import { getCliLogger, LoggerName } from '@/lib/logging';

import {
  MmProduct,
  MmProductDetail,
  MmProductDetails_PlanDetails,
  MmProductDetailsType,
} from '../mm-products.types';

export function getCleanProductDetail(
  mmProduct: MmProduct,
  detailsType: MmProductDetailsType.PlanTitle,
): string | undefined;
export function getCleanProductDetail(
  mmProduct: MmProduct,
  detailsType:
    | MmProductDetailsType.PlanDetails
    | MmProductDetailsType.PlanDetails2
    | MmProductDetailsType.AdditionalDetails,
): MmProductDetails_PlanDetails | undefined;
export function getCleanProductDetail(
  mmProduct: MmProduct,
  detailsType:
    | MmProductDetailsType.PlanValidity
    | MmProductDetailsType.PlanDataLimit
    | MmProductDetailsType.PlanVoiceLimit,
): number | undefined;
export function getCleanProductDetail(
  mmProduct: MmProduct,
  detailsType: MmProductDetailsType.Tags,
): string[];
export function getCleanProductDetail(
  mmProduct: MmProduct,
  detailsType: MmProductDetailsType.FiveG | MmProductDetailsType.UsageTracking,
): boolean | undefined;
export function getCleanProductDetail(
  mmProduct: MmProduct,
  detailsType: MmProductDetailsType,
): unknown | undefined {
  const productDetails = getCleanProductDetailsEntries(mmProduct);

  const foundProductDetail = productDetails.find(({ name }) => {
    // Fix that inconsistency with MmProductDetailsType.PlanDetails and MmProductDetailsType.PlanDetails2
    // by trimming the requested detailsType (as it's already cleaned and present under the valid key)
    return name === detailsType.trim();
  });

  return foundProductDetail ? foundProductDetail.value : undefined;
}

export const getCleanProductDetailsEntries = memoize(
  _getCleanProductDetailsEntries,
  (mmProduct) => mmProduct,
);

function _getCleanProductDetailsEntries(mmProduct: MmProduct): MmProductDetail[] {
  const logger = getCliLogger(LoggerName.MobiMatterProductsImport);

  const productDetails: Array<MmProductDetail | undefined> = mmProduct.productDetails.map(
    ({ name, value }) => {
      /* eslint-disable no-case-declarations */
      switch (name) {
        // Standard text values
        case MmProductDetailsType.PlanTitle:
          return { name, value };

        // Number values
        case MmProductDetailsType.PlanDataLimit:
        case MmProductDetailsType.PlanVoiceLimit:
        case MmProductDetailsType.CheckUsage:
          return { name, value: Number(value) };

        case MmProductDetailsType.PlanValidity:
          return { name, value: Number(value) / 24 };

        case MmProductDetailsType.FiveG:
          return { name, value: Boolean(value) };

        case MmProductDetailsType.PlanDetails:
        case MmProductDetailsType.PlanDetails2:
          let planDetails: MmProductDetails_PlanDetails | undefined = undefined;
          try {
            planDetails = JSON.parse(value as string);
            planDetails!.items = (planDetails?.items ?? []).map((str) => str.trim());
            if (planDetails?.description === null) {
              delete planDetails.description;
            }
            const { heading, description, items, ...otherData } =
              planDetails as MmProductDetails_PlanDetails;

            if (Object.keys(otherData).length) {
              logger.warn(
                `Product [${mmProduct.productId}]: Unrecognized keys inside productDetails '${name}': ${Object.keys(otherData)}`,
              );
            }
          } catch (e) {
            logger.warn(
              `Product [${mmProduct.productId}]: Error ${(e as Error).name} while parsing productDetails '${name}' value: ${value}`,
            );
          }
          // Fix that inconsistency with MmProductDetailsType.PlanDetails and MmProductDetailsType.PlanDetails2
          // and always return clean data under MmProductDetailsType.PlanDetails
          return { name: MmProductDetailsType.PlanDetails, value: planDetails };

        case MmProductDetailsType.AdditionalDetails:
          try {
            return { name, value: getCleanAdditionalProductDetail(value as string) };
          } catch (e) {
            logger.warn(
              `Product [${mmProduct.productId}]: Error ${(e as Error).name} while parsing productDetails '${name}' value: ${value}`,
            );
            return;
          }

        case MmProductDetailsType.Tags:
          const tags: string[] = [];
          try {
            const data = JSON.parse(value as string) as Array<{ item: string }>;
            data.forEach((entry) => tags.push(entry.item));
          } catch (e) {
            logger.warn(
              `Product [${mmProduct.productId}]: Error ${(e as Error).name} while parsing productDetails '${name}' value: ${value}`,
            );
          }
          return { name: MmProductDetailsType.Tags, value: tags };

        case MmProductDetailsType.UsageTracking:
          if (value === 'Realtime, in-app') {
            return { name: MmProductDetailsType.UsageTracking, value: true };
          } else if (value === 'Dial short code') {
            return { name: MmProductDetailsType.UsageTracking, value: false };
          }
          logger.warn(`WARNING: Product [${mmProduct.productId}] has`);
          logger.warn(`\tunknown product detail *${name}* with value *${value}*\n`);
          return { name, value: false };

        // MM new fields (added on 2024'Aug):
        case MmProductDetailsType.HasData: // We have info about data limit in PLAN_DATA_LIMIT, no?
        case MmProductDetailsType.HasVoice: // TODO: New field from MM: probably better to read from this, that from descriptions (which we do now)
        case MmProductDetailsType.HasSms: // New field from MM: ATM, it's always 0...
        case MmProductDetailsType.HasTopUps: // New field from MM: we have this info elsewhere, in productCategory
        case MmProductDetailsType.FiveGLabel: // Not needed, we have that in FiveG field...
        case MmProductDetailsType.ActivationPolicy: // TODO: read from this tag, instead of from text description
        case MmProductDetailsType.HotSpot: // TODO: read from this tag, instead of from text description
        case MmProductDetailsType.SpeedLimit: // TODO: read from this tag, instead of from text description
        case MmProductDetailsType.SpeedExtraInfo: // TODO: read from this tag, instead of from text description
          return;

        // Not used, not needed at all
        case MmProductDetailsType.Rank:
        case MmProductDetailsType.PlanDataUnit:
        case MmProductDetailsType.ExternallyShown:
          return;

        default:
          logger.warn(`WARNING: Product [${mmProduct.productId}] has`);
          logger.warn(`\tunknown product detail *${name}* with value *${value}*\n`);
          return { name, value };
      }
    },
  );

  return productDetails.filter(Boolean) as MmProductDetail[];
}

/**
 * The productDetails.AdditionalDetails contains very gibberish HTML
 * with info about activation, eKYC etc.
 * We try to clean it here, find links etc.
 */
export function getCleanAdditionalProductDetail(
  htmlContent: string | null,
): MmProductDetails_PlanDetails | undefined {
  const emojiRegex = /[\u{1F1E6}-\u{1F1FF}]{2}|[\u{1F600}-\u{1F64F}]/gu;

  // Sometimes content is prefixed with country flag or other emoji - get rid of that
  const html = htmlParse(htmlContent ?? '');
  const _textContent = html.structuredText;
  html.remove(); // no longer needed, decreases memory usage by the importer script
  const textContent = _textContent.replace(emojiRegex, '').trim();

  let structuredText = textContent.split('\n');
  structuredText = structuredText.map((str) => str.trim());
  return {
    heading: structuredText.shift() ?? '',
    items: structuredText,
    links: extractUrlLinks(textContent),
  };
}
