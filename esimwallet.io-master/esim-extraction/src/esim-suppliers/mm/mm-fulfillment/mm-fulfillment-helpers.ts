import { isTestingEnv } from '@/env-helpers';
import {
  EsimCardInstallationStatus,
  EsimCardSmDpStatus,
  EsimCardSmDpStatusType,
} from '@/esim-core/esim-cards/collection';
import { FulfillmentStatus } from '@/esim-core/fulfillment-usage/fulfillment-status';
import { EsimCardSetup } from '@/payload/app-types';

import { MmProductCategory } from '@/esim-suppliers/mm/mm-products.types';
import {
  MmOrder,
  MmOrderLineItemDetailName,
  MmOrderState,
  MmOrderStateType,
  MmProviderInfo,
} from '../mm-orders.types';

export function ensureOrderId(fulfillmentOrderId: string | null | undefined): string {
  if (!fulfillmentOrderId) {
    throw new Error('Fulfillment: missing order id.');
  }
  return fulfillmentOrderId;
}

export function ensureMmEsimStarter(mmOrder: MmOrder): void {
  if (
    !(
      mmOrder.orderLineItem.productCategory === MmProductCategory.eSIM ||
      mmOrder.orderLineItem.productCategory === MmProductCategory.eSIMdelayed
    )
  ) {
    throw new Error(
      `FF MM: expected eSIM starter order, got: ${mmOrder.orderLineItem.productCategory}`,
    );
  }
}
export function ensureMmEsimTopUp(mmOrder: MmOrder): void {
  if (mmOrder.orderLineItem.productCategory !== MmProductCategory.TopUp) {
    throw new Error(
      `FF MM: expected eSIM TopUp order, got: ${mmOrder.orderLineItem.productCategory}`,
    );
  }
}
export function ensureMmEsimReplacement(mmOrder: MmOrder): void {
  if (mmOrder.orderLineItem.productCategory !== MmProductCategory.Replacement) {
    throw new Error(
      `FF MM: expected eSIM Replacement order, got: ${mmOrder.orderLineItem.productCategory}`,
    );
  }
}

export function getEsimSetupData(mmOrder: MmOrder, currentSetup?: EsimCardSetup): EsimCardSetup {
  return {
    iccid: getMmOrderLineDetail(mmOrder, 'ICCID') || currentSetup?.iccid || '',
    phoneNo: getMmOrderLineDetail(mmOrder, 'PHONE_NUMBER') || currentSetup?.phoneNo || '',
    smdpAddress: getMmOrderLineDetail(mmOrder, 'SMDP_ADDRESS') || currentSetup?.smdpAddress || '',
    activationCode:
      getMmOrderLineDetail(mmOrder, 'ACTIVATION_CODE') || currentSetup?.activationCode || '',
    confirmationCode:
      getMmOrderLineDetail(mmOrder, 'CONF_CODE') || currentSetup?.confirmationCode || '',
    lpa: getMmOrderLineDetail(mmOrder, 'LOCAL_PROFILE_ASSISTANT') || currentSetup?.lpa || '',
    apn: getMmOrderLineDetail(mmOrder, 'ACCESS_POINT_NAME') || currentSetup?.apn || '',
  };
}

export function getMmOrderLineDetail(mmOrder: MmOrder, detail: MmOrderLineItemDetailName): string {
  const lineItemDetail = mmOrder.orderLineItem.lineItemDetails.find((li) => li.name === detail);
  return lineItemDetail?.value ?? '';
}

export function getEsimInstallationStatus(
  providerInfo: MmProviderInfo,
): EsimCardInstallationStatus {
  return providerInfo.esim.status?.toLowerCase() === 'installed'
    ? EsimCardInstallationStatus.Installed
    : EsimCardInstallationStatus.New;
}

/**
 * Determine best SM-DP+ status based on MobiMatter provider data
 */
export function getEsimSmdpStatus(
  mmSmdpCode: EsimCardSmDpStatusType | string,
  mmIsSuspendedIeDisabled?: boolean,
): EsimCardSmDpStatus {
  if (mmIsSuspendedIeDisabled) {
    // this flag apparently takes priority over any real SM-DP+ status code
    // and it means that the card is completely disabled/expired.
    return EsimCardSmDpStatus.Disabled;
  }

  // In our system we use the same statuses as MobiMatter,
  // so we basically return the same statuses below.
  switch (mmSmdpCode) {
    case EsimCardSmDpStatus.Ephemeral:
      return EsimCardSmDpStatus.Ephemeral;
    case 'created':
      return EsimCardSmDpStatus.Created;
    case 'activated':
      return EsimCardSmDpStatus.Activated;
    case 'suspended':
      return EsimCardSmDpStatus.Suspended;
    case 'disabled':
      return EsimCardSmDpStatus.Disabled;
    case 'error':
      return EsimCardSmDpStatus.Error;
    default:
      !isTestingEnv &&
        console.warn(
          `WARNING: Unrecognised eSIM SM-DP+ status code received: ${mmSmdpCode}.`,
          `You should add case to support to it.`,
        );
      return EsimCardSmDpStatus.Unrecognized;
  }
}

/**
 * OrderItem fulfillment status, from Mobimatter order state
 */
export function getOrderFulfillmentStatus(mmOrderState: MmOrderStateType): FulfillmentStatus {
  switch (mmOrderState) {
    case MmOrderState.Created:
      return FulfillmentStatus.New;
    case MmOrderState.Processing:
      return FulfillmentStatus.Processing;
    case MmOrderState.Completed:
      return FulfillmentStatus.Fulfilled;
    case MmOrderState.Cancelled:
      return FulfillmentStatus.Cancelled;
    case MmOrderState.Expired:
      return FulfillmentStatus.Expired;
    default:
      return FulfillmentStatus.Error;
  }
}
