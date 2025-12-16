import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { AccountCreateForm } from '@/app/[locale]/account/create/AccountCreateForm';
import { LoginForm } from '@/app/[locale]/account/login/LoginForm';
import { Form } from '@/components/ui.shadcn/form/form';
import { FormDemo } from '@/components/ui.shadcn/form/form-demo';

const meta: Meta<typeof Form> = {
  title: 'ui.shadcn / Form and Inputs / Forms',
  component: Form,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FormDemo />,
};

export const SignUpForm: Story = {
  render: () => <AccountCreateForm />,
};

export const LoginFormExample: Story = {
  render: () => <LoginForm />,
};
