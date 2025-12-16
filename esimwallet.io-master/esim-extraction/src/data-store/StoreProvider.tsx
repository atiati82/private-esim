'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';

import { authApi } from '@/data-store/auth-api';
import { makeStore, type AppStore, type RootState } from '@/data-store/store';

export type StoreProviderProps = React.PropsWithChildren & {
  dispatchInitActions?: boolean;
  store?: AppStore;
  preloadedState?: RootState;
};

export function StoreProvider({
  children,
  dispatchInitActions,
  store,
  preloadedState,
}: StoreProviderProps): React.ReactNode {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store ?? makeStore(preloadedState);

    // Dispatch / trigger some actions, right after the store is created
    if (dispatchInitActions) {
      storeRef.current.dispatch(authApi.endpoints.getMeUser.initiate());
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
