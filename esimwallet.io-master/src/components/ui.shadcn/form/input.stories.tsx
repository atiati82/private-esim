import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchIcon } from 'lucide-react';

import { Link } from '@/navigation';

import { Checkbox } from '@/components/ui.shadcn/form/checkbox';
import { formItemWithCheckbox, formItemWithIcon } from '@/components/ui.shadcn/form/form.css';
import { Input } from '@/components/ui.shadcn/form/input';
import { Label } from '@/components/ui.shadcn/form/label';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'ui.shadcn / Form and Inputs / Inputs',
  argTypes: {
    disabled: { control: 'boolean', name: 'Disabled', description: 'Set `:disabled` state' },
  },
  args: {
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', width: '16rem' }}>
        <div>
          <Label>Input</Label>
          <Input {...props} defaultValue="dev@esimwallet.io value" />
        </div>
        <div>
          <Label>Input: empty</Label>
          <Input {...props} />
        </div>
        <div>
          <Label>Input: invalid</Label>
          <Input {...props} aria-invalid={true} />
        </div>
        <div>
          <Label>Input: placeholder</Label>
          <Input {...props} placeholder="Input with placeholder" type="email" />
          <Input
            {...props}
            placeholder="Input with placeholder"
            type="email"
            aria-invalid={true}
            style={{ marginTop: '.5rem' }}
          />
        </div>
      </div>
    );
  },
};

export const AltVariant: Story = {
  ...Default,
  args: {
    variant: 'alt',
  },
};

export const WithIcon: Story = {
  render: (props) => {
    return (
      <div className={formItemWithIcon} style={{ width: '20rem' }}>
        <SearchIcon />
        <Input placeholder="Type to search in this and that" {...props} />
      </div>
    );
  },
};

export const WithCheckbox: Story = {
  args: {
    variant: 'alt',
  },
  render: () => {
    return (
      <div className={formItemWithCheckbox}>
        <Checkbox />
        <Label>
          I agree to all <Link href="#">Terms and Conditions</Link>.
        </Label>
      </div>
    );
  },
};
