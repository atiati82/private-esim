import React from 'react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { cn } from '@/lib/utils';
import { ButtonLink } from '@/navigation';

import { Button } from '@/components/ui.shadcn/form/button';
import { Textual } from '@/components/ui/textual';
import { spaceBetween } from '@/styles/layout.css';

const meta: Meta<typeof Button> = {
  title: 'ui.shadcn / Button(Link)',
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['asChild'] },
    },
  },
  argTypes: {
    children: { name: 'Button Label', control: 'text' },
    asChild: { table: { disable: true } },
  },
  args: {
    children: 'Button Label',
    onClick: action('on-click'),
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className={cn(spaceBetween.x.s1, spaceBetween.y.s1)}>
      <Button>Default Button</Button>
      <Button disabled={true}>Disabled Button</Button>
      <ButtonLink href="">Default ButtonLink</ButtonLink>
      <ButtonLink href="" aria-disabled={true}>
        Disabled ButtonLink
      </ButtonLink>

      <Button variant="secondary">Secondary Button</Button>
      <Button variant="secondary" disabled={true}>
        Disabled Secondary
      </Button>
      <ButtonLink variant="secondary" href="#">
        Secondary ButtonLink
      </ButtonLink>

      <Button variant="destructive">Destructive Button</Button>
      <ButtonLink variant="destructive" href="#">
        Destructive ButtonLink
      </ButtonLink>
      <ButtonLink variant="destructive" href="#" aria-disabled={true}>
        Disabled Destructive
      </ButtonLink>

      <Button variant="outline">Outline Button</Button>
      <Button variant="outline">Disabled Outline</Button>
      <ButtonLink variant="outline" href="#">
        Outline Button
      </ButtonLink>

      <Button variant="ghost">Ghost Button</Button>
      <Button variant="ghost" disabled={true}>
        Disabled Ghost
      </Button>
      <ButtonLink variant="ghost" href="#">
        Ghost ButtonLink
      </ButtonLink>
      <Button variant="link">Link Button</Button>
      <Button variant="link" disabled={true}>
        Disabled Link
      </Button>
      <ButtonLink variant="link" href="#">
        Link ButtonLink
      </ButtonLink>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <>
      <Button size="tiny">Tiny Button</Button>
      <Button size="sm">Small Button</Button>
      <Button size="toolbar">Toolbar Button</Button>
      <Button>Default Button</Button>
      <Button size="lg">Large Button</Button>
      <Button size="cta">CTA Button</Button>
    </>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <>
      <Button isLoading={true} size="tiny">
        Tiny Button
      </Button>
      <Button isLoading={true} size="sm">
        Small Button
      </Button>
      <Button isLoading={true} size="toolbar">
        Toolbar Button
      </Button>
      <Button isLoading={true}>Default Button</Button>
      <Button isLoading={true} size="lg">
        Large Button
      </Button>
      <Button isLoading={true} size="cta">
        CTA Button
      </Button>
    </>
  ),
};

export const TinyInsideText: Story = {
  render: () => (
    <div>
      <Textual>
        Lorem ipsum dolor sit amet,{' '}
        <Button size="tiny" variant="secondary">
          Tiny Action Button
        </Button>{' '}
        consectetur adipiscing elit. Donec placerat, justo ac varius posuere, libero augue rhoncus
        erat, nec hendrerit purus nibh eu tellus. Donec tristique enim vel sem rhoncus{' '}
        <Button size="tiny">Tiny Action Button</Button> faucibus.{' '}
        <Button size="tiny" variant="link">
          Nullam dapibus
        </Button>{' '}
        lacus porta massa{' '}
        <Button size="tiny" variant="outline">
          malesuada auctor
        </Button>
        . Mauris placerat scelerisque dolor, vitae tempus dolor feugiat in. Pellentesque molestie
        felis orci, id fringilla justo imperdiet nec. Aenean ut tincidunt elit.{' '}
        <Button size="tiny" variant="destructive">
          Donec lectus dui
        </Button>{' '}
        congue vitae consectetur ut, aliquam a neque.
      </Textual>
    </div>
  ),
};
