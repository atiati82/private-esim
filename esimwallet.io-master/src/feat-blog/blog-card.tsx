import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { urlForBlogPost } from '@/lib/urls';
import { BlogPost, MediaDto } from '@/payload/app-types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui.shadcn/card';
import * as styles from './blog-card.css';

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
  variant?: 'gallery' | 'regular';
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, variant = 'gallery' }) => {
  return (
    <Link href={urlForBlogPost(post.slug)} data-testid="listing-blog-card">
      <Card className={styles.blogCard({ variant })}>
        <CardContent className={styles.blogCardContent({ variant })}>
          <Image
            className={styles.blogCardImage({ variant })}
            src={(post.featuredImage as MediaDto)?.url || ''}
            alt={post.title}
            fill={true}
            unoptimized
          />
        </CardContent>
        <CardHeader className={styles.blogCardInfo({ variant })}>
          <CardTitle className={styles.blogCardTitle}>{post.title}</CardTitle>
          <p className={styles.blogCardSeeMore}>
            See More <ArrowRight size={16} />
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
};
