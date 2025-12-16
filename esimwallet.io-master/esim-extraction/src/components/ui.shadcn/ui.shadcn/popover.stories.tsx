import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui.shadcn/form/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui.shadcn/popover';
import { ScrollArea } from '@/components/ui.shadcn/scroll-area';
import { Separator } from '@/components/ui.shadcn/separator';
import { Headline } from '@/components/ui/Headline';
import { Textual } from '@/components/ui/textual';

const meta: Meta<typeof Popover> = {
  title: 'ui.shadcn / Popover',
  component: Popover,
  args: {
    defaultOpen: true,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ children, ...args }) => {
    return (
      <Popover {...args}>
        <PopoverTrigger asChild>
          <Button variant="outline">Open/Close popover</Button>
        </PopoverTrigger>
        <PopoverContent style={{ width: '16rem' }}>
          <>
            <Headline as="h3">Popover Demo</Headline>
            <Textual>Lorem ipsum dolor sit amet</Textual>
            <Separator />
            <Button variant="primary">I'm OK with that</Button>
          </>
        </PopoverContent>
      </Popover>
    );
  },
};

export const WithScrollArea: Story = {
  render: ({ children, ...args }) => {
    return (
      <Popover {...args}>
        <PopoverTrigger asChild>
          <Button variant="outline">Open/Close popover</Button>
        </PopoverTrigger>
        <PopoverContent style={{ width: '13.6rem' }}>
          <>
            <Headline as="h5">Demo with long scrollable content</Headline>
            <Separator space="s2" />
            <ScrollArea style={{ width: '12rem', height: '12rem' }}>
              <ul>
                {Array.from(Array(50)).map((v, k) => (
                  <li key={k}>List Item {k}</li>
                ))}
              </ul>
            </ScrollArea>
          </>
        </PopoverContent>
      </Popover>
    );
  },
};
