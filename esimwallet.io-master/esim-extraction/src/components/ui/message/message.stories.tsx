import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { makeNormalizedErr } from '@/lib/responses';

import { Button } from '@/components/ui.shadcn/form/button';
import { Separator } from '@/components/ui.shadcn/separator';
import { Message } from '@/components/ui/message/message';
import { flashMessageForGenericApiError } from '@/components/ui/message/system-flash-messages';
import { Textual } from '@/components/ui/textual';
import { spaceBetween } from '@/styles/layout.css';

const meta: Meta<typeof Message> = {
  title: 'ui.Private eSIM / Message',
  component: Message,
  argTypes: {
    variant: { options: ['default', 'success', 'warning', 'error'] },
    title: { control: 'text', table: { category: 'Content' } },
    message: { control: 'text', table: { category: 'Content' } },
    success: { control: 'text', table: { category: 'Content' } },
    warning: { control: 'text', table: { category: 'Content' } },
    error: { control: 'text', table: { category: 'Content' } },
  },
  args: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Message Title Todos Bien',
    message:
      'Simply a message. All is good. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
      'Nulla sed neque at justo viverra mattis ac lacinia massa. Vivamus non vulputate est.',
  },
};

export const NoIcon: Story = {
  args: {
    title: 'Message Title Todos Bien',
    showIcon: false,
    message:
      'Simply a message. All is good. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
      'Nulla sed neque at justo viverra mattis ac lacinia massa. Vivamus non vulputate est.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success Title',
    message:
      'Simply a message. All is good. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
      'Nulla sed neque at justo viverra mattis ac lacinia massa. Vivamus non vulputate est.',
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning Title',
    warning: `Some warning content. Component's variant is then automatically derived and set to 'warning'.`,
  },
};
export const Error: Story = {
  args: {
    title: 'Something Went Terribly Wrong',
    error: `Some error content. Component's variant is then automatically derived and set to 'error'.`,
  },
};

export const JustATitleNoMessage: Story = {
  render: () => (
    <div className={spaceBetween.y.l1}>
      <Message variant="default" title="Some Message with Short Title" />
      <Message variant="success" title="Whatever Happend was OK" />
      <Message variant="warning" title="Long title for a warning. Lorem ipsum dolor sit amet. Abracadabra tra la la." />
      <Message variant="error" title="Long title for an error. Lorem ipsum dolor sit amet. Abracadabra tra la la." />
    </div>
  ),
};

export const JustAMessageNoTitle: Story = {
  render: () => (
    <div className={spaceBetween.y.l1}>
      <Message message="Just a short message" />
      <Message success="Some success content. Component's variant is then automatically derived and set to 'success'." />
      <Message warning="Some warning content. Component's variant is then automatically derived and set to 'warning'." />
      <Message error="Some error content. Component's variant is then automatically derived and set to 'error'." />
    </div>
  ),
};

export const WithRichContent: Story = {
  args: {
    title: 'Are you sure?',
    message: (
      <>
        <Textual>
          Simply a message. All is good. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed neque at
          justo viverra mattis ac lacinia massa. Vivamus non vulputate est.
        </Textual>
        <Separator />
        <div>
          <Button size="sm" variant="destructive">
            No Way
          </Button>
          &nbsp;
          <Button size="sm">Proceed</Button>
        </div>
      </>
    ),
  },
};

export const FlashMessageForGenericApiError: Story = {
  args: {
    title: 'Some error occurred while doing X',
    error: flashMessageForGenericApiError(makeNormalizedErr('Validation Error of XYZ', 'INVALID_TRANSACTION')),
  },
};
