import React from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { findPostBySlug } from '@/data/blog-posts';
import { siteLocales } from '@/i18n/routing';
import { RootPageParams } from '@/lib/types';

import { BlogPostDetailPreview } from '@/feat-blog/blog-post-detail-preview';

export interface BlogPostPreviewPageParams {
  locale: string;
  slug: string;
}

export interface BlogPostPreviewPageArgs {
  params: Promise<RootPageParams & BlogPostPreviewPageParams>;
}

export const generateStaticParams = async (): Promise<{ locale: string }[]> => {
  return siteLocales.map((locale) => ({ locale }));
};

const BlogPostPreviewPage: React.FC<BlogPostPreviewPageArgs> = async ({ params }) => {
  const { locale, slug } = await params;
  unstable_setRequestLocale(locale);

  const post = await findPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostDetailPreview singlePost={post} />;
};

export default BlogPostPreviewPage;
