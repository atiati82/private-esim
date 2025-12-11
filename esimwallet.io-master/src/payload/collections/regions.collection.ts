import type { CollectionConfig, FieldBase } from 'payload';

import { urlForProductsList } from '@/lib/urls';
import type { RegionDto } from '@/payload/app-types';
import { RegionsCollectionId } from '@/payload/collections';

const accessReadOnly: FieldBase['access'] = {
  update: () => false,
};

export const RegionsCollection: CollectionConfig = {
  slug: RegionsCollectionId,
  typescript: { interface: 'RegionDto' },
  admin: {
    useAsTitle: 'name',
    group: 'Products',
    pagination: { defaultLimit: 100 },
    preview: (doc) => urlForProductsList((doc as unknown as RegionDto).slug),
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      type: 'checkbox',
      admin: { position: 'sidebar' },
    },
  ],
};
