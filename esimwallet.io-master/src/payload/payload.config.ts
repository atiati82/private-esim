import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig, type CollectionConfig, type Config, type Payload } from 'payload';
import sharp from 'sharp';

import { cmsLocales, initDevPassword, initDevUser, PayloadAdminUrl } from '@/config';
import { isDevelopment, isLocalhost } from '@/env-helpers';
import { EsimCardsCollection } from '@/esim-core/esim-cards/collection/esim-cards.collection';
import { OrderItemsCollection } from '@/esim-core/order-items/collection/order-items.collection';
import { defaultLocale } from '@/i18n/routing';
import { urlForBlogPost } from '@/lib/urls';
import { BlogPost } from '@/payload/app-types';
import {
  BlogPostCollectionId,
  EsimProvidersCollectionId,
  MediaCollectionId,
} from '@/payload/collections';
import { AiPagesCollection } from '@/payload/collections/ai-pages/ai-pages.collection';
import { BlogCategoriesCollection } from '@/payload/collections/blog/blog-categories.collection';
import { BlogPostsCollection } from '@/payload/collections/blog/blog-posts.collection';
import { BlogTagsCollection } from '@/payload/collections/blog/blog-tags.collection';
import { DestinationsCollection } from '@/payload/collections/destinations.collection';
import { EsimProductsContentCollection } from '@/payload/collections/esim-products/esim-products-content.collection';
import { EsimProductsCollection } from '@/payload/collections/esim-products/esim-products.collection';
import { EsimProvidersCollection } from '@/payload/collections/esim-providers.collection';
import { MediaCollection } from '@/payload/collections/media.collection';
import { RegionsCollection } from '@/payload/collections/regions.collection';
import { UsersCollection } from '@/payload/collections/users/users.collection';
import { getEmailAdapter } from '@/payload/utils/email-transport';
import { lexicalEditorConfig } from '@/payload/utils/lexical-config';

import { TransactionsCollection } from '@/feat-ordering/transactions/collection/transactions.collection';

const payloadConfig: Config = {
  secret: process.env.PAYLOAD_SECRET || '',
  cookiePrefix: 'PrivateESIM',
  serverURL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  csrf: [
    // `config.serverURL` is added by default
    'https://checkout.stripe.com',
  ],
  cors: [process.env.NEXT_PUBLIC_WEBSITE_URL ?? '', 'https://checkout.stripe.com'],
  debug: true,
  admin: {
    user: UsersCollection.slug,
    avatar: 'gravatar',
    autoLogin:
      isDevelopment && isLocalhost
        ? { email: initDevUser, password: initDevPassword, prefillOnly: true }
        : false,
    livePreview: {
      url: process.env.NEXT_PUBLIC_WEBSITE_URL || '',
      collections: [BlogPostCollectionId],
    },
    importMap: {
      baseDir: path.resolve(path.dirname('src')),
      autoGenerate: false,
    },
    theme: 'dark',
    css: path.resolve(path.dirname('src'), 'payload/admin/custom.css'),
  },
  collections: [
    // Group: Default
    UsersCollection,
    // Group: Private eSIM
    EsimCardsCollection,
    OrderItemsCollection,
    TransactionsCollection,
    // Group: eSIM Products,
    EsimProductsCollection,
    DestinationsCollection,
    RegionsCollection,
    EsimProvidersCollection,
    // Group: Content
    MediaCollection,
    BlogPostsCollection,
    BlogCategoriesCollection,
    BlogTagsCollection,
    // Group: AI CMS
    AiPagesCollection,
  ],
  globals: [EsimProductsContentCollection],
  routes: {
    admin: PayloadAdminUrl,
    api: '/api',
  },
  localization: { locales: cmsLocales, defaultLocale: defaultLocale, fallback: true },
  editor: lexicalEditorConfig(),
  plugins: [
    vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      enabled: !process.env.TEST && !!process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_READ_WRITE_TOKEN !== 'vercel_blob_rw_STOREID_STOREKEY',
      collections: {
        [MediaCollectionId]: {
          prefix: MediaCollectionId,
          disableLocalStorage: false,
        },
        [EsimProvidersCollectionId]: {
          prefix: EsimProvidersCollectionId,
          disableLocalStorage: false,
        },
      },
    }),
    seoPlugin({
      collections: [BlogPostCollectionId],
      uploadsCollection: MediaCollectionId,
      tabbedUI: true,
      interfaceName: 'SeoMetaData',
      generateTitle: ({ doc }: { doc: BlogPost }) => `${doc.title} | Private eSIM`,
      generateDescription: ({ doc }: { doc: BlogPost }) => `${doc.excerpt}`,
      generateImage: ({ doc }: { doc: BlogPost }) => `${doc.featuredImage}`,
      generateURL: ({ doc }: { doc: BlogPost }) => urlForBlogPost(doc.slug),
    }),
  ],
  email: getEmailAdapter(),
  sharp,
  typescript: {
    outputFile: path.resolve(path.dirname('./'), './src/payload/app-types.ts'),
  },
  graphQL: { disable: true },
  db: mongooseAdapter({
    url: process.env.PAYLOAD_DATABASE_URI || '',
  }),
  onInit: async (_: Payload): Promise<void> => {},

  jobs: {
    jobsCollectionOverrides: (args: {
      defaultJobsCollection: CollectionConfig;
    }): CollectionConfig => {
      console.log('payload.config: JOBS COLLECTION:', args);
      return args.defaultJobsCollection;
    },
    deleteJobOnComplete: false,
    tasks: [],
    workflows: [],
  },
};

export default buildConfig(payloadConfig);
