import type { CollectionBeforeChangeHook } from 'payload';

import { urlForAccount } from '@/lib/urls';
import { UserDto } from '@/payload/app-types';
import { UsersCollectionId } from '@/payload/collections';
import { accountCreateSchema } from '@/payload/collections/hooks/accountCreateSchema';
import { appGetPayload } from '@/payload/utils/get-payload';

export const accountCreateHook: CollectionBeforeChangeHook<UserDto> = async ({
  data,
  operation,
  req,
}): Promise<Partial<UserDto>> => {
  const requestFrom = req.headers.get('referer');
  // Only proceed for account create form submission
  if (operation !== 'create' || !requestFrom?.includes(urlForAccount())) {
    return data;
  }

  const { value, error } = accountCreateSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error?.message) {
    throw error;
  }

  const safeData = value as UserDto;
  await errorIfEmailAlreadyRegistered(safeData.email);
  return safeData;
};

/**
 * Throw descriptive error when e-mail address is already registered.
 * Payload, by default, only says that email field is invalid (when already in use).
 * This is the same error when the email is invalid (e.g. some nonsense).
 * This is confusing - here we generate more meaningful error msg.
 */
export async function errorIfEmailAlreadyRegistered(email: string): Promise<void> {
  const payload = await appGetPayload();
  const emailInDb = await payload.find({
    collection: UsersCollectionId,
    where: { email: { equals: email } },
  });
  if (emailInDb.totalDocs > 0) {
    throw new Error(
      `E-mail ${email} is already registered. Use login link below to sign in with it, or provide different e-mail address.`,
    );
  }
}
