import React from 'react';

import { findPosts } from '@/data/blog-posts';

import { HeadlineHero } from '@/components/ui/headline-hero';
import { BlogCard } from '@/feat-blog/blog-card';
import { pageContainer } from '@/styles/layout.css';
import * as styles from './latest-posts.css';

export const LatestPosts: React.FC = async () => {
  const { docs } = await findPosts(1, 3);

  return (
    <section className={styles.latestPostsSection}>
      <div className={pageContainer}>
        <HeadlineHero className={styles.headlineContainer} title="Latest Posts" />
        <div className={styles.latestPostsContainer}>
          {docs.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};
