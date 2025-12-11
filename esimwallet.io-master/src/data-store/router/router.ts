import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getApplicationRouterRef } from '@/data-store/router/router-ref';
import { RootState } from '@/data-store/store';
import { type RootPageParams } from '@/lib/types';
import { UrlParams } from '@/lib/urls';

import { EsimProductPageParams } from '@/app/[locale]/(esims)/esim/[destination]/[esim]/page';

/**
 * All possible router params, as defined across all pages
 */
type PossibleRouteParams = Partial<RootPageParams> &
  Partial<EsimProductPageParams> &
  Record<string, string | string[] | undefined>;

/**
 * Router info
 * @see
 */
export interface RouterState {
  /**
   * Current URL path
   */
  path: string;

  /**
   * Current router params, incl. dynamic/hidden route segments, search query params, #hash params
   */
  allParams: PossibleRouteParams;

  /**
   * Actual, extra params visible in URL (so no segments like 'locale', 'esim' etc)
   */
  params: UrlParams;
}

const initialState: RouterState = {
  path: '',
  allParams: {},
  params: {},
};

export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    routeChanged: (state, action: PayloadAction<RouterState>) => {
      return <RouterState>{
        ...state,
        path: action.payload.path,
        allParams: action.payload.allParams,
        params: action.payload.params,
      };
    },
    /**
     * Experimental: dispatch navigateAction(url) to trigger navigation to provided url
     */
    navigate: (state, action: PayloadAction<string>) => {
      getApplicationRouterRef().push(action.payload);
    },
  },
});

/**
 * Get entire router state
 */
export const selectRouterState = (state: RootState): RouterState => {
  return state.router;
};

export const selectRouterPath = createSelector([selectRouterState], (routerState: RouterState) => routerState.path);

/**
 * Get all router params
 */
export const selectAllRouterParams = createSelector(
  [selectRouterState],
  (routerState: RouterState) => routerState.allParams,
);
export const selectRouterParams = createSelector(
  [selectRouterState],
  (routerState: RouterState) => routerState.params,
);

/**
 * Get selected param from the Router's params
 */
export const selectRouterParam =
  (paramName: string) =>
  (state: RootState): string | string[] | undefined => {
    return state.router.allParams[paramName];
  };

export const routeChangedAction = routerSlice.actions.routeChanged;
export const navigateAction = routerSlice.actions.navigate;

export const { reducer: routerReducer } = routerSlice;
