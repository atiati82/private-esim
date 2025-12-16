'use client';

import React, { useLayoutEffect } from 'react';

import { routeChangedAction } from '@/data-store/router/router';
import { setApplicationRouterRef } from '@/data-store/router/router-ref';
import { useAppDispatch } from '@/data-store/store-hooks';
import { UrlParams } from '@/lib/urls';
import { useParams, usePathname, useRouter, useSearchParams } from '@/navigation';

/**
 * Feeds our Redux Store with all things from router, for convenience of use.
 *
 * Everywhere in the app we can now use store selectors to get router state,
 * instead of original React hooks (which have some bad side effects, like
 * for instance, `useSearchParams()` hook switches off any server-side optimisation in Next.js).
 *
 * For usage, see the following Store selectors:
 * @see selectRouterState
 * @see selectRouterParam
 * @see selectRouterParams
 * @see selectAllRouterParams
 */
export const RouterWatcher: React.FC = () => {
  // HACKY!!! Save Router ref, so it can be used by Redux Store...
  // Couldn't find better way of accessing router from the Store ;/
  setApplicationRouterRef(useRouter());

  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // Here, only "real" params - skip stuff returned by useParams() as it is already in the `pathname`.
  let params: UrlParams = {};
  let allParams: UrlParams = useParams();

  // Include search params in the params obj...
  const searchParams = searchParamsAsKeyValue(useSearchParams());
  params = { ...params, ...searchParams };
  allParams = { ...allParams, ...searchParams };

  useLayoutEffect(() => {
    // Also, include hash params into the allParams obj...
    // Note: this is a bit experimental, maybe we should keep it separately?
    const hash = typeof window !== 'undefined' && window.location.hash.slice(1);
    if (hash) {
      const hashParams = searchParamsAsKeyValue(new URLSearchParams(hash));
      allParams = { ...allParams, ...hashParams };
    }

    dispatch(routeChangedAction({ path: pathname, allParams, params }));
  }, [pathname, allParams]);

  return null; // This component does not render anything
};

function searchParamsAsKeyValue(searchParams: URLSearchParams): Record<string, string> {
  const resParams: Record<string, string> = {};
  for (const [k, v] of searchParams.entries()) {
    resParams[k] = v;
  }
  return resParams;
}
