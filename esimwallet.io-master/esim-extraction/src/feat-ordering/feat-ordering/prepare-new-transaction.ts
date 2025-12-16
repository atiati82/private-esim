import { OrderItem } from '@/esim-core/order-items/order-item';
import { OrderItemDto, TransactionDto, UserDto } from '@/payload/app-types';
import { OmitPayloadFields } from '@/payload/utils/omit-payload-fields';

import { getOrderItemsTotalAmount } from './utils-ordering';

export type TransactionDtoForCreation = OmitPayloadFields<TransactionDto> & { id?: string };

type NewTransactionContext = {
  transactionId: string;
  orderItems: OrderItem[] | OrderItemDto[];
  user: UserDto;
};

export function prepareNewTransactionDto(ctx: NewTransactionContext): TransactionDtoForCreation {
  const { transactionId, orderItems, user } = ctx;

  return {
    id: transactionId,
    user: user.id,
    total: getOrderItemsTotalAmount(orderItems),
  };
}
