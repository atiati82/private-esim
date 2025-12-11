import type { CollectionConfig } from 'payload';

import { BlogTagsCollectionId } from '@/payload/collections';
import { accessAnyone, accessEditorsOnly } from '@/payload/collections/access-helpers';

export const BlogTagsCollection: CollectionConfig = {
  slug: BlogTagsCollectionId,
  admin: {
    useAsTitle: 'tag',
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
      name: 'tag',
      type: 'text',
      required: true,
    },
  ],
};
