import { EsimProductDto } from '@/payload/app-types';
import { EsimProductsCollectionId } from '@/payload/collections';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { mockProductDto, MockProductOpts } from './products.mock';

export async function mockProductInPayload(
  dto: Partial<EsimProductDto> = {},
  opts: Partial<MockProductOpts> = {},
): Promise<EsimProductDto> {
  const payload = await appGetPayloadStandalone();
  const data = mockProductDto(dto, opts);
  // console.log('MOCK PRODUCT IN PAYLOAD, prepared DTO:', data);
  return payload.create({
    collection: EsimProductsCollectionId,
    data,
    overrideAccess: true,
    showHiddenFields: true,
  });
}
