import 'dotenv/config';

import { getPayload, Payload } from 'payload';

/**
 * Get configured/initialized PayloadCMS instance.
 * To be used in standalone scripts (e.g. run via `tsx`)
 */
export async function appGetPayloadStandalone(): Promise<Payload> {
  const { default: configPromise } = await import('@payload-config');
  return getPayload({ config: configPromise });
}
