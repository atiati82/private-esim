import { EsimCardSmDpStatus, EsimCardSmDpStatusType } from '@/esim-core/esim-cards/collection';
import { EsimCardDto, OrderItemDto } from '@/payload/app-types';

import { EsimCard } from '../esim-cards/esim-card';

/**
 * List of {@link EsimCard.statusSmdp} which are considered during syncing process.
 * Anything else won't be considered as "worthy" usage tracking.
 */
const EsimCardStatusForSyncing: EsimCardSmDpStatusType[] = [
  EsimCardSmDpStatus.Created,
  EsimCardSmDpStatus.Activated,
  EsimCardSmDpStatus.Suspended,
  EsimCardSmDpStatus.Unrecognized,
];

/**
 * Check if eSIM is suitable for usage syncing
 */
export function shouldSyncEsimCard(eSIM: EsimCardDto | EsimCard): boolean {
  return EsimCardStatusForSyncing.includes(eSIM.statusSmdp);
}

/**
 * Get the 1st / original order ID (from supplier's data),
 * which made i.e. instantiated the eSIM.
 */
export function getInitialSupplierOrderId(eSIM: EsimCardDto): string | undefined {
  // reverse the ordered items (which are from newest to the oldest and find the 1st package
  // which has fulfillment info with supplier order id.
  // Normally, it should be simply the last (or, the 1st item, after reverse).
  const initOrderItem = eSIM.orderedPackages
    .toReversed()
    .find(({ orderItem }) => (orderItem as OrderItemDto).fulfillment.supplierOrderId)?.orderItem as
    | OrderItemDto
    | undefined;

  return initOrderItem?.fulfillment.supplierOrderId || undefined;
}
