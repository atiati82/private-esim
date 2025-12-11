import type { Meta, StoryObj } from '@storybook/react';

import { mockDestinationUAE, mockDestinationUK } from '@/testing/destinations.mock';
import { LocationCard } from './location-card';

const meta: Meta<typeof LocationCard> = {
  title: 'eSIMwallet / Destinations / Card',
  component: LocationCard,
  argTypes: {
    data: { control: 'object' },
  },
  args: {
    data: mockDestinationUK,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLongTitle: Story = {
  args: {
    data: {
      ...mockDestinationUAE,
      name: mockDestinationUAE.name + ' Lorem Ipsum Dolor Sit Amet',
    },
  },
};
