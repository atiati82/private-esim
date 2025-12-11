import type { CollectionConfig } from 'payload';

import { urlForBlogPostPreview } from '@/lib/urls';
import {
  BlogCategoriesCollectionId,
  BlogPostCollectionId,
  BlogTagsCollectionId,
  UsersCollectionId,
} from '@/payload/collections';
import { accessAnyone, accessEditorsOnly } from '@/payload/collections/access-helpers';
import { formatSlug } from '@/payload/utils/format-slug';
import { lexicalEditorConfig } from '@/payload/utils/lexical-config';

export const BlogPostsCollection: CollectionConfig = {
  slug: BlogPostCollectionId,
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Manage blog posts, including creating, updating, and categorizing posts.',
    pagination: { defaultLimit: 100 },
    defaultColumns: ['title', 'author', 'status', 'publishedDate'],
    listSearchableFields: ['title', 'content', 'tags'],
    livePreview: {
      url: ({ data }) => urlForBlogPostPreview(data.slug),
    },
  },
  access: {
    create: accessEditorsOnly,
    read: accessAnyone,
    update: accessEditorsOnly,
    delete: accessEditorsOnly,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Posts',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Post Title',
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              label: 'Post Content',
              editor: lexicalEditorConfig(),
            },
          ],
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Required for published posts. Optional for AI-generated drafts.',
      },
    },
    {
      type: 'collapsible',
      label: 'Post Settings',
      admin: { position: 'sidebar', initCollapsed: false },
      fields: [
        {
          name: 'markAsTopPost',
          type: 'checkbox',
          label: 'Mark as Top Post',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            position: 'sidebar',
          },
          hooks: {
            beforeChange: [formatSlug('title')],
          },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          required: false,
          label: 'Post Excerpt',
          admin: {
            position: 'sidebar',
            description: 'Brief summary of the post',
          },
        },
        {
          name: 'publishedDate',
          type: 'date',
          required: false,
          admin: {
            position: 'sidebar',
            date: {
              displayFormat: 'dd-MM-yyyy HH:mm a',
            },
            description: 'Auto-set when post is published',
          },
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: UsersCollectionId,
          required: false,
          admin: {
            position: 'sidebar',
            description: 'Auto-set from current user if empty',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Tags and Categories',
      admin: {
        position: 'sidebar',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'tags',
          label: 'Tags',
          type: 'relationship',
          relationTo: BlogTagsCollectionId,
          hasMany: true,
        },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: BlogCategoriesCollectionId,
          hasMany: true,
          required: false,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Metrics',
      admin: { hidden: true },
      fields: [
        {
          name: 'views',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'shares',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'metricsTopPostScore',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'AI CMS (BigMind)',
      admin: { initCollapsed: true, position: 'sidebar' },
      fields: [
        {
          name: 'contentCluster',
          type: 'select',
          options: [
            { label: 'Blog', value: 'blog' },
            { label: 'Support', value: 'support' },
            { label: 'About', value: 'about' },
            { label: 'Legal', value: 'legal' },
          ],
          defaultValue: 'blog',
          admin: { description: 'Content cluster for AI CMS routing' },
        },
        {
          name: 'aiGeneratedHtml',
          type: 'textarea',
          admin: { description: 'AI-generated HTML content for rendering' },
        },
        {
          name: 'aiVisualConfig',
          type: 'json',
          admin: { description: 'Motion and visual settings (JSON)' },
        },
        {
          name: 'aiImagePrompts',
          type: 'json',
          admin: { description: 'Image generation prompts (JSON)' },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!data.publishedDate && data._status === 'published') {
          data.publishedDate = new Date().toISOString();
        }
        if (operation === 'create') {
          if (req.user) {
            data.author = req.user.id;
          }
        }
      },
    ],
  },
  versions: {
    drafts: true,
    maxPerDoc: 100,
  },
};
