import { EsimCardDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';

import { EsimCardInstallationStatus, initEsimCardInstallationStatus } from './collection';

/**
 * Changes in {@EsimCard} history (for now, ICCID and installation status, only).
 */
export interface EsimCardHistoryItem {
  happenedAt: string;
  iccid: string;
  supplierOrderId: string;
  installationStatus: EsimCardInstallationStatus;
  installedAt?: string;
}

export function makeEsimCardHistoryItem(item: EsimCardHistoryItemRelaxed): EsimCardHistoryItem {
  return {
    happenedAt: item.happenedAt,
    iccid: item.iccid,
    supplierOrderId: item.supplierOrderId,
    installationStatus:
      (item.installationStatus as EsimCardInstallationStatus) || initEsimCardInstallationStatus,
    installedAt: item.installedAt || undefined,
  };
}
type EsimCardHistoryItemRelaxed = EsimCardHistoryItem | EsimCardDto['esimHistory'][number];

/**
 * Adds a new item to eSIM card history, only if it's different / relevant (e.g. new ICCID or installation status)
 */
export function addEsimCardHistoryItem(
  currentHistory: EsimCardDto['esimHistory'],
  itemToAdd: EsimCardHistoryItemRelaxed,
): EsimCardDto['esimHistory'] {
  const recentItem = currentHistory[0] && makeEsimCardHistoryItem(currentHistory[0]);
  const newItem = makeEsimCardHistoryItem(itemToAdd);

  const isEqual =
    recentItem &&
    recentItem.iccid === newItem.iccid &&
    recentItem.installationStatus === newItem.installationStatus;

  return isEqual ? currentHistory : [newItem, ...currentHistory];
}

export function addOrderIntoOrderedPackages(
  currentOrderedPackages: EsimCardDto['orderedPackages'],
  newOrderId: string,
): EsimCardDto['orderedPackages'] {
  const orderedPackagesSimple: EsimCardDto['orderedPackages'] = currentOrderedPackages.map(
    (op) => ({ orderItem: getRelationIdVal(op.orderItem)! }),
  );
  return [{ orderItem: newOrderId }, ...orderedPackagesSimple];
}
