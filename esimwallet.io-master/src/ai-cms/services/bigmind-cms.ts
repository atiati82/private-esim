import type OpenAI from 'openai';

import { parseBigMindResponse, type ParsedBigMindResponse } from '../lib/bigmind-parser';
import { MOTION_ARCHETYPES, type MotionArchetype } from '../lib/motion';
import { chat, chatWithFunctions, type ChatMessage } from './ai-client';

const CLUSTER_ONTOLOGY = [
  { key: 'blog', name: 'Blog', description: 'News, guides, and articles' },
  { key: 'support', name: 'Support', description: 'FAQ, help, and support pages' },
  { key: 'about', name: 'About', description: 'Company information and trust pages' },
  { key: 'legal', name: 'Legal', description: 'Terms, privacy, and legal pages' },
  { key: 'science', name: 'Science Library', description: 'Knowledge and research content' },
  { key: 'products', name: 'Products', description: 'eSIM product and plan pages' },
  { key: 'destinations', name: 'Destinations', description: 'Country and region pages' },
] as const;

const BIGMIND_SYSTEM_PROMPT = `You are BigMind, an AI CMS Manager for Private eSIM - a premium eSIM e-commerce platform.

## Your Role
You help manage the website content including:
- Blog posts and guides
- Support and FAQ content
- About and company pages
- Legal pages (terms, privacy)
- Science/knowledge library pages
- SEO optimization

## Page Generation Format
When generating pages, output these blocks in order:

### Block 1: Page Metadata
\`\`\`page-metadata
TITLE: [Page Title]
KEY: [unique_key_identifier]
H1_TITLE: [Main Headline]
PATH: /url-path-here
PAGE_TYPE: [standard|landing|article|product|destination]
CLUSTER: [blog|support|about|legal|science|products|destinations]
TEMPLATE: [default|pillar-overview|blog-article|faq|comparison|hero-landing]
PRIORITY: [1-10]
SUMMARY: [2-3 sentence summary]
SEO_FOCUS_KEYWORD: [main keyword phrase]
SEO_TITLE: [60 char SEO title]
SEO_DESCRIPTION: [155 char meta description]
FEATURED_IMAGE_URL: [optional image URL]
PAGE_ICON: [Lucide icon name, e.g., Beaker, Globe, FileText]
\`\`\`

### Block 2: Visual Configuration
\`\`\`visual-config
VISUAL_PRIORITY: [p1|p2|p3]
VIBE KEYWORDS: [modern, travel, connectivity, global]
EMOTIONAL TONE: [trustworthy, helpful, professional]
ANIMATION_IDEAS: [water flow, pulse, float]
COLOR PALETTE: indigo-to-sky gradient
MOTION PRESET: [none|liquid-crystal-float|energetic-pulse|magnetic-drift|krystal-bloom|scalar-slide|vortex-reveal|parallax-depth|ripple-emergence|subtle-shimmer|layered-parallax]
ENTRANCE: fadeUp, stagger.container
HOVER: hover.lift, hover.glow
AMBIENT: ambient.float, ambient.pulse
HERO_SECTION: fadeUp with parallax
CONTENT_SECTIONS: stagger reveal
CARDS_BOXES: hover.lift with glow
\`\`\`

### Block 3: HTML Content
\`\`\`html
<div class="page-content">
  <!-- Full HTML content here with semantic markup -->
</div>
\`\`\`

### Block 4: AI Image Prompt (for hero/featured image)
\`\`\`ai-image-prompt
Detailed prompt for generating hero images...
\`\`\`

### Block 5: AI Video Prompt (optional)
\`\`\`ai-video-prompt
Detailed prompt for generating background videos...
\`\`\`

### Block 6: Designer Notes (optional)
\`\`\`designer-notes
Additional notes for designers or developers...
\`\`\`

### Block 7: Image Prompts (for multiple images)
\`\`\`image-prompts
Hero Image: [detailed prompt]
Section 2 Image: [detailed prompt]
\`\`\`

## Content Clusters
${CLUSTER_ONTOLOGY.map((c) => `- ${c.key}: ${c.name} - ${c.description}`).join('\n')}

## Motion Archetypes
${Object.entries(MOTION_ARCHETYPES)
  .map(([key, val]) => `- ${key}: ${val.description}`)
  .join('\n')}

## Guidelines
- Focus on eSIM, travel connectivity, and mobile data themes
- Use clear, professional language
- Optimize for SEO with relevant keywords
- Include calls-to-action for eSIM purchases
- Support multiple languages (content in requested language)
`;

const CMS_TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'listPages',
      description: 'List all pages with optional filtering by cluster or status',
      parameters: {
        type: 'object',
        properties: {
          cluster: { type: 'string', description: 'Filter by cluster key' },
          status: { type: 'string', description: 'Filter by status (draft/published)' },
          limit: { type: 'number', description: 'Max pages to return' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createPage',
      description: 'Create a new page in the CMS',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Page title' },
          path: { type: 'string', description: 'URL path' },
          cluster: { type: 'string', description: 'Content cluster' },
          template: { type: 'string', description: 'Page template' },
          content: { type: 'string', description: 'HTML content' },
          seoTitle: { type: 'string', description: 'SEO title' },
          seoDescription: { type: 'string', description: 'Meta description' },
          visualConfig: { type: 'object', description: 'Visual/motion settings' },
        },
        required: ['title', 'path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'updatePage',
      description: 'Update an existing page',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Page ID' },
          cluster: {
            type: 'string',
            description: 'Content cluster (destinations, products, blog, etc.)',
          },
          title: { type: 'string' },
          summary: { type: 'string', description: 'Page summary or excerpt' },
          html: { type: 'string', description: 'AI-generated HTML content' },
          status: { type: 'string' },
          visualConfig: { type: 'object' },
          imagePrompts: { type: 'array', items: { type: 'string' } },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'deletePage',
      description: 'Delete a page by ID',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Page ID to delete' },
          cluster: {
            type: 'string',
            description: 'Content cluster (destinations, products, blog, etc.)',
          },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getPage',
      description: 'Get a page by ID',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Page ID' },
          cluster: {
            type: 'string',
            description: 'Content cluster (destinations, products, blog, etc.)',
          },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listClusters',
      description: 'List all content clusters',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listMotionArchetypes',
      description: 'List all available motion archetypes',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'applyMotionPreset',
      description: 'Apply motion archetype to a page',
      parameters: {
        type: 'object',
        properties: {
          pageId: { type: 'string', description: 'Page ID' },
          preset: { type: 'string', description: 'Motion preset name' },
          elements: {
            type: 'array',
            items: { type: 'string' },
            description: 'Elements to apply to',
          },
        },
        required: ['pageId', 'preset'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generatePageContent',
      description: 'Generate HTML content for a page based on topic',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: 'Page topic/title' },
          cluster: { type: 'string', description: 'Target cluster' },
          outline: { type: 'string', description: 'Brief outline or key points' },
          language: { type: 'string', description: 'Content language (en, es, de, fr, pl, ru)' },
        },
        required: ['topic', 'cluster'],
      },
    },
  },
];

export interface CMSStorage {
  listPages: (options?: {
    cluster?: string;
    status?: string;
    limit?: number;
  }) => Promise<unknown[]>;
  createPage: (data: Record<string, unknown>) => Promise<unknown>;
  updatePage: (id: string, data: Record<string, unknown>) => Promise<unknown>;
  deletePage: (id: string, options?: { cluster?: string }) => Promise<boolean>;
  getPage: (id: string, options?: { cluster?: string }) => Promise<unknown | null>;
}

export async function executeCmsFunction(
  name: string,
  args: Record<string, unknown>,
  storage: CMSStorage,
): Promise<unknown> {
  console.log(`[BigMind CMS] Executing: ${name}`, JSON.stringify(args));

  switch (name) {
    case 'listPages':
      return storage.listPages(args as { cluster?: string; status?: string; limit?: number });

    case 'createPage':
      return storage.createPage(args);

    case 'updatePage': {
      const { id, ...updates } = args;
      return storage.updatePage(id as string, updates);
    }

    case 'deletePage': {
      const { id, cluster } = args as { id: string; cluster?: string };
      return storage.deletePage(id, { cluster });
    }

    case 'getPage': {
      const { id, cluster } = args as { id: string; cluster?: string };
      return storage.getPage(id, { cluster });
    }

    case 'listClusters':
      return CLUSTER_ONTOLOGY;

    case 'listMotionArchetypes':
      return Object.entries(MOTION_ARCHETYPES).map(([key, val]) => ({
        key,
        name: val.name,
        description: val.description,
      }));

    case 'applyMotionPreset': {
      const { pageId, preset } = args as { pageId: string; preset: MotionArchetype };
      const archetype = MOTION_ARCHETYPES[preset];
      if (!archetype) {
        return { error: `Unknown motion preset: ${preset}` };
      }
      return storage.updatePage(pageId, {
        visualConfig: {
          motionPreset: preset,
          entranceMotion: preset,
        },
      });
    }

    case 'generatePageContent': {
      const { topic, cluster, outline, language } = args as {
        topic: string;
        cluster: string;
        outline?: string;
        language?: string;
      };

      const prompt = `Generate a complete page for "${topic}" in the ${cluster} cluster.
${outline ? `Key points to cover: ${outline}` : ''}
${language ? `Write content in ${language} language.` : ''}

Output all four blocks: page-metadata, visual-config, html, and image-prompts.`;

      const response = await chat([
        { role: 'system', content: BIGMIND_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ]);

      return parseBigMindResponse(response);
    }

    default:
      return { error: `Unknown function: ${name}` };
  }
}

export async function bigmindChat(
  messages: ChatMessage[],
  storage: CMSStorage,
  options?: {
    includeContext?: boolean;
    enableFunctions?: boolean;
  },
): Promise<{
  response: string;
  parsed?: ParsedBigMindResponse;
  functionCalls: Array<{ name: string; result: unknown }>;
}> {
  const allMessages: ChatMessage[] = [
    { role: 'system', content: BIGMIND_SYSTEM_PROMPT },
    ...messages,
  ];

  if (options?.enableFunctions !== false) {
    const { response, functionResults } = await chatWithFunctions(
      allMessages,
      CMS_TOOLS,
      (name, args) => executeCmsFunction(name, args, storage),
    );

    const parsed = parseBigMindResponse(response);

    return {
      response,
      parsed: parsed.htmlContent || parsed.pageMetadata.title ? parsed : undefined,
      functionCalls: functionResults,
    };
  }

  const response = await chat(allMessages);
  const parsed = parseBigMindResponse(response);

  return {
    response,
    parsed: parsed.htmlContent || parsed.pageMetadata.title ? parsed : undefined,
    functionCalls: [],
  };
}

export { CLUSTER_ONTOLOGY, BIGMIND_SYSTEM_PROMPT, CMS_TOOLS };
