import type { CollectionConfig } from 'payload';

import { EsimProvidersCollectionId } from '@/payload/collections';

export const EsimProvidersCollection: CollectionConfig = {
  slug: EsimProvidersCollectionId,
  typescript: { interface: 'EsimProviderDto' },
  admin: {
    useAsTitle: 'name',
    group: 'Products',
    pagination: { defaultLimit: 100 },
  },
  labels: {
    singular: 'Provider',
    plural: 'Providers',
  },
  defaultSort: 'name',
  access: {
    read: () => true,
    readVersions: () => true,
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
      label: 'Provider Name',
      required: true,
    },
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Provider official website',
      admin: { placeholder: 'https://website.com' },
    },
  ],
  upload: {
    disableLocalStorage: true,
    filesRequiredOnCreate: false,
    mimeTypes: ['image/*'],
  },
};
