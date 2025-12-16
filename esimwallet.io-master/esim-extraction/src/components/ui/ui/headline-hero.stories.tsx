import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchCheck } from 'lucide-react';

import { HeadlineHero } from './headline-hero';

const meta: Meta<typeof HeadlineHero> = {
  title: 'ui.Private eSIM / HeadlineHero',
  component: HeadlineHero,
  argTypes: {
    className: { control: 'text' },
    title: { control: 'text', description: 'Title text for the headline hero ***— Required***' },
    subtitle: { control: 'text', description: 'Subtitle text for the headline hero' },
    tip: { control: 'text', description: 'Tip text for the headline hero' },
    tipIcon: {
      control: 'object',
      description:
        'Icon for the tip. This should be a React component or element. You can use icons from the `lucide-react` library, eg: `<SearchCheck/>`.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeadlineHero>;

export const Default: Story = {
  args: {
    title: 'Private eSIM Blog',
    subtitle: 'We are available through multiple channels.',
    tip: "We're here to help and answer any questions you may have.",
    tipIcon: <SearchCheck />,
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Private eSIM Blog',
  },
};
export const TitleAndSubtitle: Story = {
  args: {
    title: 'Private eSIM Blog',
    subtitle: 'We are available through multiple channels.',
  },
};
export const TitleAndTip: Story = {
  args: {
    title: 'Private eSIM Blog',
    tip: 'We are available through multiple channels.',
  },
};
export const WithTipIcon: Story = {
  args: {
    title: 'Private eSIM Blog',
    subtitle: 'We are available through multiple channels.',
    tip: "We're here to help and answer any questions you may have.",
    tipIcon: <SearchCheck />,
  },
};
