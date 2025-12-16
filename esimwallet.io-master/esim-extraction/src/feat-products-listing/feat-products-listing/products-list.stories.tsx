import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ProductsList } from '@/feat-products-listing/products-list';
import { mockDestinationUK } from '@/testing/destinations.mock';
import {
  mockProductDefaultEsimVoiceKyc,
  mockProductEsimUk,
  mockProductEsimUk2,
  mockProductTopUp,
} from '@/testing/products.mock';

const meta: Meta<typeof ProductsList> = {
  title: 'Private eSIM / Products / Products List',
  component: ProductsList,
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {},
  args: {
    location: mockDestinationUK,
    products: [
      { ...mockProductEsimUk, id: 'id-1' },
      { ...mockProductEsimUk, id: 'id-2' },
      { ...mockProductEsimUk, id: 'id-3' },
      mockProductEsimUk2,
      mockProductTopUp,
      mockProductDefaultEsimVoiceKyc,
    ],
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GlobalList: Story = {
  args: {
    ...meta.args,
    location: undefined,
  },
};
