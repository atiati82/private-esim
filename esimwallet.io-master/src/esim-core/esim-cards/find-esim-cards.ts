import type { Payload, Where } from 'payload';

import { EsimCardDto, UserDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';

import { EsimCardsCollectionId } from './collection';

export async function findEsimCard(
  payload: Payload,
  id: string,
  options: { depth?: number } = {},
): Promise<EsimCardDto | null> {
  return payload.findByID({
    collection: EsimCardsCollectionId,
    id,
    depth: options.depth ?? 1,
    disableErrors: true,
  });
}

export async function findEsimCardByICCID(
  payload: Payload,
  iccid: string,
  options: { depth?: number } = {},
): Promise<EsimCardDto | undefined> {
  const res = await payload.find({
    collection: EsimCardsCollectionId,
    where: {
      'setup.iccid': { equals: iccid },
    },
    depth: options.depth ?? 1,
  });
  return res.docs[0];
}

type FindEsimCardsConditions = {
  ids?: string[];
  user?: string | UserDto;
};
export async function findEsimCards(
  payload: Payload,
  cond: FindEsimCardsConditions = {},
  options: { depth?: number; limit?: number } = {},
): Promise<EsimCardDto[]> {
  const where: Where = {};
  if (cond.ids) {
    where.id = { in: cond.ids };
  }
  if (cond.user) {
    where.user = { equals: getRelationIdVal(cond.user) };
  }

  const res = await payload.find({
    collection: EsimCardsCollectionId,
    where,
    limit: options.limit ?? 99,
    depth: options.depth ?? 1,
  });
  return res.docs;
}
