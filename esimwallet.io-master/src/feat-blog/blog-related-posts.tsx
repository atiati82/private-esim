import React from 'react';
import { BookOpenText } from 'lucide-react';

import { findRelatedPosts } from '@/data/blog-posts';
import { BlogPost } from '@/payload/app-types';

import { Headline } from '@/components/ui/Headline';
import { BlogCard } from './blog-card';
import * as styles from './blog-listing.css';

interface BlogRelatedPostsProps {
  currentPostSlug: string;
  blogTags: string[];
  blogCategories: string[];
  limit?: number;
  page?: number;
}
export const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = async ({
  currentPostSlug,
  blogTags,
  blogCategories,
  limit = 3,
  page = 1,
}) => {
  const posts = await findRelatedPosts({
    currentPostSlug,
    blogTags,
    blogCategories,
    limit,
    page,
  });

  return (
    <div>
      <div className={styles.blogListingTitleContainer}>
        <BookOpenText size={24} />
        <Headline like="h2-large" className={styles.blogListingTitle}>
          More articles that may interest you
        </Headline>
      </div>
      <div className={styles.blogListingContainer}>
        {posts.docs.map((post: BlogPost) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};
