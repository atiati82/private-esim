import type { CollectionConfig, FieldBase } from 'payload';

import { productSupplierOptions } from '@/data/esim-product';
import { urlForMyWallet } from '@/lib/urls';
import {
  EsimProductsCollectionId,
  EsimProvidersCollectionId,
  UsersCollectionId,
} from '@/payload/collections';
import {
  accessAdminsOnly,
  accessSupportOnly,
  accessSupportOrLoggedIn,
  accessSupportOrUserOwning,
} from '@/payload/collections/access-helpers';

import {
  esimCardInstallationStatusOptions,
  EsimCardsCollectionId,
  esimCardSmDpStatusOptions,
  initEsimCardInstallationStatus,
  initEsimCardSmDpStatus,
} from './esim-card-symbols';
import { populateOrderedPackages } from './populate-ordered-packages';

const accessReadOnly: FieldBase['access'] = { update: () => false };

/**
 * {@link EsimCardDto} collection
 */
export const EsimCardsCollection: CollectionConfig = {
  slug: EsimCardsCollectionId,
  typescript: { interface: 'EsimCardDto' },
  access: {
    create: accessSupportOrLoggedIn,
    delete: accessAdminsOnly,
    read: accessSupportOrUserOwning,
    update: accessSupportOnly,
  },
  labels: { singular: 'eSIM Card', plural: 'eSIM Cards' },
  admin: {
    group: 'eSIMwallet',
    defaultColumns: ['id', 'user', 'provider', 'providerStatus', 'lastPackageBuyDate'],
    listSearchableFields: ['id'],
    preview: (doc) => urlForMyWallet(doc.id as string),
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      admin: { hidden: true, position: 'sidebar' },
    },
    {
      name: 'statusSmdp',
      type: 'select',
      options: esimCardSmDpStatusOptions,
      required: true,
      defaultValue: initEsimCardSmDpStatus,
      label: 'eSIM Status',
      admin: {
        description: 'eSIM card status, in SM-DP+ server.',
      },
    },

    {
      type: 'array',
      name: 'orderedPackages',
      required: true,
      defaultValue: [],
      admin: {
        isSortable: false,
        initCollapsed: true,
        components: {
          RowLabel:
            '@/esim-core/esim-cards/collection/field-order-item-row-label#FieldOrderItemRowLabel',
        },
      },
      hooks: {
        beforeChange: [populateOrderedPackages],
      },
      fields: [
        {
          // Add and populate few extra fields, to make it available to FieldOrderItemRowLabel component
          // (there seem to be no other way to access that data easily in the client cmp there)
          type: 'row',
          fields: [
            {
              name: 'orderItem',
              type: 'relationship',
              relationTo: 'orders',
              required: true,
              index: true,
            },
            {
              name: 'product',
              type: 'relationship',
              relationTo: EsimProductsCollectionId,
              index: true,
              access: { ...accessReadOnly },
            },
            {
              name: 'productName',
              type: 'text',
              admin: { hidden: true },
            },
            {
              name: 'productType',
              type: 'text',
              admin: { hidden: true },
            },
            {
              name: 'createdAt',
              type: 'text',
              admin: { hidden: true },
            },
          ],
        },
      ],
    },

    {
      type: 'array',
      name: 'esimHistory',
      label: 'eSIM Card History',
      required: true,
      defaultValue: [],
      admin: {
        isSortable: false,
        initCollapsed: true,
        readOnly: true,
        description:
          'eSIM Card history log. Changes in ICCID numbers. It might contain multiple entries if/when the eSIM Card replacement has been ordered.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'iccid',
              type: 'text',
              index: true,
              required: true,
              label: 'ICCID',
            },
            {
              name: 'supplierOrderId',
              type: 'text',
              index: true,
              required: true,
              label: 'Supplier Order ID',
            },
            {
              name: 'happenedAt',
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'installationStatus',
              type: 'select',
              options: esimCardInstallationStatusOptions,
              defaultValue: initEsimCardInstallationStatus,
            },
            {
              name: 'installedAt',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
      ],
    },

    {
      type: 'group',
      interfaceName: 'EsimCardSetup',
      name: 'setup',
      label: 'eSIM setup',
      admin: {
        description: 'eSIM card technical details, related to installation and activation.',
      },
      fields: [
        {
          name: 'iccid',
          type: 'text',
          index: true,
          required: true,
          label: 'ICCID',
          admin: {
            description:
              'eSIM ICCID, Integrated Circuit Card Identifier, a unique number that identifies the eSIM itself (on SM-DP+ server).',
          },
        },
        {
          name: 'phoneNo',
          type: 'text',
          access: { ...accessReadOnly },
        },
        {
          name: 'smdpAddress',
          type: 'text',
          label: 'SM-DP+ address',
          required: true,
          admin: {
            description:
              "SM-DP+ server address of your carrier's Subscription Manager Data Preparation system (which prepares, stores and deliver eSIM profiles).",
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'activationCode',
              type: 'text',
              required: true,
            },
            {
              name: 'confirmationCode',
              type: 'text',
            },
          ],
        },
        {
          name: 'lpa',
          type: 'text',
          required: true,
          label: 'LPA address',
          admin: {
            description:
              'Local Profile Assistant URL. This is the only info needed to prepare/install eSIM and this is what is included in QR code.',
          },
        },
        {
          name: 'apn',
          type: 'text',
          required: true,
          label: 'APN',
          admin: {
            description:
              'Access Point Name i.e. Internet gateway, where the Internet traffic is routed.',
          },
        },
      ],
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: UsersCollectionId,
      label: 'Customer Account',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Customer who owns/manages the eSIM in their wallet.',
      },
    },
    {
      name: 'usageTracking',
      type: 'checkbox',
      label: 'Usage Tracking possible',
      required: true,
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'usageTrackingCode',
      type: 'text',
      label: 'USSD Code',
      admin: {
        position: 'sidebar',
        condition: (data) => !data.usageTracking,
        description: 'Quick call *code to get the current usage.',
      },
      access: { ...accessReadOnly },
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: EsimProvidersCollectionId,
      required: true,
      index: true,
      access: { ...accessReadOnly },
      admin: { position: 'sidebar' },
    },
    {
      name: 'supplier',
      type: 'select',
      options: productSupplierOptions,
      required: true,
      admin: { readOnly: true, position: 'sidebar' },
    },

    {
      name: 'usageLastSyncAt',
      type: 'date',
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'syncUsageData',
      type: 'ui',
      admin: {
        disableListColumn: true,
        components: {
          Field: '@/esim-core/esim-cards/collection/field-sync-usage-data#FieldSyncUsageData',
        },
      },
    },
  ],
};
