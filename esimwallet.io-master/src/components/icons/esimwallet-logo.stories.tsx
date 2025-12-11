import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { EsimWalletIcon, EsimWalletLogo } from '@/components/icons/esimwallet-logo';
import { DummyIcon } from '@/components/icons/IconProps';

const meta: Meta<typeof DummyIcon> = {
  title: 'Logo',
  component: EsimWalletLogo,
  argTypes: {},
  args: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const JustAnIcon: Story = {
  render: () => <EsimWalletIcon />,
};
