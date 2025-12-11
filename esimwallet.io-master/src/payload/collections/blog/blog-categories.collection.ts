import type { CollectionConfig } from 'payload';

import { BlogCategoriesCollectionId } from '@/payload/collections';
import { accessAnyone, accessEditorsOnly } from '@/payload/collections/access-helpers';

export const BlogCategoriesCollection: CollectionConfig = {
  slug: BlogCategoriesCollectionId,
  admin: {
    useAsTitle: 'name',
    group: 'Content',
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
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
  ],
};
