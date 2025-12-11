import type { useRouter } from 'next/navigation';

type AppRouterInstance = ReturnType<typeof useRouter>;

/**
 * Store ref to application Router, so it can be easily accessed elsewhere
 * (e.g. from Redux Store)
 *
 * Why? The `useRouter()` hook can only be used from components...
 * And it's not that easy to stub/replace it in tests
 */
export function setApplicationRouterRef(router: AppRouterInstance): void {
  _router = router;
}

/**
 * Get a ref to application Router.
 *
 * Similar to `useRouter()` hook, but can be accessed everywhere,
 * e.g. in Redux Store.
 */
export function getApplicationRouterRef(): AppRouterInstance {
  return _router;
}

let _router: AppRouterInstance;
