import { EsimProduct, makeEsimProductObj } from '@/data/esim-product';
import { calculateProfit } from '@/lib/esim-wallet';
import {
  EsimCardDto,
  EsimProductDto,
  OrderFulfillment,
  OrderItemDto,
  PackageUsageDto,
  TransactionDto,
  UserDto,
} from '@/payload/app-types';
import { isObject, makeMinimalRelationObj } from '@/payload/utils/data-utils';

import { makeTransactionObj, Transaction } from '@/feat-ordering/transactions/transactions';
import { EsimCard, makeEsimCardObj } from '../esim-cards/esim-card';
import { FulfillmentStatusType } from '../fulfillment-usage/fulfillment-status';
import { ProductSupplierType } from '../suppliers';
import { OrderItemLiveStatus, PackageUsage } from './order-item-types';

/**
 * Prefix for all Order items
 *
 * @see TransactionIdPrefix
 * @see EsimCardIdPrefix
 */
export const OrderItemIdPrefix = `969`;
/**
 * Also see {@link TransactionIdRegexp}.
 */
export const OrderItemIdRegexp = /^969\d{5}-\d{1,3}[a-z0-9]{6}$/;

/**
 * OrderItem made from {@link OrderItemDto} record from CMS
 *
 * @see OrderItemDto
 */
export interface OrderItem {
  id: string;
  user: UserDto;

  /**
   * Ordered package (data plan)
   */
  product: EsimProduct;

  /**
   * eSIM card related to the order. Might be empty for newly created items,
   * where order hasn't been fulfilled yet (and thus there's no eSIM card yet)/
   */
  eSIM: EsimCard | undefined;

  fulfillment: OrderFulfillment & {
    // Add a little bit more strict typings here
    status: FulfillmentStatusType;
    supplier: ProductSupplierType;
  };

  /**
   * Package (aka product) usage stats, synced regularly
   */
  packageUsage: PackageUsage;
  status: OrderItemLiveStatus;

  transaction: Transaction;
  price: number;
  supplierPrice: number;
  profit: number;

  /**
   * Last sync of provider data (package usage, eSIM status)
   */
  syncedAt?: string;
  updatedAt: string;
  createdAt: string;
}

/**
 * Translate CMS {@link OrderItemDto} to OrderItem, which is supposed to be easier to work with.
 *
 * Note: {@link OrderItemDto} is created during checkout process, in {@link prepareNewOrderItemDto}.
 * @see prepareNewOrderItemDto
 */
export function makeOrderItemObj(dto: OrderItemDto): OrderItem {
  if (!isObject(dto)) {
    return makeMinimalRelationObj(dto);
  }

  const product = makeEsimProductObj(dto.product as EsimProductDto);
  return {
    id: dto.id,
    user: dto.user as UserDto,

    product,
    eSIM: dto.esimCard ? makeEsimCardObj(dto.esimCard as EsimCardDto) : undefined,

    fulfillment: dto.fulfillment,

    transaction: makeTransactionObj(dto.transaction as TransactionDto),
    price: dto.price,
    supplierPrice: dto.supplierPrice,
    profit: dto.profit || calculateProfit(dto.price, dto.supplierPrice),

    packageUsage: {
      activationDate: dto.usage?.activationDate || undefined,
      expirationDate: dto.usage?.expirationDate || undefined,
      mbAllowance: dto.usage?.mbAllowance ?? product.planDataAllowance * 1024,
      mbUsed: dto.usage?.mbUsed ?? 0,
      mbUsageDelta: dto.usage?.mbUsageDelta ?? 0,
      minAllowance: dto.usage?.minAllowance ?? product.planVoiceAllowance,
      minUsed: dto.usage?.minUsed ?? 0,
      minUsageDelta: dto.usage?.minUsageDelta ?? 0,
    },

    status: {
      isPackageExpired: dto.status?.isPackageExpired || false,
      isPackageUsedUp: dto.status?.isPackageUsedUp || false,
      isActivelyUsingAllowance: dto.status?.isActivelyUsingAllowance || false,
    },
    syncedAt: dto.usageLastSyncAt ?? undefined,
    updatedAt: dto.updatedAt,
    createdAt: dto.createdAt,
  };
}

/**
 * Unique ID for Order item
 *
 * @see makeTransactionId
 */
export function makeOrderItemId(transactionId: string, index: number): string {
  const tid = transactionId.split('-');
  const datePart = tid[0].substring(3);
  return `${OrderItemIdPrefix}${datePart}-${index}${tid[1]}`;
}

/**
 * Determine "live" status of order item, based on usage data and expiration date
 */
export function getOrderItemLiveStatuses(
  usageData: PackageUsage | PackageUsageDto,
): OrderItemLiveStatus {
  const isPackageExpired = isOrderedPackageExpired(usageData);

  const hasAllowanceInfo = !!usageData.mbAllowance || !!usageData.minAllowance;
  const isDataPackage = (usageData.mbAllowance ?? 0) > 0;
  const isVoicePackage = (usageData.minAllowance ?? 0) > 0;

  let isDataUsedUp = !isDataPackage;
  if (usageData.mbAllowance) {
    isDataUsedUp = (usageData.mbUsed ?? 0) >= usageData.mbAllowance;
  }
  let isVoiceUsedUp = !isVoicePackage;
  if (usageData.minAllowance) {
    isVoiceUsedUp = (usageData.minUsed ?? 0) >= usageData.minAllowance;
  }

  const isActivelyUsingAllowance =
    (usageData.mbUsageDelta ?? 0) !== 0 || (usageData.minUsageDelta ?? 0) !== 0;

  const isPackageUsedUp: boolean = hasAllowanceInfo && isDataUsedUp && isVoiceUsedUp;
  return {
    isPackageExpired,
    isPackageUsedUp,
    isActivelyUsingAllowance: isActivelyUsingAllowance && !isPackageExpired && !isPackageUsedUp,
  };
}

/**
 * Determine if package is already expired
 */
export function isOrderedPackageExpired(usageData: PackageUsage | PackageUsageDto): boolean {
  const expirationDate = !!usageData.expirationDate && new Date(usageData.expirationDate);
  return !!expirationDate && new Date() >= expirationDate;
}
