import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { MediaDto } from '@/payload/app-types';

import { mockPost } from '@/testing/blog-posts.mock';
import { BlogCard } from './blog-card';

const meta: Meta<typeof BlogCard> = {
  title: 'ESIMWALLET/Blog/BlogCard',
  component: BlogCard,
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: ['gallery', 'regular'],
      },
      table: { defaultValue: { summary: 'gallery' } },
    },
    className: {
      control: {
        type: 'text',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const VariantGallery: Story = {
  args: {
    post: mockPost,
    variant: 'gallery',
  },
};

export const VariantGalleryImagePlaceholder: Story = {
  args: {
    post: { ...mockPost, featuredImage: { ...(mockPost.featuredImage as MediaDto), url: '' } },
    variant: 'gallery',
  },
};

export const VariantRegular: Story = {
  args: {
    post: mockPost,
    variant: 'regular',
  },
};

export const VariantRegularImagePlaceholder: Story = {
  args: {
    post: { ...mockPost, featuredImage: { ...(mockPost.featuredImage as MediaDto), url: '' } },
    variant: 'regular',
  },
};
