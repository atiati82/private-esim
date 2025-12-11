/**
 * Plan (product) usage stats, synced regularly from provider
 */
export interface PackageUsage {
  activationDate?: string;
  expirationDate?: string;

  /**
   * Package data total allowance, in MB (not GB)
   */
  mbAllowance: number;
  mbUsed: number;
  mbUsageDelta: number; // from last sync, used to determine if plan is actively using its data

  /**
   * Package voice total allowance, in minutes
   */
  minAllowance: number;
  minUsed: number;
  minUsageDelta: number; // from last sync, used to determine if plan is actively using its minutes
}

/**
 * Live, up-to-date statuses for plan / order item
 *
 * @see OrderItemLiveStatusDto
 */
export interface OrderItemLiveStatus {
  /**
   * OrderItem has expired (no matter if used up the plan or not)
   */
  isPackageExpired: boolean;

  /**
   * Package used up (might not be expired, but no longer works
   * because run out of allowance)
   */
  isPackageUsedUp: boolean;

  /**
   * TRUE when customer is actively using plan features
   * (e.g. using the data or minutes).
   * Based on last provider data from last sync action.
   */
  isActivelyUsingAllowance: boolean;
}
