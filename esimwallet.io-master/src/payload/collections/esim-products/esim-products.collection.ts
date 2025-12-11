import type { CollectionConfig, FieldBase, FieldHook } from 'payload';

import {
  esimPlanKycOptions,
  esimPlanMaxSpeedOptions,
  esimPlanTypeOptions,
  esimProductTypeOptions,
  isDataPlanType,
  isVoicePlanType,
  productSupplierOptions,
} from '@/data/esim-product';
import { calculateProfit, formatCurrencyVal } from '@/lib/esim-wallet';
import { urlForProduct } from '@/lib/urls';
import { DestinationDto, EsimProductDto, EsimProductPricing } from '@/payload/app-types';
import {
  DestinationsCollectionId,
  EsimProductsCollectionId,
  EsimProvidersCollectionId,
  RegionsCollectionId,
} from '@/payload/collections';
import { fieldAccessAdminsOnly } from '@/payload/collections/access-helpers';
import { virtualFieldBeforeChange } from '@/payload/collections/hooks/virtual-field-before-change';

const accessReadOnly: FieldBase['access'] = {
  update: () => false,
};

const calcPricePerGb: FieldHook<EsimProductDto> = ({ data }) => {
  if (data && isDataPlanType(data as EsimProductDto) && data.planDataAllowance) {
    return parseFloat(formatCurrencyVal(data.productPricing!.listPrice / data.planDataAllowance));
  }
  return 0;
};

const calcPricePerMin: FieldHook<EsimProductDto> = ({ data }) => {
  if (data && isVoicePlanType(data as EsimProductDto) && data.planVoiceAllowance) {
    return parseFloat(formatCurrencyVal(data.productPricing!.listPrice / data.planVoiceAllowance));
  }
  return 0;
};

const formatProfit: FieldHook<EsimProductDto> = ({ data: product }) => {
  if (!product) {
    return;
  }
  const pricing = product.productPricing ?? ({} as EsimProductPricing);
  const profit = calculateProfit(pricing.listPrice, pricing.supplierPrice) * 100;
  return parseFloat(profit.toFixed(1));
};

export const EsimProductsCollection: CollectionConfig = {
  slug: EsimProductsCollectionId,
  typescript: { interface: 'EsimProductDto' },
  labels: { singular: 'eSIM Product', plural: 'eSIM Products' },
  admin: {
    group: 'Products',
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'productType',
      'planType',
      'planValidity',
      'planDataAllowance',
      'updatedAt',
    ],
    listSearchableFields: ['id', 'name', 'provider', 'productFamily', 'supplierProductId'],
    pagination: { limits: [25, 50, 100, 250, 1000, 2500], defaultLimit: 100 },
    preview: (doc) => {
      const product = doc as unknown as EsimProductDto;
      const location = product.destinations![0] as DestinationDto;
      return urlForProduct(location.slug, product.id);
    },
  },
  defaultSort: '-updatedAt',

  fields: [
    {
      name: 'id',
      type: 'text',
      index: true,
      label: 'Product ID',
      admin: { position: 'sidebar', hidden: true },
      access: { ...accessReadOnly },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Product Name',
            },

            //
            // PRICING group
            //
            {
              type: 'group',
              name: 'productPricing',
              label: 'Product Pricing',
              interfaceName: 'EsimProductPricing',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'listPrice',
                      type: 'number',
                      required: true,
                      admin: { step: 0.01 },
                    },
                    {
                      name: 'supplierPrice',
                      type: 'number',
                      required: true,
                      access: { ...accessReadOnly },
                    },
                    {
                      name: 'profit',
                      type: 'number',
                      label: 'Profit %',
                      admin: { readOnly: true },
                      access: {
                        read: fieldAccessAdminsOnly,
                      },
                      hooks: {
                        afterRead: [formatProfit],
                        beforeChange: [virtualFieldBeforeChange],
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'pricePerGb',
                      label: 'Price / GB',
                      type: 'number',
                      hooks: {
                        afterRead: [calcPricePerGb],
                        beforeChange: [({ siblingData }) => (siblingData.pricePerGb = undefined)],
                      },
                      access: { create: () => false, update: () => false },
                    },
                    {
                      name: 'pricePerMin',
                      label: 'Price / min',
                      type: 'number',
                      hooks: {
                        afterRead: [calcPricePerMin],
                        beforeChange: [({ siblingData }) => (siblingData.pricePerMin = undefined)],
                      },
                      access: { create: () => false, update: () => false },
                    },
                  ],
                },
                {
                  name: 'competitorPrices',
                  type: 'json',
                  required: true,
                  defaultValue: {},
                  // For now disabled. In the future we'll have here some more sophisticated UI widget
                  // showing / comparing prices from different competitors, showing our profit margin etc.
                  admin: { disabled: true },
                  access: { ...accessReadOnly },
                },
              ],
            },

            //
            // PLAN DETAILS group
            //
            {
              type: 'collapsible',
              label: 'Plan Details',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'planType',
                      type: 'radio',
                      required: true,
                      label: 'Plan Type',
                      options: esimPlanTypeOptions,
                      access: { ...accessReadOnly },
                    },
                    {
                      name: 'planKycPolicy',
                      type: 'radio',
                      required: true,
                      label: 'KYC',
                      options: esimPlanKycOptions,
                      admin: { width: '30%' },
                      access: { ...accessReadOnly },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'planValidity',
                      type: 'number',
                      required: true,
                      index: true,
                      label: 'Plan Validity',
                      access: { ...accessReadOnly },
                    },
                    {
                      name: 'planDataAllowance',
                      type: 'number',
                      required: true,
                      label: 'Data Limit',
                      access: { ...accessReadOnly },
                    },
                    {
                      name: 'planVoiceAllowance',
                      type: 'number',
                      required: true,
                      label: 'Voice Limit',
                      access: { ...accessReadOnly },
                    },
                  ],
                },
                {
                  name: 'planMaxSpeed',
                  type: 'select',
                  required: true,
                  label: 'Plan Max Speed',
                  options: esimPlanMaxSpeedOptions,
                  admin: { width: '25%' },
                  access: { ...accessReadOnly },
                },
              ],
            }, // end of Plan Details group

            //
            // REGIONS/DESTINATIONS group
            //
            {
              type: 'collapsible',
              label: 'Product Availability',
              admin: { position: 'sidebar' },
              fields: [
                {
                  name: 'destinations',
                  type: 'relationship',
                  relationTo: DestinationsCollectionId,
                  hasMany: true,
                  index: true,
                  defaultValue: [],
                  access: { ...accessReadOnly },
                },
                {
                  name: 'regions',
                  type: 'relationship',
                  relationTo: RegionsCollectionId,
                  hasMany: true,
                  index: true,
                  defaultValue: [],
                  access: { ...accessReadOnly },
                },
              ],
            }, // end of Region/Destinations

            {
              type: 'array',
              name: 'productAttributes',
              defaultValue: [],
              index: true,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      index: true,
                      admin: { placeholder: 'attribute:key-name' },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      admin: { width: '60%' },
                    },
                  ],
                },
              ],
              admin: {
                initCollapsed: false,
                className: 'field-type--array-condensed',
              },
              access: { ...accessReadOnly },
            },
          ],
        },

        //
        // TAB: SUPPLIER DATA, all data from supplier (e.g. MobiMatter)
        //
        {
          label: 'Supplier Info',
          fields: [
            {
              name: 'supplier',
              type: 'select',
              required: true,
              enumName: 'ProductSuppliers',
              options: productSupplierOptions,
              access: { ...accessReadOnly },
            },
            {
              name: 'supplierProductId',
              type: 'text',
              required: true,
              index: true,
              unique: true,
              access: { ...accessReadOnly },
            },
            {
              name: 'supplierProductCreationDate',
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayAndTime' } },
              access: { ...accessReadOnly },
            },
            {
              name: 'supplierProductLastUpdate',
              type: 'date',
              required: true,
              index: true,
              admin: { date: { pickerAppearance: 'dayAndTime' } },
              access: { ...accessReadOnly },
            },
            {
              name: 'supplierImportData',
              type: 'json',
              required: true,
              label: 'Product JSON data from Supplier',
              admin: { readOnly: true },
              access: { ...accessReadOnly },
            },
          ],
        }, // end of tab: Supplier Data
      ], // end of main tabs
    },

    //
    // SIDEBAR, OUTSIDE OF TABS
    //
    {
      name: 'productType',
      type: 'radio',
      required: true,
      index: true,
      label: 'Product Type',
      options: esimProductTypeOptions,
      admin: { position: 'sidebar' },
      access: { ...accessReadOnly },
    },
    {
      name: 'provider',
      type: 'relationship',
      required: true,
      index: true,
      relationTo: EsimProvidersCollectionId,
      admin: { position: 'sidebar' },
      access: { ...accessReadOnly },
    },
    {
      name: 'productFamily',
      type: 'text',
      index: true,
      required: true,
      admin: { position: 'sidebar' },
      access: { ...accessReadOnly },
    },
    {
      name: 'productFamilyTopUpsCount',
      label: 'Available Top-Ups in the family',
      type: 'number',
      admin: { position: 'sidebar' },
      access: { ...accessReadOnly },
    },
    {
      name: 'usageTracking',
      type: 'checkbox',
      label: 'Usage Tracking possible',
      admin: { position: 'sidebar' },
      access: { ...accessReadOnly },
    },
    {
      type: 'collapsible',
      label: 'AI CMS (BigMind)',
      admin: { initCollapsed: true, position: 'sidebar' },
      fields: [
        {
          name: 'aiGeneratedHtml',
          type: 'textarea',
          admin: { description: 'AI-generated HTML content for product page' },
        },
        {
          name: 'aiVisualConfig',
          type: 'json',
          admin: { description: 'Motion and visual settings (JSON)' },
        },
        {
          name: 'aiImagePrompts',
          type: 'json',
          admin: { description: 'Image generation prompts (JSON)' },
        },
      ],
    },
  ],
  versions: {
    drafts: false,
  },
};
