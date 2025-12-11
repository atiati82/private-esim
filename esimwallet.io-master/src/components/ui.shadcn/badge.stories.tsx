import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui.shadcn/badge';
import { Textual } from '@/components/ui/textual';
import { spaceBetween } from '@/styles/layout.css';

const meta: Meta<typeof Badge> = {
  title: 'ui.shadcn / Badge',
  component: Badge,
  argTypes: {
    children: { name: 'Content', control: 'text' },
  },
  args: {
    children: 'Badge Text',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className={cn(spaceBetween.x.s1, spaceBetween.y.s1)}>
      <Badge>Default Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
};

export const TinyInsideText: Story = {
  render: () => (
    <div>
      <Textual>
        Lorem ipsum dolor sit amet, <Badge>Badge</Badge> consectetur adipiscing elit. Donec
        placerat, justo ac varius posuere, libero augue rhoncus erat, nec hendrerit purus nibh eu
        tellus. Donec tristique enim vel sem rhoncus{' '}
      </Textual>
    </div>
  ),
};
