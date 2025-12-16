import { currentDateStrForUid, generateRandomString } from '@/lib/generate-random-string';
import { OrderItemDto, TransactionDto, UserDto } from '@/payload/app-types';
import { isObject, makeMinimalRelationObj } from '@/payload/utils/data-utils';

import { TransactionPaymentStatus, transactionPaymentStatusDefault } from './transaction-symbols';

export const TransactionIdPrefix = `999`;
/**
 * Also see {@link OrderItemIdRegexp}.
 */
export const TransactionIdRegexp = /^(999)(\d{5})-([0-9a-z]{6})$/;

/**
 * Transaction entity
 */
export interface Transaction {
  id: string;
  user: UserDto;
  total: number;

  // Can't make real `OrderItem` object here, since it'd cause circular dependency...
  orderItems: OrderItemDto[];

  paymentId: string;
  paymentStatus: TransactionPaymentStatus;

  createdAt: string;
  updatedAt: string;
}

/**
 * Prepare Transaction entity, to be used elsewhere in the app,
 * based on {@link TransactionDto} from CMS.
 */
export function makeTransactionObj(dto: TransactionDto): Transaction {
  if (!isObject(dto)) {
    return makeMinimalRelationObj<Transaction>(dto);
  }

  return {
    id: dto.id,
    user: isObject(dto.user) ? dto.user : makeMinimalRelationObj<UserDto>(dto.user),
    total: dto.total,

    orderItems:
      dto.orderItems?.docs?.map((item) => {
        // Can't make real `OrderItem` object here, since it'd cause circular dependency...
        return isObject(item) ? (item as OrderItemDto) : makeMinimalRelationObj<OrderItemDto>(item);
      }) ?? [],

    paymentId: dto.paymentId ?? '',
    paymentStatus:
      (dto.paymentStatus as TransactionPaymentStatus) ?? transactionPaymentStatusDefault,

    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function makeTransactionId(): string {
  return `${TransactionIdPrefix}${currentDateStrForUid()}-` + generateRandomString(6);
}
