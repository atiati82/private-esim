import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Separator } from '@/components/ui.shadcn/separator';

const meta: Meta<typeof Separator> = {
  title: 'ui.shadcn / Separator',
  component: Separator,
  argTypes: {
    space: { options: ['xs', 'sm', 'md', 'lg', 'xl'], control: 'radio' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div>
      <div>Private eSIM is the best and it's here to stay.</div>
      <Separator space={args.space} />
      <div style={{ display: 'flex', height: 20, alignItems: 'center' }}>
        <div>Blog</div>
        <Separator orientation="vertical" space={args.space} />
        <div>Docs</div>
        <Separator orientation="vertical" space={args.space} />
        <div>Source</div>
      </div>
    </div>
  ),
};
