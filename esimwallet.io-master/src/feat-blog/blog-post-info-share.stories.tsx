import { Meta, StoryObj } from '@storybook/react';

import { BlogPostInfoShare } from './blog-post-info-share';

export default {
  title: 'ESIMWALLET/Blog/BlogPostInfo/BlogPostInfoShare',
  component: BlogPostInfoShare,
  argTypes: {
    url: {
      control: 'text',
      description: 'The URL to share. If not provided, uses the current path.',
      table: {
        defaultValue: {
          summary: 'curent path',
        },
      },
    },
  },
} as Meta;

type Story = StoryObj<typeof BlogPostInfoShare>;

export const Default: Story = {
  args: {
    url: undefined,
  },
};

export const WithUrl: Story = {
  args: {
    url: 'https://localhost:3000/blog/example-post?utm_source=facebook&other=query',
  },
};
