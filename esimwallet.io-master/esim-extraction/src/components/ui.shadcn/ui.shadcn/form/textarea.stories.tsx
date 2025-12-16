import { Meta, StoryObj } from '@storybook/react';

import { Textarea } from '@/components/ui.shadcn/form/textarea';

const meta: Meta<typeof Textarea> = {
  title: 'ui.shadcn / Textarea',
  component: Textarea,
  argTypes: {
    className: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
    variant: { control: 'select', options: ['primary', 'secondary', 'destructive'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'This field is disabled',
    disabled: true,
  },
};

export const Rows: Story = {
  args: {
    placeholder: 'Enter your text here...',
    rows: 5,
  },
};

export const CustomVariant: Story = {
  args: {
    placeholder: 'Custom variant textarea...',
    variant: 'destructive',
  },
};

export const CustomSize: Story = {
  args: {
    placeholder: 'Custom size textarea...',
    size: 'large',
  },
};
