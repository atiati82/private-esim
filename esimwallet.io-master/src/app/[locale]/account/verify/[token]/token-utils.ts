import Joi from 'joi';

import { UserDto } from '@/payload/app-types';
import { UsersCollectionId } from '@/payload/collections';
import { appGetPayload } from '@/payload/utils/get-payload';

export function isValidToken(token: string | null | undefined): boolean {
  const tokenSchema = Joi.string().token().length(40);
  return !tokenSchema.validate(token).error;
}

/**
 * Get user account (verified or not) by verification token
 */
export async function getUserByVerifyToken(
  token: string | null | undefined,
): Promise<UserDto | undefined> {
  if (!isValidToken(token)) {
    return undefined;
  }

  const payload = await appGetPayload();
  const res = await payload.find({
    collection: UsersCollectionId,
    where: { _verificationToken: { equals: token } },
    showHiddenFields: true,
  });

  return res.docs.shift();
}

/**
 * Mark account as verified (and thus, possible to log in)
 */
export async function verifyAccountFromToken(userId: string, token: string): Promise<boolean> {
  if (!isValidToken(token)) {
    return false;
  }

  const payload = await appGetPayload();
  const res = await payload.update({
    collection: UsersCollectionId,
    where: {
      id: { equals: userId },
      _verified: { equals: false },
      _verificationToken: { equals: token },
    },
    data: { _verified: true },
  });

  return res.docs.length > 0;
}
