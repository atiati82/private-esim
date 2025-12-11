'use client';

import React from 'react';
import Image from 'next/image';
import { useLivePreview } from '@payloadcms/live-preview-react';

import { BlogPost, MediaDto } from '@/payload/app-types';

import { Headline } from '@/components/ui/Headline';
import { RichText } from '@/components/ui/rich-text';
import * as styles from './blog-post-detail.css';
import { BlogPostInfo } from './blog-post-info';

interface BlogPostPreviewProps {
  singlePost: BlogPost;
}

export const BlogPostDetailPreview: React.FC<BlogPostPreviewProps> = ({
  singlePost: initialData,
}) => {
  const { data } = useLivePreview<BlogPost>({
    initialData: initialData,
    serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.NEXT_PUBLIC_WEBSITE_URL || '',
    depth: 2,
    apiRoute: '/api-cms',
  });
  return (
    <div className={styles.blogPostContainer}>
      <div className={styles.blogPostFeaturedImage}>
        <Image
          style={{ objectFit: 'cover' }}
          fill={true}
          src={(data.featuredImage as MediaDto)?.url || ''}
          alt={data.title}
          unoptimized
        />
      </div>
      <Headline like="h1-small" className={styles.blogPostTitle}>
        {data?.title}
      </Headline>
      <div className={styles.blogPostSection}>
        <div className={styles.blogPostMainSection}>
          <BlogPostInfo data={data} />
          <RichText content={data?.content} className={styles.blogPostMainContent} />
        </div>
      </div>
    </div>
  );
};
