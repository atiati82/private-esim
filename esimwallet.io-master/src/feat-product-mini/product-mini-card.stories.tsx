import type { Meta, StoryObj } from '@storybook/react';

import { EsimPlanType } from '@/data/esim-product';

import { ProductMiniCard } from '@/feat-product-mini/product-mini-card';
import { mockDestinationUK, mockDestinationUSA } from '@/testing/destinations.mock';
import { mockProductEsimUk, mockProductEsimUk2 } from '@/testing/products.mock';
import { mockRegionEurope } from '@/testing/regions.mock';

const meta: Meta<typeof ProductMiniCard> = {
  title: 'eSIMwallet / Products / Product Mini Card',
  component: ProductMiniCard,
  argTypes: {},
  args: {
    location: mockDestinationUK,
    product: mockProductEsimUk2,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DetailsViewVariant: Story = {
  args: {
    isDetailsView: true,
  },
};

export const VoiceAndData: Story = {
  args: {
    location: mockDestinationUK,
    product: {
      ...mockProductEsimUk,
      planType: EsimPlanType.VoiceAndData,
      planVoiceAllowance: 123,
    },
  },
};

export const VoiceOnly: Story = {
  args: {
    location: mockDestinationUSA,
    product: {
      ...mockProductEsimUk2,
      planType: EsimPlanType.VoiceOnly,
      planDataAllowance: 0,
      planVoiceAllowance: 123,
    },
  },
};

export const RegionCard: Story = {
  args: {
    location: mockRegionEurope,
    product: mockProductEsimUk2,
  },
};

export const GlobalCardNoLocation: Story = {
  args: {
    location: undefined,
    product: mockProductEsimUk2,
  },
};
