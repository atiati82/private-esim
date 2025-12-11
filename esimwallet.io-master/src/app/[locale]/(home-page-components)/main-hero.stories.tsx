import type { Meta, StoryObj } from '@storybook/react';

import { MainHero } from './main-hero';

const meta: Meta<typeof MainHero> = {
  title: 'Pages / Page Hero',
  component: MainHero,
  argTypes: {},
  args: {},
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
