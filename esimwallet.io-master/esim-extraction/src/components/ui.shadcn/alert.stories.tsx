import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import upperFirst from 'lodash/upperFirst';
import { BadgeAlertIcon, ShieldAlertIcon, ShieldCheckIcon, WifiIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui.shadcn/alert';
import { AlertVariantsVariant, alertVariantsVariants } from '@/components/ui.shadcn/alert.css';
import { Textual } from '@/components/ui/textual';
import { spaceBetween } from '@/styles/layout.css';

const meta: Meta<typeof Alert> = {
  title: 'ui.shadcn / Alert',
  component: Alert,
  argTypes: {},
  args: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert variant={args.variant} data-variant={args.variant}>
      <ShieldCheckIcon />
      <AlertTitle>Some Alert Title</AlertTitle>
      <AlertDescription>
        Some content here. Lorem ipsum dolor sit amet. You can add components and dependencies to
        your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const JustTitle: Story = {
  render: (args) => (
    <Alert variant={args.variant} data-variant={args.variant}>
      <WifiIcon />
      <AlertTitle>Alert Title Everything OK</AlertTitle>
    </Alert>
  ),
};

export const JustDescription: Story = {
  render: (args) => (
    <Alert variant={args.variant} data-variant={args.variant}>
      <BadgeAlertIcon strokeWidth={2} />
      <AlertDescription>
        Some content here. Lorem ipsum dolor sit amet. You can add components and dependencies to
        your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => {
    const variantIcon = (cmpVariant: AlertVariantsVariant): React.ReactElement => {
      switch (cmpVariant) {
        case 'warning':
        case 'error':
          return <ShieldAlertIcon />;
        default:
          return <ShieldCheckIcon />;
      }
    };

    return (
      <div className={spaceBetween.y.l1}>
        {alertVariantsVariants.map((variant) => (
          <Alert key={variant} variant={variant} data-variant={variant}>
            {variantIcon(variant)}
            <AlertTitle>{upperFirst(variant)} Alert Title</AlertTitle>
            <AlertDescription>
              <Textual>
                Some content here. Lorem ipsum dolor sit amet. You can add components and
                dependencies to your app using the cli.
              </Textual>
              <Textual>Lorem ipsum dolor sit amet.</Textual>
              <Textual>This is an example of multi-paragraph content.</Textual>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    );
  },
};
