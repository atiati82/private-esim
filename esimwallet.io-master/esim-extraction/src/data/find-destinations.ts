import memoize from 'memoizee';
import type { Payload } from 'payload';

import { Destination, makeDestinationObj } from '@/data/destination';
import { DestinationsCollectionId } from '@/payload/collections';

export const findDestinations = memoize(_findDestinations, { promise: true });
async function _findDestinations(payload: Payload): Promise<Destination[]> {
  const res = await payload.find({
    collection: DestinationsCollectionId,
    pagination: false,
  });
  return res.docs.map(makeDestinationObj);
}

/**
 * Find Destination by its ID or slug
 */
export const findDestinationById = memoize(_findDestinationById, { promise: true });
async function _findDestinationById(
  payload: Payload,
  id: string,
): Promise<Destination | undefined> {
  const destinations = await findDestinations(payload);
  return destinations.find((d) => d.id === id || d.slug === id);
}
