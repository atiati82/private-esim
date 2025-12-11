import React from 'react';
import Image from 'next/image';

import { BlogPost, MediaDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';

import { Headline } from '@/components/ui/Headline';
import { RichText } from '@/components/ui/rich-text';
import * as styles from './blog-post-detail.css';
import { BlogPostInfo } from './blog-post-info';
import { BlogRelatedPosts } from './blog-related-posts';
import { BlogTopPosts } from './blog-top-posts';

interface BlogPostProps {
  singlePost: BlogPost;
}

export const BlogPostDetail: React.FC<BlogPostProps> = ({ singlePost: data }) => {
  const tags = data.tags?.map((tag) => getRelationIdVal(tag)!) || [];
  const categories = data.categories?.map((cat) => getRelationIdVal(cat)!) || [];

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
        <div className={styles.blogPostSideSection}>
          <BlogTopPosts currentPostSlug={data.slug} />
        </div>
      </div>
      <BlogRelatedPosts
        currentPostSlug={data.slug}
        blogTags={tags}
        blogCategories={categories}
        limit={3}
      />
    </div>
  );
};
