import { MmProductCategories, MmProductCategory } from './mm-products.types';

export type MmResponse<T> = {
  statusCode: number;
} & ({ result: T } | { message: string });

/**
 * Make a pre-order (**starter**) request
 */
export interface MmCreateOrderReq {
  productId: string;
  productCategory: MmProductCategory.eSIM | MmProductCategory.eSIMdelayed;
  label: string;
}
export interface MmCreateTopUpOrderReq extends Omit<MmCreateOrderReq, 'productCategory'> {
  productCategory: MmProductCategory.TopUp;
  addOnOrderIdentifier: string; // Original order ID (the one with eSIM starter)
}
export interface MmCreateEsimReplacementOrderReq extends Omit<MmCreateOrderReq, 'productCategory'> {
  productCategory: MmProductCategory.Replacement;
  addOnOrderIdentifier: string; // Original order ID (the one with eSIM starter)
}

/**
 * MobiMatter created (pre)order response.
 * Needs to be confirmed/completed with {@link }
 */
export interface MmCreatedOrder {
  orderId: string;
  productCategory: MmProductCategories;
}

/**
 * Confirm pre-ordered item
 */
export interface MmOrderReq {
  orderId: string;
}

/**
 * MobiMatter order (response) main data
 */
export interface MmOrder {
  orderId: string;
  orderState: MmOrderStateType;
  merchantId?: string; // not important / relevant
  externalId?: string | null; // not important / relevant
  label?: string;
  currencyCode: string;
  created: string;
  updated: string;
  orderLineItem: MmOrderLineItem;
}

export enum MmOrderState {
  Created = 'Created',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
}
type MmOrderStateStrings = `${MmOrderState}`;
export type MmOrderStateType = MmOrderState | MmOrderStateStrings;

export interface MmOrderLineItemDetail {
  name: MmOrderLineItemDetailName;
  value: string;
}

export interface MmOrderLineItem {
  productId: string;
  productCategory: MmProductCategories;
  productFamilyName: string;
  productFamilyId: string;
  title: string;
  provider: string;
  providerName: string;
  providerLogo: string;
  retailPrice: number;
  wholesalePrice: number;
  lineItemDetails: MmOrderLineItemDetail[];
}

/**
 * Union type for possible lineItemDetails name values
 */
export type MmOrderLineItemDetailName =
  | 'ICCID'
  | 'SMDP_ADDRESS'
  | 'LOCAL_PROFILE_ASSISTANT'
  | 'ACCESS_POINT_NAME'
  | 'ACTIVATION_CODE'
  | 'QR_CODE'
  | 'PHONE_NUMBER'
  | 'ACTIVATION_INSTRUCTIONS'
  | 'I_ACCOUNT'
  | 'CONF_CODE'
  | 'WALLET_AUTH_TRANSACTION_ID'
  | 'RECHARGABLE'
  | 'PARENT_ORDER'
  | 'PARENT_IDENTIFIER'
  | 'INVENTORY_ID';

/**
 * Provider Data, usage info
 */
export interface MmProviderInfo {
  esim: MmProviderEsimCard;
  packages: MmProviderPackageUsage[];
  /**
   * When usage tracking can't be done via API, this will contain #speed-dial-code to check usage
   */
  ussdCode?: string | null;
}

export interface MmProviderEsimCard {
  iccid: string;

  /**
   * Kinda same/similar to activated or created from `smtpCode` below
   * (see our {@link EsimCardSmDpStatus}.
   *
   * We convert it into {@link EsimCard.installationStatus}
   */
  status: 'Installed' | 'Available' | null;

  /**
   * Indicates that card is permanently disabled/expired,
   * switched off from the network and cannot be re-activated.
   * Same as `disabled` from `smdpCode` and our {@link EsimCardSmDpStatus.Disabled}
   */
  isSuspended: boolean;

  smdpCode: 'created' | 'activated' | 'suspended' | 'disabled' | 'error';
  phoneNumber?: string;
  installationDate?: string;
  // TODO: https://esimwallet.atlassian.net/browse/SIM-180
  location?: MmProviderEsimLastLocation | null;
  kycStatus: 'IN_PROGRESS' | 'REJECTED' | 'APPROVED' | string | null;
  puk: string;
  wallet?: {
    balanceHkd: number;
  };
}

export interface MmProviderEsimLastLocation {
  updated: Date | string;
  country: string;
  network: string;
}

export interface MmProviderPackageUsage {
  name: string;
  associatedProductId: string;
  activationDate: string;
  expirationDate: string;
  totalAllowanceMb: number | null;
  totalAllowanceMin: number | null;
  usedMin: number | null;
  usedMb: number | null;
}
