import React from 'react';
import { User } from 'lucide-react';

import { BlogPost, UserDto } from '@/payload/app-types';

import { Avatar, AvatarFallback } from '@/components/ui.shadcn/avatar';
import { BlogPostInfoShare } from './blog-post-info-share';
import * as styles from './blog-post-info.css';

interface BlogPostInfoProps {
  data: BlogPost;
}
export const BlogPostInfo: React.FC<BlogPostInfoProps> = ({ data }) => {
  return (
    <div className={styles.blogPostInfoContainer}>
      <div className={styles.blogPostInfoSection}>
        <div className={styles.blogPostInfoAuthorContent}>
          <Avatar>
            {/* {data.author && <AvatarImage src={'gravatar'} />} */}
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <p>{(data?.author as UserDto)?.fullName || 'Private eSIM'}</p>
        </div>
        <p>
          Article Release Date:&nbsp;
          {data?.publishedDate
            ? new Date(data.publishedDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : 'Date not available'}
        </p>
      </div>
      <div className={styles.blogPostInfoSection}>
        <p style={{ textWrap: 'nowrap' }}>Share On</p>
        <BlogPostInfoShare data={data} />
      </div>
    </div>
  );
};
