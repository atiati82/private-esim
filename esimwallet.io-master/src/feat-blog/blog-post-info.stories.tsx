import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { BlogPost, UserDto } from '@/payload/app-types';

import { mockPost } from '@/testing/blog-posts.mock';
import { BlogPostInfo } from './blog-post-info';

const meta: Meta<typeof BlogPostInfo> = {
  title: 'ESIMWALLET/Blog/BlogPostInfo/BlogPostInfo',
  component: BlogPostInfo,
  argTypes: {
    data: {
      control: 'object',
      description: 'The blog post data to display',
    },
  },
};
export default meta;

type Story = StoryFn<{ data: BlogPost }>;

export const Default: Story = (args) => <BlogPostInfo {...args} />;
Default.args = {
  data: mockPost,
};

export const WithoutAuthorName: Story = (args) => <BlogPostInfo {...args} />;
WithoutAuthorName.args = {
  data: {
    ...mockPost,
    author: {
      ...(mockPost.author as UserDto),
      fullName: null,
    },
  },
};

export const WithoutAuthorImage: Story = (args) => <BlogPostInfo {...args} />;
WithoutAuthorImage.args = {
  data: {
    ...mockPost,
    author: {
      ...(mockPost.author as UserDto),
    },
  },
};
