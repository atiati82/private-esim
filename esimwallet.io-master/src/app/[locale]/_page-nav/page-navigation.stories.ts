import type { Meta, StoryObj } from '@storybook/react';

import { PageNavigation } from './page-navigation';

const meta: Meta<typeof PageNavigation> = {
  title: 'Pages / Page Navigation',
  component: PageNavigation,
  argTypes: {},
  args: {},
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
