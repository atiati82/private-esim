import React, { JSX } from 'react';
import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';

import { findPosts } from '@/data/blog-posts';
import { siteLocales } from '@/i18n/routing';
import { RootPageParams } from '@/lib/types';

import BlogListing from '@/feat-blog/blog-listing';

interface BlogPageParams {
  locale: string;
}

interface BlogPageArgs {
  params: Promise<RootPageParams & BlogPageParams>;
  searchParams: Promise<{ page?: string }>;
}

export const generateStaticParams = async (): Promise<{ locale: string }[]> => {
  return siteLocales.map((locale) => ({ locale }));
};

export const metadata: Metadata = {
  title: 'Blog | Private eSIM',
  description:
    "We're here to help and answer any questions you may have, We are available through multiple channels.",
};

const BlogListingPage = async ({ params, searchParams }: BlogPageArgs): Promise<JSX.Element> => {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  // Fetch posts data directly within the component
  const { docs, totalPages } = await findPosts(page, 8);

  return <BlogListing page={page} docs={docs} totalPages={totalPages} />;
};

export default BlogListingPage;
