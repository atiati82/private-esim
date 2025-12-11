import { EsimCardsCollectionId } from '@/esim-core/esim-cards/collection';
import { EsimCardDto, UserDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { mockUserInPayload } from './users-in-payload';

/**
 * Mock {@link EsimCardDto} in the CMS.
 */
export async function mockEsimCardInPayload(dto: EsimCardDto): Promise<EsimCardDto> {
  const payload = await appGetPayloadStandalone();
  const user = (dto.user as UserDto) ?? (await mockUserInPayload({}));

  const data: EsimCardDto = {
    ...dto,
    user: getRelationIdVal(user)!,
    orderedPackages: dto.orderedPackages.map(({ orderItem }) => {
      return { orderItem: getRelationIdVal(orderItem) } as EsimCardDto['orderedPackages'][number];
    }),
    provider: getRelationIdVal(dto.provider)!,
  };

  return payload.create({
    collection: EsimCardsCollectionId,
    data,
  });
}

/**
 * TODO
 */
export async function mockEsimCardWithOrderedPackagesInPayload(
  _: EsimCardDto,
): Promise<EsimCardDto> {
  // TODO: not ready, create ordered packages in CMS before calling
  throw Error('NOT IMPLEMENTED');
}
