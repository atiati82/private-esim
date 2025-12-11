import type { Block, FieldBase } from 'payload';

import { DestinationsCollectionId, RegionsCollectionId } from '@/payload/collections';

const accessReadOnly: FieldBase['access'] = {
  update: () => false,
};

export const EsimProductsBlock: Block = {
  slug: 'esim-products',
  labels: {
    plural: 'Esim Products',
    singular: 'Esim Products',
  },
  interfaceName: 'EsimProductBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'locations',
      type: 'relationship',
      relationTo: [DestinationsCollectionId, RegionsCollectionId],
      hasMany: true,
      index: true,
      defaultValue: undefined,
      access: { ...accessReadOnly },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'esim-products',
      hasMany: true,
      label: 'Select Products',
    },
  ],
};
