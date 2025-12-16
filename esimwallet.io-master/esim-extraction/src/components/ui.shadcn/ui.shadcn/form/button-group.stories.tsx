import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ButtonLink } from '@/navigation';

import { Button } from '@/components/ui.shadcn/form/button';
import { ButtonGroup } from '@/components/ui.shadcn/form/button-group';

const meta: Meta<typeof ButtonGroup> = {
  title: 'ui.shadcn / Button Group',
  component: ButtonGroup,
  parameters: {
    docs: {
      controls: { exclude: ['asChild'] },
    },
  },
  argTypes: {
    children: { name: 'Button Label', control: 'text' },
  },
  args: {
    children: 'Button Label',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button className="active">Button</Button>
      <ButtonLink href="">ButtonLink</ButtonLink>
      <ButtonLink href="" aria-disabled={true}>
        Disabled
      </ButtonLink>
      <Button>Another Button</Button>
    </ButtonGroup>
  ),
};

export const Wide: Story = {
  render: () => (
    <>
      <ButtonGroup style={{ width: '32rem' }}>
        <Button>Button</Button>
        <ButtonLink href="">Button Link</ButtonLink>
        <Button className="active">Another Button</Button>
      </ButtonGroup>
    </>
  ),
};
