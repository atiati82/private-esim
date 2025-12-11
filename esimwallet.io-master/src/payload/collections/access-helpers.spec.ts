import { describe, expect, test } from 'vitest';
import type { AccessArgs, PayloadRequest } from 'payload';

import { UserDto } from '@/payload/app-types';
import {
  accessAdminsOnly,
  accessAdminsOrUserHimself,
  accessAdminsOrUserOwning,
  accessEditorsOnly,
  checkForRoles,
  hasAccessToPayloadUi,
} from '@/payload/collections/access-helpers';
import { allUserRoles, UserRole } from '@/payload/collections/users/roles';

describe('Payload: user roles', () => {
  const mockUserWithRoles = (roles: UserRole[] | undefined): UserDto => {
    return { id: 'X', roles } as UserDto;
  };
  const mockAccessArgs = (roles: UserRole[] | undefined): AccessArgs => {
    return { req: { user: mockUserWithRoles(roles) } as PayloadRequest };
  };
  const mockAccessArgsEmptyUser = (): AccessArgs => {
    return { req: { user: null } as PayloadRequest };
  };

  describe('hasAccessToPayloadUi()', () => {
    const mockReq = (roles: UserRole[] | undefined): { req: PayloadRequest } => {
      return { req: { user: mockUserWithRoles(roles) } as PayloadRequest };
    };
    test('returns FALSE for a user with no admin roles', () => {
      const reqWithEmptyUser = mockReq(undefined);
      expect(hasAccessToPayloadUi(reqWithEmptyUser)).toBe(false);
      const reqWithEmptyUser2 = mockReq([]);
      expect(hasAccessToPayloadUi(reqWithEmptyUser2)).toBe(false);
      const reqWithCustomer = mockReq([UserRole.Customer]);
      expect(hasAccessToPayloadUi(reqWithCustomer)).toBe(false);
    });
    test('returns TRUE for a admin user', () => {
      const reqWithAdminUser = mockReq([UserRole.Editor, UserRole.Admin]);
      expect(hasAccessToPayloadUi(reqWithAdminUser)).toBe(true);
    });
  });

  describe('accessAdminsOnly()', () => {
    test('returns FALSE for a user with no roles', () => {
      const reqWithUser = mockAccessArgs(undefined);
      expect(accessAdminsOnly(reqWithUser)).toBe(false);
      const reqWithUser2 = mockAccessArgs([]);
      expect(accessAdminsOnly(reqWithUser2)).toBe(false);
      const reqWithEmptyUser = mockAccessArgsEmptyUser();
      expect(accessAdminsOnly(reqWithEmptyUser)).toBe(false);
    });
    test('returns FALSE for a user with non-admin roles', () => {
      const reqWithUser = mockAccessArgs([UserRole.Customer]);
      expect(accessAdminsOnly(reqWithUser)).toBe(false);
    });
    test('returns TRUE for a user with admin role', () => {
      const reqWithUser = mockAccessArgs([UserRole.Admin]);
      expect(accessAdminsOnly(reqWithUser)).toBe(true);
    });
  });

  describe('accessEditorsOnly()', () => {
    test('returns FALSE for a user with no roles', () => {
      const reqWithUser = mockAccessArgs(undefined);
      expect(accessEditorsOnly(reqWithUser)).toBe(false);
      const reqWithUser2 = mockAccessArgs([]);
      expect(accessEditorsOnly(reqWithUser2)).toBe(false);
      const reqWithEmptyUser = mockAccessArgsEmptyUser();
      expect(accessAdminsOnly(reqWithEmptyUser)).toBe(false);
    });
    test('returns FALSE for a user with non-editor roles', () => {
      const reqWithUser = mockAccessArgs([UserRole.Customer]);
      expect(accessEditorsOnly(reqWithUser)).toBe(false);
    });
    test('returns TRUE for a user with admin role', () => {
      const reqWithUser = mockAccessArgs([UserRole.Admin]);
      expect(accessEditorsOnly(reqWithUser)).toBe(true);
    });
    test('returns TRUE for a user with editor role', () => {
      const reqWithUser = mockAccessArgs([UserRole.Editor]);
      expect(accessEditorsOnly(reqWithUser)).toBe(true);
    });
  });

  describe('accessAdminsOrUserHimself()', () => {
    test('returns FALSE for an empty user', () => {
      const reqWithEmptyUser = mockAccessArgsEmptyUser();
      expect(accessAdminsOrUserHimself(reqWithEmptyUser)).toBe(false);
    });
    test('returns Where-clause for a user', () => {
      const reqWithUser = mockAccessArgs([]);
      expect(accessAdminsOrUserHimself(reqWithUser)).toEqual({ id: { equals: 'X' } });
      const reqWithUser2 = mockAccessArgs([UserRole.Customer]);
      expect(accessAdminsOrUserHimself(reqWithUser2)).toEqual({ id: { equals: 'X' } });
    });
    test('returns TRUE for admin users', () => {
      const reqWithUser = mockAccessArgs([UserRole.Admin]);
      expect(accessAdminsOrUserHimself(reqWithUser)).toBe(true);
    });
  });

  describe('accessAdminsOrUserOwning()', () => {
    test('returns FALSE for an empty user', () => {
      const reqWithEmptyUser = mockAccessArgsEmptyUser();
      expect(accessAdminsOrUserOwning(reqWithEmptyUser)).toBe(false);
    });
    test('returns Where-clause for a user', () => {
      const reqWithUser = mockAccessArgs([]);
      expect(accessAdminsOrUserOwning(reqWithUser)).toEqual({ user: { equals: 'X' } });
      const reqWithUser2 = mockAccessArgs([UserRole.Customer]);
      expect(accessAdminsOrUserOwning(reqWithUser2)).toEqual({ user: { equals: 'X' } });
    });
    test('returns TRUE for admin users', () => {
      const reqWithUser = mockAccessArgs([UserRole.Admin]);
      expect(accessAdminsOrUserOwning(reqWithUser)).toBe(true);
    });
  });

  describe('checkForRoles()', () => {
    test('returns FALSE for an empty user', () => {
      expect(checkForRoles([], mockUserWithRoles(undefined))).toBe(false);
      expect(checkForRoles([UserRole.Customer], mockUserWithRoles(undefined))).toBe(false);
    });
    test('returns FALSE if theres no (requested) roles', () => {
      expect(checkForRoles([], mockUserWithRoles([]))).toBe(false);
    });
    test('returns TRUE if there is a matching role', () => {
      expect(checkForRoles([UserRole.Admin], mockUserWithRoles(allUserRoles))).toBe(true);
      expect(checkForRoles([UserRole.Customer], mockUserWithRoles(allUserRoles))).toBe(true);
    });
    test('returns TRUE if there are some matching roles', () => {
      expect(
        checkForRoles([UserRole.Admin, UserRole.Customer], mockUserWithRoles([UserRole.Customer])),
      ).toBe(true);
      expect(
        checkForRoles([UserRole.Admin, UserRole.Customer], mockUserWithRoles([UserRole.Admin])),
      ).toBe(true);
    });
    test('returns FALSE if there are no matching roles', () => {
      expect(checkForRoles([UserRole.Admin], mockUserWithRoles([UserRole.Customer]))).toBe(false);
    });
  });
});
