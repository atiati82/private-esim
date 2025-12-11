import type { Meta, StoryObj } from '@storybook/react';
import { delay, http, HttpResponse } from 'msw';

import { EsimApiUrl } from '@/config';

import { DestinationsSearch } from '@/app/[locale]/(home-page-components)/destinations-search';
import { mockDestinations } from '@/testing/destinations.mock';

const meta: Meta<typeof DestinationsSearch> = {
  title: 'Private eSIM / Destinations / Search',
  component: DestinationsSearch,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const WithError: Story = {
  parameters: {
    msw: {
      handlers: {
        destinationsError: http.get(EsimApiUrl + '/destinations', () => {
          return HttpResponse.error();
        }),
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: {
        destinationsLoading: http.get(EsimApiUrl + '/destinations', () => {
          return delay('infinite');
        }),
      },
    },
  },
};

export const Default: Story = {
  parameters: {
    msw: {
      handlers: {
        destinations: http.get(EsimApiUrl + '/destinations', () => {
          return HttpResponse.json(mockDestinations);
        }),
      },
    },
  },
};
