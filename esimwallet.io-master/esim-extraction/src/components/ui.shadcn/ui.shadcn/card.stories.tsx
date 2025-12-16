import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from '@/components/ui.shadcn/card';
import { Button } from '@/components/ui.shadcn/form/button';
import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { Textual } from '@/components/ui/textual';

const meta: Meta<typeof Card> = {
  title: 'ui.shadcn / Card',
  component: Card,
  argTypes: {},
  args: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardSubtitle>Card Description</CardSubtitle>
      </CardHeader>
      <CardContent>
        <Textual>Lorem Ipsum dolor sit amet. Tra la la.</Textual>
      </CardContent>
    </Card>
  ),
};

export const CardWithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>CardContent: Lorem Ipsum dolor sit amet. Tra la la.</CardContent>
      <CardFooter className="flex justify-between">
        Footer Content: Lorem Ipsum dolor sit amet. Tra la la.
      </CardFooter>
    </Card>
  ),
};

export const CardWithContent: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>TopUp World DayPass</CardTitle>
        <CardSubtitle>Data Only eSIM</CardSubtitle>
      </CardHeader>
      <CardContent>
        <Textual>Lorem Ipsum dolor sit amet. Tra la la.</Textual>
      </CardContent>
      <CardFooter>
        <CurrencyFormatter amount={69} />
        <Button>ADD TO CART</Button>
      </CardFooter>
    </Card>
  ),
};

export const CardVariantModal: Story = {
  render: () => (
    <Card variant="modal">
      <CardHeader>
        <CardTitle>TopUp World DayPass</CardTitle>
        <CardSubtitle>Data Only eSIM</CardSubtitle>
      </CardHeader>
      <CardContent>
        <Textual>Lorem Ipsum dolor sit amet. Tra la la.</Textual>
      </CardContent>
      <CardFooter>
        <CurrencyFormatter amount={69} />
        <Button>ADD TO CART</Button>
      </CardFooter>
    </Card>
  ),
};

export const CardVariantModalGrey: Story = {
  render: () => (
    <Card variant="modal-grey">
      <CardHeader>
        <CardTitle>TopUp World DayPass</CardTitle>
        <CardSubtitle>Data Only eSIM</CardSubtitle>
      </CardHeader>
      <CardContent>
        <Textual>Lorem Ipsum dolor sit amet. Tra la la.</Textual>
      </CardContent>
      <CardFooter>
        <CurrencyFormatter amount={69} />
        <Button>ADD TO CART</Button>
      </CardFooter>
    </Card>
  ),
};
