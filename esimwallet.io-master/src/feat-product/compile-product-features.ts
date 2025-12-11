import React from 'react';
import {
  BookOpenCheckIcon,
  CctvIcon,
  CircleOffIcon,
  CpuIcon,
  EarIcon,
  FilePlus2Icon,
  GaugeIcon,
  GemIcon,
  LucideProps,
  PhoneIncomingIcon,
  PhoneOffIcon,
  PlugIcon,
  RouterIcon,
  ShieldAlertIcon,
  ShieldPlusIcon,
  SmartphoneIcon,
} from 'lucide-react';

import { Destination } from '@/data/destination';
import {
  EsimPlanKyC,
  EsimProduct,
  EsimProductAttribute,
  EsimProductType,
  getProductAttribute,
  getProductAttributes,
  isDataPlanType,
  isVoicePlanType,
} from '@/data/esim-product';
import { formatPlanAllowanceNum } from '@/lib/esim-wallet';
import { getItemByKeyVal, interpolate } from '@/lib/utils';
import { EsimProductsContent } from '@/payload/app-types';
import { EsimProductsContentId } from '@/payload/collections/esim-products/esim-products-content.seed';

export interface ProductFeature {
  // id: ProductFeatureId,
  displayAs?: 'p' | 'li'; // default: p
  icon: React.ElementType<LucideProps>;
  name: string;
  description?: string[];
  descriptionHtml?: string;
}

interface CompiledProductContext {
  /**
   * See {@link esimProductsSeedContent} for a sample content (will be merged with content from CMS)
   */
  productsContent: EsimProductsContent;
  destinations: Destination[];
}

export interface CompiledProductFeatures {
  connectsToText?: string;
  aboutText: string[];

  specsTab: {
    planInfo: ProductFeature;
    eSimInfo: ProductFeature;
    speedInfo: ProductFeature;
    phoneInfo: ProductFeature;
    voiceInfo?: ProductFeature;
    limits: ProductFeature;
    kycOverview?: ProductFeature;
    hotspot: ProductFeature;
    extras?: ProductFeature;
    activationInfo: ProductFeature;
  };
  kycTab?: Record<string, ProductFeature>;
  aboutTab: {
    warnings: ProductFeature;
    technical: ProductFeature;
  };
}

/**
 * Prepare a complete list of product features to display on product page
 */
export function compileProductFeatures(
  product: EsimProduct,
  ctx: CompiledProductContext,
): CompiledProductFeatures {
  return {
    specsTab: {
      planInfo: _compileProductFeatures_planInfo(product),
      eSimInfo: _compileProductFeatures_eSimInfo(product, ctx),
      speedInfo: _compileProductFeatures_speedInfo(product, ctx),
      phoneInfo: _compileProductFeatures_phoneInfo(product, ctx),
      voiceInfo: _compileProductFeatures_voiceInfo(product),
      limits: _compileProductFeatures_limitsInfo(product, ctx),
      kycOverview: _compileProductFeatures_kycOverview(product, ctx),
      hotspot: _compileProductFeatures_hotspotInfo(product, ctx),
      extras: _compileProductFeatures_extrasInfo(product),

      activationInfo: {
        icon: PlugIcon,
        name: 'Activation',
        description: _contentFromProductAttributes(product, EsimProductAttribute.ActivationPolicy),
      },
    },
    kycTab: _compileProductFeatures_KycTab(product, ctx),
    aboutTab: {
      warnings: {
        icon: ShieldAlertIcon,
        name: 'Warnings',
        description: _contentFromProductAttributes(product, EsimProductAttribute.Warning),
      },
      technical: {
        icon: ShieldPlusIcon,
        name: 'Other information',
        description: _contentFromProductAttributes(product, EsimProductAttribute.Technical),
      },
    },

    connectsToText: _compileProductFeatures_connectsToText(product),
    aboutText:
      ctx.productsContent.aboutText?.items?.map((item) => _contentFromCms(item.content)) ?? [],
  };
}

export function compileFamilyProductsFeatures(
  product: EsimProduct,
  ctx: { productsContent: EsimProductsContent },
): ProductFeature[] {
  const productFeatures = compileProductFeatures(product, {
    productsContent: ctx.productsContent,
    destinations: [],
  });
  return [
    productFeatures.specsTab.eSimInfo,
    productFeatures.specsTab.speedInfo,
    productFeatures.specsTab.phoneInfo,
    productFeatures.specsTab.hotspot,
    productFeatures.specsTab.limits,
    productFeatures.specsTab.kycOverview,
  ].filter(
    (feat) => feat && (feat.descriptionHtml || feat.description?.length),
  ) as ProductFeature[];
}

function _compileProductFeatures_connectsToText(product: EsimProduct): string | undefined {
  const contentFromAttribs = _contentFromProductAttributes(
    product,
    EsimProductAttribute.Network,
  ).filter(Boolean);
  return contentFromAttribs.length ? `Connects to: ${contentFromAttribs.join(', ')}.` : undefined;
}

function _compileProductFeatures_eSimInfo(
  product: EsimProduct,
  { productsContent }: CompiledProductContext,
): ProductFeature {
  return {
    icon: CpuIcon,
    name: _contentCms(productsContent, EsimProductsContentId.ProductTypeTitle),
    descriptionHtml: interpolate(
      _contentCms(
        productsContent,
        product.productType === EsimProductType.eSIM
          ? EsimProductsContentId.ProductTypeEsim
          : EsimProductsContentId.ProductTypeTopUp,
      ),
      { PROVIDER_NAME: product.provider.name },
    ),
  };
}

function _compileProductFeatures_planInfo(product: EsimProduct): ProductFeature {
  const planInfoDescription: string = [
    `${product.planTypeLabel} for ${product.planValidity} days<br />`,
    isVoicePlanType(product)
      ? `${formatPlanAllowanceNum(product.planVoiceAllowance)} voice minutes<br />`
      : '',
    isDataPlanType(product)
      ? `${formatPlanAllowanceNum(product.planDataAllowance)} GB of data`
      : '',
  ].join('');

  return {
    icon: SmartphoneIcon,
    name: 'Plan Type',
    descriptionHtml: planInfoDescription,
  };
}

function _compileProductFeatures_phoneInfo(
  product: EsimProduct,
  { productsContent }: CompiledProductContext,
): ProductFeature {
  const phoneNumber = _contentFromProductAttributes(
    product,
    EsimProductAttribute.VoicePhoneNumber,
  ).join('');
  const phoneInfoDescription = phoneNumber
    ? interpolate(_contentCms(productsContent, EsimProductsContentId.PhoneYes), {
        PHONE_NUM: phoneNumber,
      })
    : _contentCms(productsContent, EsimProductsContentId.PhoneNo);

  return {
    icon: phoneNumber ? PhoneIncomingIcon : PhoneOffIcon,
    name: 'Phone/SMS Info',
    descriptionHtml: phoneInfoDescription,
  };
}

function _compileProductFeatures_voiceInfo(product: EsimProduct): ProductFeature | undefined {
  const voiceInfoDescription = _contentFromProductAttributes(
    product,
    EsimProductAttribute.VoiceInfo,
  );

  return voiceInfoDescription.length
    ? {
        icon: EarIcon,
        name: 'Extra Voice Info',
        description: voiceInfoDescription,
      }
    : undefined;
}

function _compileProductFeatures_speedInfo(
  product: EsimProduct,
  { productsContent }: CompiledProductContext,
): ProductFeature {
  return {
    icon: GaugeIcon,
    name: 'Max Speed',
    descriptionHtml: _contentCms(productsContent, `speed_${product.planMaxSpeed}`),
  };
}

function _compileProductFeatures_limitsInfo(
  product: EsimProduct,
  { productsContent }: CompiledProductContext,
): ProductFeature {
  const limitsAttribs = _contentFromProductAttributes(product, EsimProductAttribute.Limits, false);
  const noLimitsAttrib = getProductAttribute(
    product.productAttributes,
    EsimProductAttribute.NoLimits,
  );

  const description: string[] = [
    noLimitsAttrib ? _contentCms(productsContent, EsimProductsContentId.LimitsNoLimits) : '',
    ...limitsAttribs,
  ].filter(Boolean);
  if (!description.length) {
    description.push(_contentCms(productsContent, EsimProductsContentId.LimitsUnknown));
  }

  return {
    icon: CircleOffIcon,
    name: 'Limits',
    descriptionHtml: description.join(' '),
  };
}

function _compileProductFeatures_hotspotInfo(
  product: EsimProduct,
  { productsContent }: CompiledProductContext,
): ProductFeature {
  const attrib = getProductAttribute(product.productAttributes, EsimProductAttribute.FeatHotspot);
  return {
    icon: RouterIcon,
    name: 'Tethering / Hotspot',
    descriptionHtml: _contentCms(
      productsContent,
      attrib ? EsimProductsContentId.HotspotYes : EsimProductsContentId.HotspotNo,
    ),
  };
}

function _compileProductFeatures_extrasInfo(product: EsimProduct): ProductFeature | undefined {
  const contentFromAttribs = _contentFromProductAttributes(
    product,
    EsimProductAttribute.Extras,
  ).filter(Boolean);
  return contentFromAttribs.length
    ? { icon: GemIcon, name: 'Extras', description: contentFromAttribs }
    : undefined;
}

function _hasKycInfo(product: EsimProduct): boolean {
  return getProductAttributes(product.productAttributes, EsimProductAttribute.KYC).length > 0;
}

function _compileProductFeatures_kycOverview(
  product: EsimProduct,
  { productsContent }: CompiledProductContext,
): ProductFeature | undefined {
  const kycDescr =
    product.planKycPolicy === EsimPlanKyC.Required
      ? _contentCms(productsContent, EsimProductsContentId.KycRequired)
      : _contentCms(
          productsContent,
          _hasKycInfo(product)
            ? EsimProductsContentId.KycNoWithExceptions
            : EsimProductsContentId.KycNo,
        );

  return (
    (product.productType === EsimProductType.eSIM && {
      icon: CctvIcon,
      name: _contentCms(productsContent, EsimProductsContentId.KycTitle),
      descriptionHtml: kycDescr,
    }) ||
    undefined
  );
}

function _compileProductFeatures_KycTab(
  product: EsimProduct,
  { productsContent, destinations }: CompiledProductContext,
): Record<string, ProductFeature> | undefined {
  let kycTab: Record<string, ProductFeature>;

  if (product.productType !== EsimProductType.eSIM) {
    return undefined;
  }

  if (product.planKycPolicy === EsimPlanKyC.Required || _hasKycInfo(product)) {
    kycTab = {};

    kycTab.kycExplanation = {
      icon: CctvIcon,
      name: _contentCms(productsContent, EsimProductsContentId.KycTitle),
      descriptionHtml: _contentCms(productsContent, EsimProductsContentId.KycExplanation),
    };

    const kycProductAttrib = getProductAttribute(
      product.productAttributes,
      EsimProductAttribute.KYC,
    );
    if (kycProductAttrib) {
      kycTab.kycContent = {
        icon: BookOpenCheckIcon,
        name: _contentCms(productsContent, EsimProductsContentId.KycTitle2),
        description: [kycProductAttrib.value],
      };
    }

    // Get all KYC requirements for individual countries
    // They kycTag is in the form of `kyc:XX` where XX is 2-letter country code (e.g. `kyc:tw` for Taiwan destination),
    const kycForCountries = getProductAttributes(
      product.productAttributes,
      EsimProductAttribute.KYC + ':',
    );

    kycForCountries.forEach((kycItemForDestination) => {
      const destinationId = kycItemForDestination.name.split(':')[1] ?? '';
      const destination = destinationId
        ? destinations.find((d) => d.id === destinationId || d.slug === destinationId)
        : undefined;
      const destinationName: string =
        (destination && destination.name) || destinationId.toUpperCase();

      kycTab[kycItemForDestination.name] = {
        icon: FilePlus2Icon,
        name: `KYC for ${destinationName}`,
        // Note: the content inside product attributes is empty...
        // We should have detailed KYC info provided from CMS
        descriptionHtml:
          _contentCms(productsContent, kycItemForDestination.name) ||
          _contentCms(productsContent, EsimProductsContentId.KycMissing),
      };
    });
  }

  return kycTab!;
}

/**
 * Get content from CMS' global EsimProductsContent
 */
function _contentCms(
  productsContent: EsimProductsContent,
  contentId: EsimProductsContentId | string,
): string {
  const contentItem = getItemByKeyVal(productsContent.dynamicContent!.items, 'id', contentId);
  return _contentFromCms(contentItem?.content, contentId);
}

function _contentFromCms(content: string | null | undefined, defaultValue = ''): string {
  return (content && content.trim().replaceAll('\\n', '<br />')) || defaultValue;
}

/**
 * Get content from product data, from its productAttributes
 */
function _contentFromProductAttributes(
  product: EsimProduct,
  attr: EsimProductAttribute | string,
  strictMatch = true,
): string[] {
  return getProductAttributes(product.productAttributes, attr, !strictMatch).map((pa) => pa.value);
}
