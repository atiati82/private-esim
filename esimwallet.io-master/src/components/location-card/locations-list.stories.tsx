import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { EsimProduct } from '@/data/esim-product';

import { LocationsList } from '@/components/location-card/locations-list';
import { ProductDestinationsToggle } from '@/feat-product-mini/product-destinations-toggle';
import { containerWithBorder } from '@/styles/layout.css';
import { mockDestinations, mockDestinationSe } from '@/testing/destinations.mock';
import { mockProductEsimUk2 } from '@/testing/products.mock';

const meta: Meta<typeof LocationsList> = {
  title: 'eSIMwallet / Destinations / Locations List',
  component: LocationsList,
  args: {
    dataItems: mockDestinations,
    className: containerWithBorder,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const CommandListDefault: Story = {};

export const CommandListMini: Story = {
  args: {
    ...meta.args,
    variant: 'mini',
  },
};

const productWithManyDestinations: EsimProduct = {
  ...mockProductEsimUk2,
};

export const MiniInPopoverToggle: Story = {
  render: () => {
    return (
      <ProductDestinationsToggle
        product={productWithManyDestinations}
        currentLocation={mockDestinationSe}
      />
    );
  },
};
