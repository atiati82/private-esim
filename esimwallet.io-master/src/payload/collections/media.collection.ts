import type { CollectionConfig } from 'payload';

import { MediaCollectionId } from '@/payload/collections';
import { accessAnyone, accessEditorsOnly } from '@/payload/collections/access-helpers';

export const MediaCollection: CollectionConfig = {
  slug: MediaCollectionId,
  typescript: { interface: 'MediaDto' },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    pagination: { defaultLimit: 100 },
  },
  access: {
    create: accessEditorsOnly,
    read: accessAnyone,
    update: accessEditorsOnly,
    delete: accessEditorsOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/*', 'application/pdf'],
  },
};
