import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { UserDto } from '@/payload/app-types';
import { UsersCollectionId } from '@/payload/collections';
import { appGetPayload } from '@/payload/utils/get-payload';

import {
  getUserByVerifyToken,
  isValidToken,
  verifyAccountFromToken,
} from '@/app/[locale]/account/verify/[token]/token-utils';
import { mockAccountToVerifyInPayload } from '@/testing/users-in-payload';

describe('token-utils', () => {
  const mockVerifyToken = 'a9b6a3f58179931230c65a2e8e52e854cd89a666';

  test('isValidToken() should check if token looks valid', () => {
    expect(isValidToken(mockVerifyToken)).toBe(true);
    expect(isValidToken('abc')).toBe(false);
    expect(isValidToken(null)).toBe(false);
  });

  describe('getUserByVerifyToken()', async () => {
    let mockUserAccount: UserDto;
    beforeAll(async () => {
      mockUserAccount = await mockAccountToVerifyInPayload({});
    });
    afterAll(async () => {
      const payload = await appGetPayload();
      await payload.delete({
        collection: UsersCollectionId,
        where: { _verificationToken: { equals: mockUserAccount._verificationToken } },
      });
    });
    test('should not find user: if token is invalid', async () => {
      const res = await getUserByVerifyToken('some.invalid.token');
      expect(res).toBe(undefined);
    });
    test('should not find user: if token valid but not in db', async () => {
      const res = await getUserByVerifyToken(mockVerifyToken);
      expect(res).toBe(undefined);
    });
    test('should find user', async () => {
      const res = await getUserByVerifyToken(mockUserAccount._verificationToken);
      expect(res).toEqual(
        expect.objectContaining({
          email: mockUserAccount.email,
          _verified: false,
          _verificationToken: mockUserAccount._verificationToken,
        } as UserDto),
      );
    });
  });

  describe('verifyAccountFromToken()', async () => {
    let mockUserAccount: UserDto;
    beforeAll(async () => {
      mockUserAccount = await mockAccountToVerifyInPayload({});
    });
    afterAll(async () => {
      const payload = await appGetPayload();
      await payload.delete({
        collection: UsersCollectionId,
        where: { _verificationToken: { equals: mockUserAccount._verificationToken } },
      });
    });
    test('should mark account as verified', async () => {
      const res = await verifyAccountFromToken(
        mockUserAccount.id,
        mockUserAccount._verificationToken!,
      );
      expect(res).toBe(true);

      const resAlreadyVerified = await verifyAccountFromToken(
        mockUserAccount.id,
        mockUserAccount._verificationToken!,
      );
      expect(resAlreadyVerified).toBe(false);
    });
    test('should not work for non-existing token', async () => {
      const res = await verifyAccountFromToken(mockUserAccount.id, mockVerifyToken);
      expect(res).toBe(false);
    });
  });
});
