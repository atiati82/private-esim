import type { Meta, StoryObj } from '@storybook/react';

import { HomePageBitsAndPieces } from '@/app/[locale]/(home-page-components)/HomePageBitsAndPieces';

const meta: Meta<typeof HomePageBitsAndPieces> = {
  title: 'Pages / Page HomePageBitsAndPieces',
  component: HomePageBitsAndPieces,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
