import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';

const meta: Meta<typeof Headline> = {
  title: 'Headlines',
  component: Headline,
  argTypes: {
    children: { name: 'Content' },
    accent: { description: 'Use accent color for the headline' },
    like: { description: 'Override the look of the Headline to be like a different Hx' },
  },
  args: {
    children: 'Headline Lorem ipsum dolor sit amet',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllHeadlines: Story = {
  render: () => (
    <div>
      <Textual variant="lead">All headlines together:</Textual>

      <Headline like="h1-large">H1-large Lorem Ipsum Dolor</Headline>
      <Headline>H1 Lorem Ipsum Dolor</Headline>
      <Headline like="h1-small">H1-small Lorem Ipsum Dolor</Headline>

      <Headline as="h2" like="h2-large">
        H2-large Lorem Ipsum Dolor
      </Headline>
      <Headline as="h2">H2 Lorem Ipsum Dolor</Headline>
      <Headline as="h2" like="h2-small">
        H2-small Lorem Ipsum Dolor
      </Headline>

      <Headline as="h3">H3 Lorem Ipsum Dolor</Headline>
      <Headline as="h4">H4 Lorem Ipsum Dolor</Headline>
      <Headline as="h5">H5 Lorem Ipsum Dolor</Headline>
      <Headline as="h6" like="h6-large">
        H6 Large Lorem Ipsum Dolor
      </Headline>
      <Headline as="h6">H6 Lorem Ipsum Dolor</Headline>
    </div>
  ),
};
