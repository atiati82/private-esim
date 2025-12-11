import { beforeEach, describe, expect, test } from 'vitest';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

import {
  routeChangedAction,
  routerReducer,
  selectAllRouterParams,
  selectRouterParam,
  selectRouterParams,
  selectRouterState,
} from '@/data-store/router/router';
import { RootState } from '@/data-store/store';

describe('Store: Router', () => {
  let store: EnhancedStore<RootState>;
  let rootState: RootState;

  beforeEach(() => {
    store = configureStore({
      reducer: { router: routerReducer },
    }) as EnhancedStore<RootState>;
    store.subscribe(() => (rootState = store.getState()));
    rootState = store.getState();
  });

  test('initial state', () => {
    expect(selectRouterState(rootState)).toEqual({ path: '', allParams: {}, params: {} });
  });

  test('dispatch & selectRouterState', () => {
    store.dispatch(
      routeChangedAction({
        path: 'new/path',
        allParams: { locale: 'en', x: 'yz' },
        params: { x: 'yz' },
      }),
    );
    expect(selectRouterState(rootState)).toEqual({
      path: 'new/path',
      allParams: { locale: 'en', x: 'yz' },
      params: { x: 'yz' },
    });
  });

  test('dispatch & selectRouterParams', () => {
    store.dispatch(
      routeChangedAction({
        path: 'new/path',
        allParams: { locale: 'en', y: 'z' },
        params: { y: 'z' },
      }),
    );
    expect(selectAllRouterParams(rootState)).toEqual({ locale: 'en', y: 'z' });
    expect(selectRouterParams(rootState)).toEqual({ y: 'z' });
  });

  test('dispatch & selectRouterParam(name)', () => {
    const selectParamX = selectRouterParam('x');
    const selectParamFoo = selectRouterParam('foo');
    store.dispatch(
      routeChangedAction({
        path: 'new/path',
        allParams: { locale: 'en', x: 'y' },
        params: { x: 'y' },
      }),
    );
    expect(selectParamX(rootState)).toBe('y');
    expect(selectParamFoo(rootState)).toBe(undefined);

    // State should not accumulate, it should be overridden
    // i.e. old params shouldn't be present
    store.dispatch(
      routeChangedAction({
        path: 'new/path',
        allParams: { locale: 'en', foo: 'bar' },
        params: { foo: 'bar' },
      }),
    );
    expect(selectParamX(rootState)).toBe(undefined);
    expect(selectParamFoo(rootState)).toBe('bar');
  });
});
