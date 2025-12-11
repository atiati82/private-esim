export enum FulfillmentStatus {
  New = 'New',
  Fulfilled = 'Fulfilled',
  Processing = 'Processing',
  Cancelled = 'Cancelled',
  /**
   * Expired: when order is not completed/confirmed within X time
   */
  Expired = 'Expired',
  Error = 'Error',
}
type FulfillmentStatusStrings = `${FulfillmentStatus}`;
export type FulfillmentStatusType = FulfillmentStatus | FulfillmentStatusStrings;
export const initFulfillmentStatus = FulfillmentStatus.New;
