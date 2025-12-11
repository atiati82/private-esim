import memoize from 'memoizee';
import type { Payload } from 'payload';

import { makeRegionObj, Region } from '@/data/region';
import { RegionsCollectionId } from '@/payload/collections';

export const findRegions = memoize(_findRegions, { promise: true });

async function _findRegions(payload: Payload): Promise<Region[]> {
  const res = await payload.find({
    collection: RegionsCollectionId,
    pagination: false,
  });
  return res.docs.map(makeRegionObj);
}
