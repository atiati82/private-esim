import type { CollectionConfig, FieldBase, FieldHook } from 'payload';

import { productSupplierOptions } from '@/data/esim-product';
import { calculateProfit } from '@/lib/esim-wallet';
import { urlForMyWallet } from '@/lib/urls';
import { OrderItemDto } from '@/payload/app-types';
import { EsimProductsCollectionId, UsersCollectionId } from '@/payload/collections';
import {
  accessAdminsOnly,
  accessSupportOnly,
  accessSupportOrLoggedIn,
  accessSupportOrUserOwning,
  fieldAccessAdminsOnly,
} from '@/payload/collections/access-helpers';

import {
  transactionPaymentStatusDefault,
  transactionPaymentStatusOptions,
} from '@/feat-ordering/transactions/transaction-symbols';
import { syncProviderDataEndpoint } from '../../endpoints/sync-provider-data.endpoint';
import { EsimCardsCollectionId } from '../../esim-cards/collection';
import { initFulfillmentStatus } from '../../fulfillment-usage/fulfillment-status';
import { fulfillmentStatusOptions, OrderItemsCollectionId } from './order-item-symbols';
import { populateOrderItemData } from './populate-order-item-data';

const accessReadOnly: FieldBase['access'] = { update: () => false };

const formatProfit: FieldHook<OrderItemDto> = ({ data: order }) => {
  if (!order) {
    return;
  }
  const profit = calculateProfit(order.price, order.supplierPrice) * 100;
  return parseFloat(profit.toFixed(1));
};

/**
 * Order items (i.e. Data Plans, packages) ordered by a Customer within a Transaction
 *
 * Order Item contains all package info, incl. fulfillment status, current usage etc
 * and, most importantly, which eSIM card it's assigned to.
 */
export const OrderItemsCollection: CollectionConfig = {
  slug: OrderItemsCollectionId,
  typescript: { interface: 'OrderItemDto' },
  access: {
    create: accessSupportOrLoggedIn,
    delete: accessAdminsOnly,
    read: accessSupportOrUserOwning,
    update: accessSupportOnly,
  },
  labels: { singular: 'Order, Package', plural: 'Orders, Packages' },
  admin: {
    group: 'eSIMwallet',
    useAsTitle: 'title',
    defaultColumns: ['title', 'esimCard', 'user', 'transactionPaymentStatus', 'createdAt'],
    listSearchableFields: ['id', 'product', 'transaction'],
    preview: (doc) => urlForMyWallet(doc.id as string),
  },
  endpoints: [
    {
      handler: syncProviderDataEndpoint,
      method: 'get',
      path: '/sync-provider-data',
    },
  ],
  hooks: {
    beforeValidate: [populateOrderItemData],
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      admin: { hidden: true, position: 'sidebar' },
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Package, Usage Data',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              label: 'Product / Package',
              relationTo: EsimProductsCollectionId,
              required: true,
            },
            {
              name: 'esimCard',
              type: 'relationship',
              relationTo: EsimCardsCollectionId,
              label: 'eSIM card',
              admin: {
                description:
                  `eSIM for which this product has been bought. ` +
                  `If empty, the order (for eSIM starter) hasn't been fulfilled yet.`,
              },
            },

            {
              name: 'usage',
              type: 'group',
              interfaceName: 'PackageUsageDto',
              label: 'Plan / Package Usage',
              admin: { description: 'Data Plan current usage etc.' },
              fields: [
                {
                  name: 'activationDate',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayAndTime' } },
                  access: { ...accessReadOnly },
                },
                {
                  name: 'expirationDate',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayAndTime' } },
                  access: { ...accessReadOnly },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'mbUsed',
                      type: 'number',
                      label: 'Used MB',
                      access: { ...accessReadOnly },
                    },
                    {
                      name: 'mbAllowance',
                      type: 'number',
                      label: 'Allowance MB',
                      access: { ...accessReadOnly },
                    },
                    {
                      name: 'mbUsageDelta',
                      type: 'number',
                      admin: { hidden: true },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'minUsed',
                      type: 'number',
                      label: 'Used minutes',
                      access: { ...accessReadOnly },
                    },
                    {
                      name: 'minAllowance',
                      type: 'number',
                      label: 'Allowance minutes',
                      access: { ...accessReadOnly },
                    },
                    {
                      name: 'minUsageDelta',
                      type: 'number',
                      admin: { hidden: true },
                    },
                  ],
                },
              ],
            },

            {
              type: 'group',
              name: 'status',
              interfaceName: 'OrderItemLiveStatusDto',
              label: 'Plan / Package Status',
              admin: {
                readOnly: true,
                description:
                  'Plan / Package "live" statuses, based on latest usage data received from Provider.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      type: 'checkbox',
                      name: 'isActivelyUsingAllowance',
                      label: 'Is in active use',
                    },
                    {
                      type: 'checkbox',
                      name: 'isPackageExpired',
                      label: 'Is package expired',
                    },
                    {
                      type: 'checkbox',
                      name: 'isPackageUsedUp',
                      label: 'Is package used up',
                    },
                  ],
                },
              ],
            },
            {
              name: 'usageLastSyncAt',
              type: 'date',
              admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'syncUsageDataForOrderItem',
              type: 'ui',
              admin: {
                disableListColumn: true,
                components: {
                  Field:
                    '@/esim-core/esim-cards/collection/field-sync-usage-data#FieldSyncUsageData',
                },
              },
            },
          ],
        }, // TAB [Package, Usage, eSIM card] ENDS here

        // TAB [Order Details] STARTS here
        {
          label: 'Order Details',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Order Name',
              admin: { readOnly: true },
            },
            {
              name: 'transaction',
              type: 'relationship',
              relationTo: 'transactions',
              required: true,
              index: true,
            },
            {
              // Store transaction payment status here as well, for convenience, easy filtering reasons
              name: 'transactionPaymentStatus',
              type: 'select',
              label: 'Transaction Payment Status',
              options: transactionPaymentStatusOptions,
              defaultValue: transactionPaymentStatusDefault,
              access: { ...accessReadOnly },
            },
            {
              type: 'row', // Price row
              fields: [
                {
                  name: 'price',
                  type: 'number', // in cents
                  defaultValue: 0,
                  min: 0,
                  required: true,
                  admin: { width: '30%', step: 1 },
                },
                {
                  name: 'supplierPrice',
                  type: 'number', // in cents
                  defaultValue: 0,
                  min: 0,
                  required: true,
                  admin: { step: 1 },
                },
                {
                  name: 'profit',
                  type: 'number',
                  label: 'Profit %',
                  virtual: true,
                  admin: { readOnly: true },
                  access: {
                    read: fieldAccessAdminsOnly,
                  },
                  hooks: {
                    afterRead: [formatProfit],
                  },
                },
              ],
            },
          ],
        },
      ], // TAB [Order Details] ends here
    },
    // TABS ends here

    {
      name: 'user',
      type: 'relationship',
      relationTo: UsersCollectionId,
      required: true,
      index: true,
      label: 'Customer Account',
      admin: {
        position: 'sidebar',
        description: 'Customer who owns/manages the item in their wallet.',
      },
    },
    {
      name: 'fulfillment',
      type: 'group',
      interfaceName: 'OrderFulfillment',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'status',
          type: 'select',
          options: fulfillmentStatusOptions,
          required: true,
          defaultValue: initFulfillmentStatus,
          label: 'Fulfilment Status',
          admin: { description: 'Order State from Supplier.' },
        },

        {
          name: 'supplier',
          type: 'select',
          options: productSupplierOptions,
          required: true,
        },
        {
          name: 'supplierProductId',
          type: 'text',
          required: true,
          access: { ...accessReadOnly },
          admin: { hidden: true },
        },
        {
          name: 'supplierOrderId',
          type: 'text',
        },
        {
          name: 'fulfilledAt',
          type: 'date',
          admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
          access: { ...accessReadOnly },
        },
      ],
    },
  ],
};
