import type { Payload, Where } from 'payload';

import type { CMSStorage } from './bigmind-cms';

const BLOG_CLUSTERS = ['blog', 'support', 'about', 'legal'] as const;
type BlogCluster = (typeof BLOG_CLUSTERS)[number];

function isBlogCluster(cluster?: string): cluster is BlogCluster {
  return BLOG_CLUSTERS.includes(cluster as BlogCluster);
}

function getPathPrefix(cluster?: string, locale = 'en'): string {
  const localePrefix = `/${locale}`;
  switch (cluster) {
    case 'destinations':
      return `${localePrefix}/destinations`;
    case 'products':
      return `${localePrefix}/products`;
    case 'support':
      return `${localePrefix}/support`;
    case 'about':
      return `${localePrefix}/about`;
    case 'legal':
      return `${localePrefix}/legal`;
    case 'blog':
    default:
      return `${localePrefix}/blog`;
  }
}

export interface AIGeneratedContent {
  html?: string;
  visualConfig?: {
    motion?: string;
    colorScheme?: string;
    layout?: string;
  };
  imagePrompts?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export function createPayloadStorage(payload: Payload, locale = 'en'): CMSStorage {
  return {
    async listPages(options) {
      const cluster = options?.cluster;

      if (cluster && !isBlogCluster(cluster)) {
        throw new Error(
          `AI content listing is only supported for blog/support/about/legal clusters. Use PayloadCMS admin for destinations/products.`,
        );
      }

      const where: Where = {};

      if (options?.status) {
        where._status = { equals: options.status };
      }
      if (isBlogCluster(cluster)) {
        where.contentCluster = { equals: cluster };
      }

      const result = await payload.find({
        collection: 'blog-posts',
        where,
        limit: options?.limit || 50,
        sort: '-createdAt',
        locale: locale as 'all',
      });

      return result.docs.map((doc) => {
        const baseDoc = doc as {
          id: string;
          title: string;
          slug: string;
          createdAt: string;
          updatedAt: string;
          _status?: string;
          contentCluster?: string;
        };

        const effectiveCluster = baseDoc.contentCluster || cluster || 'blog';
        const effectivePathPrefix = getPathPrefix(effectiveCluster, locale);

        return {
          id: baseDoc.id,
          title: baseDoc.title,
          path: `${effectivePathPrefix}/${baseDoc.slug}`,
          cluster: effectiveCluster,
          status: baseDoc._status,
          createdAt: baseDoc.createdAt,
          updatedAt: baseDoc.updatedAt,
        };
      });
    },

    async createPage(data) {
      const cluster = (data.cluster as string) || 'blog';

      if (!isBlogCluster(cluster)) {
        throw new Error(
          `AI content creation is only supported for blog/support/about/legal clusters. Received: ${cluster}. Destinations and products have complex schemas that require manual creation.`,
        );
      }

      const pathPrefix = getPathPrefix(cluster, locale);
      const title = data.title as string;

      const rawPath = (data.path as string) || '';
      const pathParts = rawPath.split('/').filter(Boolean);
      const localeIndex = pathParts.findIndex((p) =>
        ['en', 'es', 'de', 'fr', 'pl', 'ru'].includes(p),
      );
      const slugParts = localeIndex >= 0 ? pathParts.slice(localeIndex + 2) : pathParts.slice(1);
      const slug =
        slugParts.length > 0
          ? slugParts[slugParts.length - 1]
          : title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

      const aiMetadata = {
        aiGeneratedHtml: (data.html as string) || undefined,
        aiVisualConfig: data.visualConfig
          ? typeof data.visualConfig === 'string'
            ? data.visualConfig
            : JSON.stringify(data.visualConfig)
          : undefined,
        aiImagePrompts: data.imagePrompts
          ? typeof data.imagePrompts === 'string'
            ? data.imagePrompts
            : JSON.stringify(data.imagePrompts)
          : undefined,
      };

      const emptyContent = {
        root: {
          type: 'root' as const,
          children: [],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      };

      const result = await payload.create({
        collection: 'blog-posts',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        locale: locale as any,
        data: {
          title,
          slug,
          content: emptyContent,
          excerpt: (data.summary as string) || '',
          categories: [],
          tags: [],
          contentCluster: isBlogCluster(cluster) ? cluster : 'blog',
          _status: 'draft',
          ...aiMetadata,
        } as never,
      });

      return {
        id: result.id,
        title: result.title,
        path: `${pathPrefix}/${result.slug}`,
        status: result._status,
        cluster,
      };
    },

    async updatePage(id, data) {
      const cluster = (data.cluster as string) || 'blog';

      if (!isBlogCluster(cluster)) {
        throw new Error(
          `AI content update is only supported for blog/support/about/legal clusters. Use PayloadCMS admin for destinations/products.`,
        );
      }

      const updateData: Record<string, unknown> = {};

      if (data.title) {
        updateData.title = data.title;
      }

      if (data.status) {
        updateData._status = data.status;
      }

      if (data.summary) {
        updateData.excerpt = data.summary;
      }

      if (data.html) {
        updateData.aiGeneratedHtml = data.html;
      }

      if (data.visualConfig) {
        updateData.aiVisualConfig =
          typeof data.visualConfig === 'string'
            ? data.visualConfig
            : JSON.stringify(data.visualConfig);
      }

      if (data.imagePrompts) {
        updateData.aiImagePrompts =
          typeof data.imagePrompts === 'string'
            ? data.imagePrompts
            : JSON.stringify(data.imagePrompts);
      }

      const result = await payload.update({
        collection: 'blog-posts',
        id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        locale: locale as any,
        data: updateData as never,
      });

      const baseResult = result as unknown as { id: string; _status?: string; title?: string };

      return {
        id: baseResult.id,
        title: baseResult.title || '',
        status: baseResult._status,
        cluster,
      };
    },

    async deletePage(id, options) {
      const cluster = options?.cluster;

      if (cluster && !isBlogCluster(cluster)) {
        throw new Error(
          `AI content deletion is only supported for blog/support/about/legal clusters. Use PayloadCMS admin for destinations/products.`,
        );
      }

      try {
        await payload.delete({
          collection: 'blog-posts',
          id,
        });
        return true;
      } catch {
        return false;
      }
    },

    async getPage(id, options) {
      const cluster = options?.cluster;

      if (cluster && !isBlogCluster(cluster)) {
        throw new Error(
          `AI content retrieval is only supported for blog/support/about/legal clusters. Use PayloadCMS admin for destinations/products.`,
        );
      }

      try {
        const doc = await payload.findByID({
          collection: 'blog-posts',
          id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          locale: locale as any,
        });

        const baseDoc = doc as {
          id: string;
          title: string;
          slug: string;
          _status?: string;
          aiGeneratedHtml?: string;
          aiVisualConfig?: unknown;
          aiImagePrompts?: unknown;
          contentCluster?: string;
        };

        const effectiveCluster = baseDoc.contentCluster || cluster || 'blog';
        const effectivePathPrefix = getPathPrefix(effectiveCluster, locale);

        let visualConfig = baseDoc.aiVisualConfig;
        if (typeof visualConfig === 'string') {
          try {
            visualConfig = JSON.parse(visualConfig);
          } catch {
            /* keep as string */
          }
        }

        let imagePrompts = baseDoc.aiImagePrompts;
        if (typeof imagePrompts === 'string') {
          try {
            imagePrompts = JSON.parse(imagePrompts);
          } catch {
            /* keep as string */
          }
        }

        return {
          id: baseDoc.id,
          title: baseDoc.title,
          path: `${effectivePathPrefix}/${baseDoc.slug}`,
          cluster: effectiveCluster,
          status: baseDoc._status,
          html: baseDoc.aiGeneratedHtml,
          visualConfig,
          imagePrompts,
        };
      } catch {
        return null;
      }
    },
  };
}
