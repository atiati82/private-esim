import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FlagIcon } from './FlagIcon';

const meta: Meta<typeof FlagIcon> = {
  title: 'ui.icons / FlagIcon',
  component: FlagIcon,
  argTypes: {},
  render: (args) => (
    <>
      <FlagIcon {...args} className="m-4 inline-block" />
      <FlagIcon code="us" className="m-4 inline-block" />
      <FlagIcon code="ru" className="m-4 inline-block" />
    </>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    code: 'MX',
  },
};
