import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { useAppDispatch } from '@/data-store/store-hooks';

import { CartDataTable } from '@/feat-cart/cart-data-table';
import { CartPage } from '@/feat-cart/cart-page';
import { resetCartAction } from '@/feat-cart/cart.store';
import { mockCartItemsDummy } from '@/testing/cart.mock';

const meta: Meta<typeof CartPage> = {
  title: 'Pages / Cart Page',
  component: CartPage,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const dispatch = useAppDispatch();
    dispatch(resetCartAction(mockCartItemsDummy));
    return <CartPage />;
  },
};

export const EmptyCart: Story = {
  render: () => <CartDataTable cartData={[]} />,
};
