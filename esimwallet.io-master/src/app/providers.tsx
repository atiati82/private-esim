'use client';

import React from 'react';

import { GTMProvider } from '@/app-analytics/gtm/gtm-provider';

/**
 * All app `<body>` providers
 */
export function AppProviders({ children }: React.PropsWithChildren): React.ReactNode {
  return <GTMProvider>{children}</GTMProvider>;
}
