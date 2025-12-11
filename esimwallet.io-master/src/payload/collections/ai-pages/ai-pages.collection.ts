import type { CollectionConfig } from 'payload';

import { accessAnyone, accessEditorsOnly } from '@/payload/collections/access-helpers';
import { formatSlug } from '@/payload/utils/format-slug';
import { lexicalEditorConfig } from '@/payload/utils/lexical-config';

export const AiPagesCollectionId = 'ai-pages';

export const AiPagesCollection: CollectionConfig = {
  slug: AiPagesCollectionId,
  admin: {
    useAsTitle: 'title',
    group: 'AI CMS',
    description: 'AI-powered page creation and management with BigMind',
    pagination: { defaultLimit: 100 },
    defaultColumns: ['title', 'contentCluster', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'key', 'urlPath', 'summary'],
  },
  access: {
    create: accessEditorsOnly,
    read: accessAnyone,
    update: accessEditorsOnly,
    delete: accessEditorsOnly,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
          admin: { width: '50%' },
        },
        {
          name: 'key',
          type: 'text',
          required: true,
          unique: true,
          label: 'Key',
          admin: {
            width: '50%',
            description: 'Unique identifier for this page',
          },
          hooks: {
            beforeChange: [formatSlug('title')],
          },
        },
      ],
    },
    {
      name: 'urlPath',
      type: 'text',
      required: true,
      label: 'URL Path',
      admin: {
        description: 'e.g., /blog/my-article or /support/faq',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'pageType',
          type: 'select',
          label: 'Page Type',
          defaultValue: 'standard',
          options: [
            { label: 'Standard Page', value: 'standard' },
            { label: 'Landing Page', value: 'landing' },
            { label: 'Article', value: 'article' },
            { label: 'Product Page', value: 'product' },
            { label: 'Destination Page', value: 'destination' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'template',
          type: 'select',
          label: 'Template',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Pillar Overview', value: 'pillar-overview' },
            { label: 'Blog Article', value: 'blog-article' },
            { label: 'FAQ Page', value: 'faq' },
            { label: 'Comparison', value: 'comparison' },
            { label: 'Hero Landing', value: 'hero-landing' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Archived', value: 'archived' },
          ],
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'parentPage',
          type: 'relationship',
          relationTo: 'ai-pages' as const,
          label: 'Parent Page',
          admin: { width: '33%' },
        },
        {
          name: 'contentCluster',
          type: 'select',
          label: 'Content Cluster',
          defaultValue: 'blog',
          options: [
            { label: 'Blog', value: 'blog' },
            { label: 'Support', value: 'support' },
            { label: 'About', value: 'about' },
            { label: 'Legal', value: 'legal' },
            { label: 'Science Library', value: 'science' },
            { label: 'Products', value: 'products' },
            { label: 'Destinations', value: 'destinations' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'priority',
          type: 'number',
          label: 'Priority (1-10)',
          defaultValue: 5,
          min: 1,
          max: 10,
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Summary',
      admin: {
        description: 'Brief summary of the page content...',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor: lexicalEditorConfig(),
      admin: {
        description: 'Main page content',
      },
    },
    {
      name: 'rawHtmlContent',
      type: 'code',
      label: 'Raw HTML Content',
      admin: {
        language: 'html',
        description: 'AI-generated HTML content',
      },
    },
    {
      type: 'collapsible',
      label: 'SEO Settings',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'seoFocusKeyword',
          type: 'text',
          label: 'SEO Focus Keyword',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'SEO Title',
              admin: {
                width: '50%',
                description: 'Leave empty to use page title',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'SEO Description',
              admin: {
                width: '50%',
                description: 'Meta description for search engines',
              },
            },
          ],
        },
        {
          name: 'featuredImageUrl',
          type: 'text',
          label: 'Featured Image URL',
          admin: {
            description: 'https://example.com/image.jpg',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'AI Prompts',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'aiImagePrompt',
          type: 'textarea',
          label: 'AI Image Prompt',
          admin: {
            description: 'Detailed prompt for generating hero images...',
          },
        },
        {
          name: 'aiVideoPrompt',
          type: 'textarea',
          label: 'AI Video Prompt',
          admin: {
            description: 'Detailed prompt for generating background videos...',
          },
        },
        {
          name: 'designerNotes',
          type: 'textarea',
          label: 'Designer Notes',
          admin: {
            description: 'Additional notes for designers or developers...',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Visual Config',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'visualPriority',
              type: 'select',
              label: 'Visual Priority',
              defaultValue: 'p2',
              options: [
                { label: 'P1 - Primary', value: 'p1' },
                { label: 'P2 - Secondary', value: 'p2' },
                { label: 'P3 - Tertiary', value: 'p3' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'visualCluster',
              type: 'text',
              label: 'Content Cluster',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'vibeKeywords',
              type: 'text',
              label: 'Vibe Keywords',
              admin: {
                width: '33%',
                description: 'Comma-separated',
              },
            },
            {
              name: 'emotionalTone',
              type: 'text',
              label: 'Emotional Tone',
              admin: {
                width: '33%',
                description: 'Comma-separated',
              },
            },
            {
              name: 'animationIdeas',
              type: 'text',
              label: 'Animation Ideas',
              admin: {
                width: '33%',
                description: 'Comma-separated',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'motionPreset',
              type: 'select',
              label: 'Motion Preset',
              defaultValue: 'none',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Liquid Crystal Float', value: 'liquid-crystal-float' },
                { label: 'Energetic Pulse', value: 'energetic-pulse' },
                { label: 'Magnetic Drift', value: 'magnetic-drift' },
                { label: 'Krystal Bloom', value: 'krystal-bloom' },
                { label: 'Scalar Slide', value: 'scalar-slide' },
                { label: 'Vortex Reveal', value: 'vortex-reveal' },
                { label: 'Parallax Depth', value: 'parallax-depth' },
                { label: 'Ripple Emergence', value: 'ripple-emergence' },
                { label: 'Subtle Shimmer', value: 'subtle-shimmer' },
                { label: 'Layered Parallax', value: 'layered-parallax' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'entranceMotion',
              type: 'text',
              label: 'Entrance Motion',
              admin: {
                width: '50%',
                description: 'e.g., fadeUp, scaleIn, slideFromLeft',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'hoverMotion',
              type: 'text',
              label: 'Hover Motion',
              admin: {
                width: '50%',
                description: 'e.g., hover.lift, hover.glow, hover.scale',
              },
            },
            {
              name: 'ambientMotion',
              type: 'text',
              label: 'Ambient Motion',
              admin: {
                width: '50%',
                description: 'e.g., ambient.float, ambient.pulse',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'heroSectionMotion',
              type: 'text',
              label: 'Hero Section',
              admin: { width: '33%' },
            },
            {
              name: 'contentSectionsMotion',
              type: 'text',
              label: 'Content Sections',
              admin: { width: '33%' },
            },
            {
              name: 'cardsBoxesMotion',
              type: 'text',
              label: 'Cards/Boxes',
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Page Icon',
      admin: { initCollapsed: true, position: 'sidebar' },
      fields: [
        {
          name: 'pageIcon',
          type: 'text',
          label: 'Page Icon',
          admin: {
            description: 'Lucide icon name for navigation (e.g., Beaker, Flask, Droplet)',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Media Gallery',
      admin: { initCollapsed: true, position: 'sidebar' },
      fields: [
        {
          name: 'mediaGallery',
          type: 'array',
          label: 'Media Gallery',
          fields: [
            {
              name: 'mediaUrl',
              type: 'text',
              label: 'Media URL',
            },
            {
              name: 'mediaType',
              type: 'select',
              label: 'Type',
              options: [
                { label: 'Image', value: 'image' },
                { label: 'Video', value: 'video' },
              ],
            },
            {
              name: 'altText',
              type: 'text',
              label: 'Alt Text',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'AI Page Builder',
      admin: { initCollapsed: false, position: 'sidebar' },
      fields: [
        {
          name: 'aiChatHistory',
          type: 'json',
          label: 'Chat History',
          admin: {
            description: 'AI conversation history for this page',
          },
        },
        {
          name: 'aiLastPrompt',
          type: 'textarea',
          label: 'Last AI Prompt',
          admin: {
            description: 'Most recent prompt sent to BigMind',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Date Information',
      admin: { initCollapsed: true, position: 'sidebar' },
      fields: [
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Published',
          admin: {
            date: { displayFormat: 'MMM d, yyyy, h:mm a' },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Linking Rules',
      admin: { initCollapsed: true, position: 'sidebar' },
      fields: [
        {
          name: 'internalLinks',
          type: 'relationship',
          relationTo: 'ai-pages' as const,
          hasMany: true,
          label: 'Internal Links',
        },
        {
          name: 'externalLinks',
          type: 'array',
          label: 'External Links',
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'URL',
            },
            {
              name: 'anchorText',
              type: 'text',
              label: 'Anchor Text',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.key) {
          data.key = data.title
            ?.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
        }
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
  timestamps: true,
};
