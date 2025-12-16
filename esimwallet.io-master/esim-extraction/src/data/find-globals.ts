import merge from 'lodash/merge';
import memoize from 'memoizee';
import type { Payload } from 'payload';

import { EsimProductsContent } from '@/payload/app-types';
import { EsimProductsDataCollectionId } from '@/payload/collections';
import { esimProductsSeedContent } from '@/payload/collections/esim-products/esim-products-content.seed';

/**
 * @deprecated
 *
 * @TODO: Due to issues with using Payload instance in child components (hard to mock/override etc)
 *  we currently don't use this function. Instead, we use {@link CmsContentService} across components.
 */
export const findProductContent = memoize(_findProductContent, { promise: true });
export async function _findProductContent(payload: Payload): Promise<EsimProductsContent> {
  const cmsContent = await payload.findGlobal({ slug: EsimProductsDataCollectionId });
  return (cmsContent && merge(esimProductsSeedContent, cmsContent)) || esimProductsSeedContent;
}
