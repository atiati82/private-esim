import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { Pagination } from './pagination';

const meta: Meta<typeof Pagination> = {
  title: 'ui.eSIMwallet / Pagination',
  component: Pagination,
  argTypes: {
    page: {
      control: { type: 'number' },
    },
    totalPages: {
      control: { type: 'number' },
    },
    pageRange: {
      control: { type: 'number' },
    },
  },
};
export default meta;

export const Page1Of5: StoryFn<{ page: number; totalPages: number }> = () => <Pagination page={1} totalPages={5} />;

export const Page3Of10: StoryFn<{ page: number; totalPages: number }> = () => <Pagination page={3} totalPages={10} />;

export const Page5Of5: StoryFn<{ page: number; totalPages: number }> = () => <Pagination page={5} totalPages={5} />;

export const Page10Of20: StoryFn<{ page: number; totalPages: number }> = () => <Pagination page={10} totalPages={20} />;

export const Page1Of500: StoryFn<{ page: number; totalPages: number }> = () => <Pagination page={1} totalPages={500} />;

export const Page10Of500: StoryFn<{ page: number; totalPages: number }> = () => (
  <Pagination page={10} totalPages={500} />
);

export const Page500Of500: StoryFn<{ page: number; totalPages: number }> = () => (
  <Pagination page={500} totalPages={500} />
);
