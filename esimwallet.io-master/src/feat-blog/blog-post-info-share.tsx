'use client';

import React from 'react';
import Image from 'next/image';

import { urlForBlogPost } from '@/lib/urls';
import { BlogPost } from '@/payload/app-types';

import { Button } from '@/components/ui.shadcn/form/button';
import * as styles from './blog-post-info-share.css';

interface BlogPostInfoShareProps {
  url?: string;
  data?: BlogPost;
}

const socialMediaLinks = [
  {
    name: 'LinkedIn',
    image: '/images/socials/linkedin.svg',
    shareUrl: 'https://www.linkedin.com/shareArticle?url=',
  },
  {
    name: 'Facebook',
    image: '/images/socials/facebook.svg',
    shareUrl: 'https://www.facebook.com/share.php?u=',
  },
  {
    name: 'X',
    image: '/images/socials/x.svg',
    shareUrl: 'https://x.com/intent/post?url=',
  },
  {
    name: 'WhatsApp',
    image: '/images/socials/whatsapp.svg',
    shareUrl: 'https://web.whatsapp.com/send?text=',
  },
];

export const BlogPostInfoShare: React.FC<BlogPostInfoShareProps> = ({ url, data }) => {
  const currentUrl = url || urlForBlogPost(data?.slug || '');

  const handleShare = async (shareUrl: string): Promise<void> => {
    const popupWidth = 600;
    const popupHeight = 400;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;
    window.open(
      shareUrl,
      'popup',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`,
    );
  };
  return (
    <div className={styles.blogPostInfoShareContainer}>
      {socialMediaLinks.map((social, index) => (
        <Button
          className={styles.blogPostInfoShareButton}
          key={index}
          title={`Share on ${social.name}`}
          variant="ghost"
          onClick={() => handleShare(`${social.shareUrl}${encodeURIComponent(currentUrl)}`)}
        >
          <Image
            className={styles.blogPostInfoShareIcon}
            src={social.image}
            alt={`Share on ${social.name}`}
            width={24}
            height={24}
          />
        </Button>
      ))}
    </div>
  );
};
