import type { Meta, StoryObj } from '@storybook/react';

import { ProductDestinationsToggle } from '@/feat-product-mini/product-destinations-toggle';
import { mockDestinationUK } from '@/testing/destinations.mock';
import { mockProductEsimUk, mockProductEsimUk2 } from '@/testing/products.mock';
import { mockRegionEurope } from '@/testing/regions.mock';

const meta: Meta<typeof ProductDestinationsToggle> = {
  title: 'eSIMwallet / Destinations / Destinations Toggle',
  component: ProductDestinationsToggle,
  argTypes: {},
  args: {
    product: mockProductEsimUk,
    currentLocation: mockDestinationUK,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const WithDestination: Story = {};
export const WithDestinations: Story = {
  args: {
    ...meta.args,
    product: mockProductEsimUk2,
  },
};
export const WithDestinationDetailsView: Story = {
  args: {
    ...meta.args,
    isDetailsView: true,
  },
};
export const WithDestinationsDetailsView: Story = {
  args: {
    ...meta.args,
    product: mockProductEsimUk2,
    isDetailsView: true,
  },
};

export const WithRegion: Story = {
  args: {
    ...meta.args,
    currentLocation: mockRegionEurope,
  },
};
export const WithRegion2: Story = {
  args: {
    ...meta.args,
    product: mockProductEsimUk2,
    currentLocation: mockRegionEurope,
  },
};
export const WithRegionDetailsView: Story = {
  args: {
    ...meta.args,
    currentLocation: mockRegionEurope,
    isDetailsView: true,
  },
};
export const WithRegion2DetailsView: Story = {
  args: {
    ...meta.args,
    product: mockProductEsimUk2,
    currentLocation: mockRegionEurope,
    isDetailsView: true,
  },
};

export const Global: Story = {
  args: {
    ...meta.args,
    currentLocation: undefined,
  },
};
export const Globals: Story = {
  args: {
    ...Global.args,
    product: mockProductEsimUk2,
  },
};
export const GlobalDetailsView: Story = {
  args: {
    ...Global.args,
    isDetailsView: true,
  },
};
export const GlobalsDetailsView: Story = {
  args: {
    ...Global.args,
    product: mockProductEsimUk2,
    isDetailsView: true,
  },
};
