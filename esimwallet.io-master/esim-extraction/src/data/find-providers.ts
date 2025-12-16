import memoize from 'memoizee';
import type { Payload } from 'payload';

import { EsimProvider, makeProviderObj } from '@/data/provider';
import { EsimProvidersCollectionId } from '@/payload/collections';

export const findProviders = memoize(_findProviders, { promise: true });
async function _findProviders(payload: Payload): Promise<EsimProvider[]> {
  const res = await payload.find({
    collection: EsimProvidersCollectionId,
    pagination: false,
  });
  return res.docs.map(makeProviderObj);
}

/**
 * Find EsimProvider by its ID
 */
export const findProviderById = memoize(_findProviderById, { promise: true });
async function _findProviderById(payload: Payload, id: string): Promise<EsimProvider> {
  const providers = await findProviders(payload);
  const provider = providers.find((p) => p.id === id);
  if (!provider) {
    // We assume related provider is always in DB... if it's not, it's strange, it shouldn't happen
    throw new Error(`findProviderById(${id}): could not find provider.`);
  }
  return provider;
}
