import type { Payload, Where } from 'payload';

import { generateSlugFromTitle, parseBigMindResponse } from '../lib/bigmind-parser';
import type { CMSStorage } from './bigmind-cms';

type SupportedLocale = 'en' | 'de' | 'es' | 'fr' | 'pl' | 'ru';

export function createAiPagesStorage(payload: Payload, locale: SupportedLocale = 'en'): CMSStorage {
  return {
    async listPages(options) {
      const where: Where = {};

      if (options?.status) {
        where.status = { equals: options.status };
      }
      if (options?.cluster) {
        where.contentCluster = { equals: options.cluster };
      }

      const result = await payload.find({
        collection: 'ai-pages',
        where,
        limit: options?.limit || 50,
        sort: '-updatedAt',
        locale: locale,
      });

      return result.docs.map((doc) => {
        const page = doc as {
          id: string;
          title: string;
          key: string;
          urlPath: string;
          contentCluster?: string;
          status?: string;
          createdAt: string;
          updatedAt: string;
        };

        return {
          id: page.id,
          title: page.title,
          path: page.urlPath,
          cluster: page.contentCluster || 'blog',
          status: page.status,
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
        };
      });
    },

    async createPage(data) {
      const title = data.title as string;
      const key = (data.key as string) || generateSlugFromTitle(title);
      const urlPath = (data.path as string) || `/${locale}/${data.cluster || 'blog'}/${key}`;

      const pageData = {
        title,
        key,
        urlPath,
        pageType: data.pageType || 'standard',
        template: data.template || 'default',
        status: 'draft',
        contentCluster: data.cluster || 'blog',
        priority: parseInt(data.priority as string) || 5,
        summary: data.summary || '',
        rawHtmlContent: data.html || '',
        seoFocusKeyword: data.seoFocusKeyword || '',
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        featuredImageUrl: data.featuredImageUrl || '',
        aiImagePrompt: data.aiImagePrompt || '',
        aiVideoPrompt: data.aiVideoPrompt || '',
        designerNotes: data.designerNotes || '',
        visualPriority: data.visualPriority || 'p2',
        vibeKeywords: data.vibeKeywords || '',
        emotionalTone: data.emotionalTone || '',
        animationIdeas: data.animationIdeas || '',
        motionPreset: data.motionPreset || 'none',
        entranceMotion: data.entranceMotion || '',
        hoverMotion: data.hoverMotion || '',
        ambientMotion: data.ambientMotion || '',
        heroSectionMotion: data.heroSectionMotion || '',
        contentSectionsMotion: data.contentSectionsMotion || '',
        cardsBoxesMotion: data.cardsBoxesMotion || '',
        pageIcon: data.pageIcon || '',
      };

      const result = await payload.create({
        collection: 'ai-pages',
        data: pageData as never,
        locale,
      });

      return {
        id: result.id as string,
        path: urlPath,
        title,
        cluster: (data.cluster as string) || 'blog',
      };
    },

    async updatePage(id, data) {
      const updateData: Record<string, unknown> = {};

      if (data.title) {
        updateData.title = data.title;
      }
      if (data.path) {
        updateData.urlPath = data.path;
      }
      if (data.html) {
        updateData.rawHtmlContent = data.html;
      }
      if (data.summary) {
        updateData.summary = data.summary;
      }
      if (data.seoTitle) {
        updateData.seoTitle = data.seoTitle;
      }
      if (data.seoDescription) {
        updateData.seoDescription = data.seoDescription;
      }
      if (data.seoFocusKeyword) {
        updateData.seoFocusKeyword = data.seoFocusKeyword;
      }
      if (data.featuredImageUrl) {
        updateData.featuredImageUrl = data.featuredImageUrl;
      }
      if (data.aiImagePrompt) {
        updateData.aiImagePrompt = data.aiImagePrompt;
      }
      if (data.aiVideoPrompt) {
        updateData.aiVideoPrompt = data.aiVideoPrompt;
      }
      if (data.designerNotes) {
        updateData.designerNotes = data.designerNotes;
      }
      if (data.vibeKeywords) {
        updateData.vibeKeywords = data.vibeKeywords;
      }
      if (data.emotionalTone) {
        updateData.emotionalTone = data.emotionalTone;
      }
      if (data.animationIdeas) {
        updateData.animationIdeas = data.animationIdeas;
      }
      if (data.motionPreset) {
        updateData.motionPreset = data.motionPreset;
      }
      if (data.entranceMotion) {
        updateData.entranceMotion = data.entranceMotion;
      }
      if (data.hoverMotion) {
        updateData.hoverMotion = data.hoverMotion;
      }
      if (data.ambientMotion) {
        updateData.ambientMotion = data.ambientMotion;
      }
      if (data.pageIcon) {
        updateData.pageIcon = data.pageIcon;
      }
      if (data.cluster) {
        updateData.contentCluster = data.cluster;
      }
      if (data.status) {
        updateData.status = data.status;
      }

      const result = await payload.update({
        collection: 'ai-pages',
        id,
        locale: locale,
        data: updateData as never,
      });

      const pageResult = result as unknown as {
        id: string;
        title?: string;
        status?: string;
        contentCluster?: string;
      };

      return {
        id: pageResult.id,
        title: pageResult.title || '',
        status: pageResult.status,
        cluster: pageResult.contentCluster,
      };
    },

    async deletePage(id) {
      try {
        await payload.delete({
          collection: 'ai-pages',
          id,
        });
        return true;
      } catch {
        return false;
      }
    },

    async getPage(id) {
      try {
        const doc = await payload.findByID({
          collection: 'ai-pages',
          id,
          locale: locale,
        });

        const page = doc as {
          id: string;
          title: string;
          key: string;
          urlPath: string;
          status?: string;
          contentCluster?: string;
          rawHtmlContent?: string;
          seoTitle?: string;
          seoDescription?: string;
          seoFocusKeyword?: string;
          vibeKeywords?: string;
          emotionalTone?: string;
          motionPreset?: string;
          entranceMotion?: string;
          hoverMotion?: string;
          ambientMotion?: string;
          aiImagePrompt?: string;
          aiVideoPrompt?: string;
        };

        return {
          id: page.id,
          title: page.title,
          path: page.urlPath,
          cluster: page.contentCluster,
          status: page.status,
          html: page.rawHtmlContent,
          visualConfig: {
            vibeKeywords: page.vibeKeywords,
            emotionalTone: page.emotionalTone,
            motionPreset: page.motionPreset,
            entranceMotion: page.entranceMotion,
            hoverMotion: page.hoverMotion,
            ambientMotion: page.ambientMotion,
          },
        };
      } catch {
        return null;
      }
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsedResponseToPageData(parsed: ReturnType<typeof parseBigMindResponse>): Record<string, any> {
  return {
    title: parsed.pageMetadata.title,
    key: parsed.pageMetadata.key,
    path: parsed.pageMetadata.path,
    pageType: parsed.pageMetadata.pageType,
    template: parsed.pageMetadata.template,
    cluster: parsed.pageMetadata.cluster,
    priority: parsed.pageMetadata.priority,
    summary: parsed.pageMetadata.summary,
    seoTitle: parsed.pageMetadata.metaTitle,
    seoDescription: parsed.pageMetadata.metaDescription,
    seoFocusKeyword: parsed.pageMetadata.seoFocusKeyword,
    featuredImageUrl: parsed.pageMetadata.featuredImageUrl,
    pageIcon: parsed.pageMetadata.pageIcon,
    html: parsed.htmlContent,
    aiImagePrompt:
      parsed.aiImagePrompt || (parsed.imagePrompts.length > 0 ? parsed.imagePrompts[0].prompt : ''),
    aiVideoPrompt: parsed.aiVideoPrompt,
    designerNotes: parsed.designerNotes,
    visualPriority: parsed.visualConfig.visualPriority,
    vibeKeywords: parsed.visualConfig.vibeKeywords?.join(', '),
    emotionalTone: parsed.visualConfig.emotionalTone?.join(', '),
    animationIdeas: parsed.visualConfig.animationIdeas?.join(', '),
    motionPreset: parsed.visualConfig.motionPreset,
    entranceMotion: parsed.visualConfig.entranceMotion,
    hoverMotion: parsed.visualConfig.hoverMotion,
    ambientMotion: parsed.visualConfig.ambientMotion,
    heroSectionMotion: parsed.visualConfig.heroSectionMotion,
    contentSectionsMotion: parsed.visualConfig.contentSectionsMotion,
    cardsBoxesMotion: parsed.visualConfig.cardsBoxesMotion,
  };
}
