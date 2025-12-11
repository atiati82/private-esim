import type { CollectionConfig, FieldBase } from 'payload';

import { OrderItemsCollectionId } from '@/esim-core/order-items/collection';
import { urlForTransactions } from '@/lib/urls';
import { UsersCollectionId } from '@/payload/collections';
import {
  accessSupportOnly,
  accessSupportOrLoggedIn,
  accessSupportOrUserOwning,
} from '@/payload/collections/access-helpers';

import {
  transactionPaymentStatusDefault,
  transactionPaymentStatusOptions,
} from '@/feat-ordering/transactions/transaction-symbols';
import { makeTransactionId, TransactionIdPrefix } from '@/feat-ordering/transactions/transactions';
import { checkoutEndpoint } from '../../endpoints/checkout.endpoint';
import { paymentEndpoint } from '../../endpoints/payment.endpoint';
import { stripeEventsEndpoint } from '../../endpoints/stripe-events.endpoint';
import { TransactionsCollectionId } from './index';

const accessReadOnly: FieldBase['access'] = { update: () => false };

export const TransactionsCollection: CollectionConfig = {
  slug: TransactionsCollectionId,
  typescript: { interface: 'TransactionDto' },
  access: {
    create: accessSupportOrLoggedIn,
    delete: () => true, // TODO: disable deletion...
    read: accessSupportOrUserOwning,
    update: accessSupportOnly,
  },
  admin: {
    group: 'eSIMwallet',
    defaultColumns: ['id', 'user', 'total', 'paymentStatus', 'createdAt'],
    listSearchableFields: ['id', 'user', 'paymentId'],
    preview: (doc) => urlForTransactions(doc.id as string),
  },
  endpoints: [
    {
      /** @see callCheckoutEndpoint */
      handler: checkoutEndpoint,
      method: 'post',
      path: '/checkout',
    },
    {
      /** @see callPaymentEndpoint */
      handler: paymentEndpoint,
      method: 'post',
      path: '/:transaction/payment',
    },
    {
      handler: stripeEventsEndpoint,
      method: 'post',
      path: '/stripe-events',
    },
  ],
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      label: 'Transaction ID',
      defaultValue: makeTransactionId(),
      access: { ...accessReadOnly },
      admin: { placeholder: `${TransactionIdPrefix}...` },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: UsersCollectionId,
      required: true,
      index: true,
      label: 'Customer',
    },
    {
      name: 'total',
      type: 'number',
      label: 'Total Amount',
      min: 0,
      defaultValue: 0,
      required: true,
    },
    {
      name: 'orderItems',
      type: 'join',
      collection: OrderItemsCollectionId,
      on: 'transaction',
    },

    {
      name: 'paymentStatus',
      type: 'select',
      label: 'Payment Status',
      options: transactionPaymentStatusOptions,
      defaultValue: transactionPaymentStatusDefault,
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentId',
      type: 'text',
      admin: {
        position: 'sidebar',
        components: {
          Field:
            '@/feat-ordering/transactions/collection/field-stripe-payment-id#FieldStripePaymentId',
        },
      },
    },
  ],
};
