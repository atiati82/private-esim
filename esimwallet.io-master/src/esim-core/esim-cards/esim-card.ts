import { getShortProviderId } from '@/data/provider';
import { currentDateStrForUid, generateRandomString } from '@/lib/generate-random-string';
import { EsimCardDto } from '@/payload/app-types';
import { isObject, makeMinimalRelationObj } from '@/payload/utils/data-utils';

/**
 * @see OrderItemIdPrefix
 * @see TransactionIdPrefix
 */
export const EsimCardIdPrefix = `369`;
export const EsimCardIdRegexp = /^(369)([0-9a-z]+)-(\d{6})$/;

export interface EsimCard extends EsimCardDto {}

export function makeEsimCardObj(dto: EsimCardDto): EsimCard {
  if (!isObject(dto)) {
    return makeMinimalRelationObj(dto);
  }

  return dto;
}

/**
 * Our internal ID for eSIM cards
 */
export function makeEsimCardId(providerId: string, iccid: string, random = false): string {
  const shortICCID = iccid.substring(iccid.length - 6);
  const shortProvider = getShortProviderId(providerId);
  const dateStr = random ? generateRandomString(8) : currentDateStrForUid();
  return `${EsimCardIdPrefix}${shortProvider}${dateStr}-${shortICCID}`;
}
