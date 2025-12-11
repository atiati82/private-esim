import type { Meta, StoryObj } from '@storybook/react';

import { Loader } from '@/components/ui/loader';

const meta: Meta<typeof Loader> = {
  title: 'ui.Private eSIM / Loader',
  component: Loader,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
