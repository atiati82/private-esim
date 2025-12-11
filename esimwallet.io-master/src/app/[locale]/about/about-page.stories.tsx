import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import AboutPageContent from '@/app/[locale]/about/about-content';
import { dataFeatures } from './cutting-edge-technology-data';
import { dataOwner } from './meet-our-team-data';
import { coreData } from './our-core-values-data';

const meta: Meta<typeof AboutPageContent> = {
  title: 'Pages / About Us',
  component: AboutPageContent,
};

export default meta;

type Story = StoryObj<typeof AboutPageContent>;

export const Default: Story = {
  render: (args) => <AboutPageContent {...args} />,
  args: {
    features: dataFeatures,
    members: dataOwner,
    values: coreData,
  },
};

export const NoDescription: Story = {
  render: (args) => <AboutPageContent {...args} />,
  args: {
    features: dataFeatures.map((feature) => ({
      ...feature,
      description: '',
    })),
    members: dataOwner.map((member) => ({
      ...member,
      description: '',
    })),
    values: coreData.map((value) => ({
      ...value,
      description: '',
    })),
  },
};
