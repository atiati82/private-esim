import type { GlobalConfig } from 'payload';

import { EsimProductsDataCollectionId } from '@/payload/collections';

export const EsimProductsContentCollection: GlobalConfig = {
  slug: EsimProductsDataCollectionId,
  typescript: { interface: 'EsimProductsContent' },
  label: 'Product Content',
  admin: {
    group: 'Products',
    description: 'Product-related content',
  },
  versions: { max: 99 },
  fields: [
    {
      type: 'group',
      name: 'dynamicContent',
      label: 'Dynamic Content',
      fields: [
        {
          type: 'array',
          name: 'items',
          fields: [
            {
              type: 'text',
              name: 'id',
              label: 'Content ID',
              unique: true,
            },
            {
              type: 'textarea',
              name: 'content',
              label: 'Content',
            },
          ],
        },
      ],
    },

    {
      type: 'group',
      name: 'aboutText',
      label: 'Product: About section',
      fields: [
        {
          type: 'array',
          name: 'items',
          label: 'List items',
          fields: [
            {
              type: 'textarea',
              name: 'content',
              label: 'Content',
            },
          ],
        },
      ],
    },
  ],
};
