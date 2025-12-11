import type { OptionObject } from 'payload';

export const EsimCardsCollectionId = 'esim-cards' as const;

export enum EsimCardInstallationStatus {
  New = 'new',
  Installed = 'installed',
}
export type EsimCardInstallationStatusType =
  | `${EsimCardInstallationStatus}`
  | EsimCardInstallationStatus;
export const esimCardInstallationStatusOptions: OptionObject[] = [
  { value: EsimCardInstallationStatus.New, label: 'New' },
  { value: EsimCardInstallationStatus.Installed, label: 'Installed' },
];
export const initEsimCardInstallationStatus = EsimCardInstallationStatus.New;

export enum EsimCardSmDpStatus {
  /**
   * For new orders, temporary/transient eSIM record, just so we can show it in MyWallet.
   * It hasn't been yet processed by supplier (e.g. transaction payment failed etc).
   * TODO: They're automatically deleted from the system, if not "converted" into real eSIM.
   */
  Ephemeral = 'ephemeral',
  Created = 'created',
  Activated = 'activated',
  Suspended = 'suspended',
  Disabled = 'disabled',
  Error = 'error',
  /**
   * This status is used when unknown/unrecognised/unsupported status has arrived from provider, from SM-DP+ server
   */
  Unrecognized = 'unrecognized',
}
export type EsimCardSmDpStatusType = `${EsimCardSmDpStatus}` | EsimCardSmDpStatus;
export const esimCardSmDpStatusOptions: OptionObject[] = [
  {
    value: EsimCardSmDpStatus.Ephemeral,
    label: `Ephemeral - temporary eSIM record, not fulfilled yet, not in SM-DP+`,
  },
  {
    value: EsimCardSmDpStatus.Created,
    label: 'Created - eSIM generated, but not associated with device yet',
  },
  {
    value: EsimCardSmDpStatus.Activated,
    label: 'Activated - successfully downloaded and installed',
  },
  { value: EsimCardSmDpStatus.Suspended, label: 'Suspended - temporarily' },
  { value: EsimCardSmDpStatus.Disabled, label: 'Disabled/Expired - permanently' },
  {
    value: EsimCardSmDpStatus.Error,
    label: 'Error - an issue occurred during eSIM profile management',
  },
  {
    value: EsimCardSmDpStatus.Unrecognized,
    label: 'Unrecognized - unknown status arriving from provider, check system logs',
  },
];
export const initEsimCardSmDpStatus = EsimCardSmDpStatus.Ephemeral;
export const initFulfilledEsimCardSmDpStatus = EsimCardSmDpStatus.Created;
