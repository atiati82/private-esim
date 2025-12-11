import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { EsimWalletIcon } from '@/components/icons/esimwallet-logo';
import { DummyIcon } from '@/components/icons/IconProps';

const meta: Meta<typeof DummyIcon> = {
  title: 'ui.icons / App Icons',
  component: DummyIcon,
  argTypes: {},
  args: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const ExampleIcon: Story = {
  render: () => <EsimWalletIcon />,
};
