import type { CollectionConfig, FieldBase } from 'payload';

import { urlForProductsList } from '@/lib/urls';
import type { DestinationDto } from '@/payload/app-types';
import { DestinationsCollectionId, RegionsCollectionId } from '@/payload/collections';

const accessReadOnly: FieldBase['access'] = {
  update: () => false,
};

export const DestinationsCollection: CollectionConfig = {
  slug: DestinationsCollectionId,
  typescript: { interface: 'DestinationDto' },
  admin: {
    useAsTitle: 'name',
    group: 'Products',
    description: 'Destination. Usually a country. Can be a city / state within country.',
    pagination: { defaultLimit: 100 },
    defaultColumns: ['id', 'name', 'isTopDestination', 'region'],
    listSearchableFields: ['id', 'name', 'region', 'keywords', 'currency'],
    preview: (doc) => urlForProductsList((doc as unknown as DestinationDto).slug),
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      label: 'ISO code',
      admin: {
        description:
          'ISO 2-letter country code or ISO-<suffix> for city destinations. All lowercase.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'published',
      type: 'checkbox',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isTopDestination',
      type: 'checkbox',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'currency',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: RegionsCollectionId,
      required: true,
      index: true,
    },
    {
      type: 'group',
      name: 'productStats',
      access: { ...accessReadOnly },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'allProducts',
              type: 'number',
            },
            {
              name: 'eSimProducts',
              label: 'eSIM Products',
              type: 'number',
            },
            {
              name: 'topUpProducts',
              label: 'Top-Up Products',
              type: 'number',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'priceFrom',
              label: 'Price (from)',
              type: 'number',
            },
            {
              name: 'pricePerGbFrom',
              label: 'Price/GB (from)',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'keywords',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Search keywords: alternative names, major city names, states, etc.',
      },
    },
    {
      type: 'collapsible',
      label: 'Extra Information',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'altIsoCodes',
          type: 'text',
          hasMany: true,
          label: 'Alternative ISO codes',
          admin: {
            description:
              'Coma-separated alternative ISO codes, used to map destinations to destination codes used by eSIM providers.',
          },
        },
        {
          name: 'parentDestination',
          type: 'relationship',
          relationTo: DestinationsCollectionId,
          label: 'Parent destination (country)',
          admin: {
            description: "For destinations which aren't countries, set country information here.",
          },
        },
      ],
    },
  ],
  versions: {
    drafts: false,
  },
};
