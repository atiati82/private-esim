import React from 'react';

import { findTopPosts } from '@/data/blog-posts';
import { BlogPost } from '@/payload/app-types';

import { Headline } from '@/components/ui/Headline';
import { BlogCard } from './blog-card';
import * as styles from './blog-top-posts.css';

interface BlogTopPostsProps {
  currentPostSlug?: string;
  limit?: number;
}
export const BlogTopPosts: React.FC<BlogTopPostsProps> = async ({ currentPostSlug, limit }) => {
  const posts = await findTopPosts('metricsTopPostScore', currentPostSlug, limit);

  return (
    <div className={styles.blogTopPostContainer}>
      <Headline like="h2">Top Articles</Headline>
      <div className={styles.blogTopPostContent}>
        {posts.map((post: BlogPost) => (
          <BlogCard key={post.slug} post={post} variant="regular" />
        ))}
      </div>
    </div>
  );
};
