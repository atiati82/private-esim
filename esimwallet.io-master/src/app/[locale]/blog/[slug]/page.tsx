import React from 'react';
import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { findPostBySlug, updatePostMetrics } from '@/data/blog-posts';
import { siteLocales } from '@/i18n/routing';
import { RootPageParams } from '@/lib/types';
import { urlForBlogPost } from '@/lib/urls';
import { MediaDto } from '@/payload/app-types';

import { BlogPostDetail } from '@/feat-blog/blog-post-detail';

export interface BlogPostPageParams {
  locale: string;
  slug: string;
}

export interface BlogPostPageArgs {
  params: Promise<RootPageParams & BlogPostPageParams>;
}

export const generateStaticParams = async (): Promise<{ locale: string }[]> => {
  return siteLocales.map((locale) => ({ locale }));
};

export async function generateMetadata({ params }: BlogPostPageArgs): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.',
    };
  }

  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt,
    openGraph: {
      title: post.meta?.title || post.title,
      description: post?.excerpt as string,
      url: urlForBlogPost(slug),
      type: 'article',
      images: [
        {
          url:
            ((post.meta?.image as MediaDto)?.url as string) ||
            ((post.featuredImage as MediaDto)?.url as string),
          width: 800,
          height: 600,
          alt: post.meta?.title || post.title,
        },
      ],
    },
  };
}

const BlogPostPage: React.FC<BlogPostPageArgs> = async ({ params }) => {
  const { locale, slug } = await params;
  unstable_setRequestLocale(locale);

  const post = await findPostBySlug(slug);

  if (!post) {
    notFound();
  }
  await updatePostMetrics(post.slug, { views: 1 });

  return <BlogPostDetail singlePost={post} />;
};

export default BlogPostPage;
