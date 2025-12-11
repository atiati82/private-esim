import type { Meta, StoryObj } from '@storybook/react';

import { Footer } from './footer';

const meta: Meta<typeof Footer> = {
  title: 'Pages / Page Footer',
  component: Footer,
  argTypes: {},
  args: {},
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
