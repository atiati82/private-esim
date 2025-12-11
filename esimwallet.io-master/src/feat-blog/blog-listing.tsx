import React from 'react';

import { BlogPost } from '@/payload/app-types';

import { HeadlineHero } from '@/components/ui/headline-hero';
import { Pagination } from '@/components/ui/pagination';
import { BlogCard } from './blog-card';
import * as styles from './blog-listing.css';

interface BlogListingProps {
  page: number;
  docs: BlogPost[];
  totalPages: number;
}

const BlogListing: React.FC<BlogListingProps> = ({ page, docs, totalPages }) => {
  return (
    <div>
      <HeadlineHero
        title="Private eSIM Blog"
        subtitle="We are available through multiple channels."
        tip="We're here to help and answer any questions you may have."
      />
      <div className={styles.blogListingContainer}>
        {docs.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};

export default BlogListing;
