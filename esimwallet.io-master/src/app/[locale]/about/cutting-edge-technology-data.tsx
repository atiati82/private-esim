import React from 'react';
import { GlobeIcon, LayoutDashboardIcon, PlugIcon, ShieldCheckIcon } from 'lucide-react';

export const dataFeatures = [
  {
    title: 'Global Connectivity',
    description: 'Stay connected wherever you are',
    icon: <GlobeIcon size={20} fill="blue" stroke="white" />,
  },
  {
    title: 'Seamless Activation',
    description: 'Easy to activate and manage.',
    icon: <PlugIcon size={20} fill="blue" stroke="blue" />,
  },
  {
    title: 'Secure',
    description: 'Advanced security protocols',
    icon: <ShieldCheckIcon size={20} fill="blue" stroke="white" />,
  },
  {
    title: 'Flexible Plans',
    description: 'Tailored plans to suit your needs.',
    icon: <LayoutDashboardIcon size={20} fill="blue" stroke="white" />,
  },
];
