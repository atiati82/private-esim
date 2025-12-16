import { BasePayload, PayloadRequest } from 'payload';

import { UserDto } from '@/payload/app-types';
import { UsersCollectionId } from '@/payload/collections';

export async function findUser(
  payload: BasePayload,
  userId: string,
): Promise<UserDto | undefined | null> {
  return payload.findByID({
    collection: UsersCollectionId,
    id: userId,
    disableErrors: true,
  });
}

export async function findCurrentUserFromReq(
  req: PayloadRequest,
): Promise<UserDto | undefined | null> {
  const { payload, user } = req;

  return findUser(payload, user?.id ?? '');
}
