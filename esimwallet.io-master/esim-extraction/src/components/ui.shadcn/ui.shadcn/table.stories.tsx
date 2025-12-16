import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Table } from '@/components/ui.shadcn/table';
import { DataTableDemo, TableProseDemo } from '@/components/ui.shadcn/table-demo';
import { CartDataTable } from '@/feat-cart/cart-data-table';
import { prose } from '@/styles/typography.css';
import { mockCartItemsDummy } from '@/testing/cart.mock';

const meta: Meta<typeof Table> = {
  title: 'ui.shadcn / Table',
  component: Table,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DataTableDemo />,
};

export const Bordered: Story = {
  render: () => <DataTableDemo tableVariant="bordered" />,
};

export const CartTable: Story = {
  render: () => <CartDataTable cartData={mockCartItemsDummy} />,
};

export const ClassicTableFromProseStyles: Story = {
  render: () => (
    <div className={prose}>
      <TableProseDemo />
    </div>
  ),
};
