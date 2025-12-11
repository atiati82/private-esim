import 'dotenv/config';

import memoize from 'memoizee';
import type { Payload } from 'payload';

/**
 * Lazily loads @payload-config and Payload module.
 * Uses dynamic imports to reduce initial load time.
 * To be used inside Next.js (pages, API routes, etc.).
 */
export const appGetPayload = memoize(_appGetPayload, { promise: true });

async function _appGetPayload(): Promise<Payload> {
  // Before doing anything, try to access global instance of Payload (set in getPayload() func)
  if (global._payload?.payload) {
    return global._payload?.payload;
  } else if (global._payload?.promise) {
    return global._payload?.promise;
  }

  const { default: configPromise } = await import('@payload-config');
  const { getPayload } = await import('payload');

  return getPayload({ config: configPromise });
}
