'use client';

import React, { useEffect } from 'react';

import { selectRouterState } from '@/data-store/router/router';
import { useAppSelector } from '@/data-store/store-hooks';

import { gtmSendPageView } from '@/app-analytics/gtm/gtm';

export const GTMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const routerState = useAppSelector(selectRouterState);

  useEffect(() => {
    gtmSendPageView(routerState.path, routerState.params);
  }, [routerState.path, routerState.params]);

  return <>{children}</>;
};
