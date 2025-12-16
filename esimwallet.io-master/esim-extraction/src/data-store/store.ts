import { Action, configureStore, type Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { createLogger } from 'redux-logger';

import { authApi } from '@/data-store/auth-api';
import { destinationsSlice } from '@/data-store/destinations';
import { destinationsApi } from '@/data-store/destinations-api';
import { esimProductsApi } from '@/data-store/esim-products-api';
import { emitFlashMessage, messagesSlice } from '@/data-store/messages';
import { routerReducer } from '@/data-store/router/router';
import { isTestingEnv } from '@/env-helpers';

import { writeCartToLocalStorage } from '@/feat-cart/cart-persist';
import { cartSlice } from '@/feat-cart/cart.store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const makeStore = (preloadedState?: unknown) => {
  const middlewares: Middleware[] = [
    authApi.middleware,
    destinationsApi.middleware,
    esimProductsApi.middleware,
    ...makeLoggerMiddleware(), // logger should be the LAST, to have best logging experience
  ];

  const store = configureStore({
    reducer: {
      router: routerReducer,
      authApi: authApi.reducer,
      messages: messagesSlice.reducer,
      destinations: destinationsSlice.reducer,
      destinationsApi: destinationsApi.reducer,
      cart: cartSlice.reducer,
      esimProductsApi: esimProductsApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [emitFlashMessage.type],
          ignoredPaths: [
            // flash messages can contain ReduxElement content in the message content to show in the UI...
            /messages.flashMessages.+message$/,
          ],
        },
      }).concat(...middlewares),
  });

  // optional, but required for refetchOnFocus/refetchOnReconnect behaviors
  // see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
  setupListeners(store.dispatch);

  store.subscribe(() => {
    writeCartToLocalStorage(store.getState().cart);
  });

  return store;
};

function makeLoggerMiddleware(): Middleware[] {
  if (process.env.NODE_ENV === 'production' || typeof window === 'undefined' || isTestingEnv) {
    return [];
  }
  const _loggerIgnoredActions = /middlewareRegistered|internalSubscriptions/;
  return [
    createLogger({
      collapsed: true,
      duration: true,
      predicate: (_: unknown, action: Action): boolean => {
        return !action.type.match(_loggerIgnoredActions);
      },
    }),
  ];
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
