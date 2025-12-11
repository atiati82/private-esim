import { TransactionDto, UserDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { TransactionsCollectionId } from '@/feat-ordering/transactions/collection';
import { makeTransactionId } from '@/feat-ordering/transactions/transactions';
import { getOrderItemsTotalAmount } from '@/feat-ordering/utils-ordering';
import { mockOrderItemInPayload } from './order-items-in-payload';
import { mockUserInPayload } from './users-in-payload';

export async function mockTransactionInPayload(
  dto: Partial<TransactionDto> = {},
): Promise<TransactionDto> {
  const payload = await appGetPayloadStandalone();

  const user: UserDto = (dto.user as UserDto) ?? (await mockUserInPayload({}));
  const transactionId = dto.id ?? makeTransactionId();
  const item0 = await mockOrderItemInPayload({ transaction: transactionId, user });
  const item1 = await mockOrderItemInPayload({ transaction: transactionId, user });

  const data: TransactionDto = {
    id: transactionId,
    createdAt: '',
    updatedAt: '',
    ...dto,
    user: getRelationIdVal(user)!,
    total: getOrderItemsTotalAmount([item0, item1]),
  };

  await payload.create({
    collection: TransactionsCollectionId,
    data,
    overrideAccess: true,
    showHiddenFields: true,
  });

  const transactionDto = await payload.findByID({
    collection: TransactionsCollectionId,
    id: transactionId,
    depth: 1,
    disableErrors: true,
  });
  return transactionDto as TransactionDto;
}
