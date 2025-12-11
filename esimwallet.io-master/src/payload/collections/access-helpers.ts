import type { Access, AccessResult, FieldAccess, PayloadRequest } from 'payload';

import { UserDto } from '@/payload/app-types';
import { UserRole } from '@/payload/collections/users/roles';

/**
 * Who can log in to PayloadCMS backend UI.
 * Only needs to be set on the `Users` collection (seems like).
 */
export const hasAccessToPayloadUi = ({ req: { user } }: { req: PayloadRequest }): boolean => {
  return checkForRoles([UserRole.Admin, UserRole.Editor], user);
};

export const accessAdminsOrLoggedIn: Access = ({ req }) => {
  if (checkForRoles([UserRole.Admin], req.user)) {
    return true;
  }
  return !!req.user;
};
export const accessSupportOrLoggedIn: Access = ({ req }) => {
  if (checkForRoles([UserRole.CustomerSupport, UserRole.Admin], req?.user)) {
    return true;
  }
  return !!req.user;
};

/**
 * Access check: only admins
 */
export const accessAdminsOnly: Access = ({ req: { user } }) => {
  return checkForRoles([UserRole.Admin], user);
};
export const fieldAccessAdminsOnly: FieldAccess = accessAdminsOnly as FieldAccess;

/**
 * Access check: editors (or admins)
 */
export const accessEditorsOnly: Access = ({ req: { user } }) => {
  return checkForRoles([UserRole.Editor, UserRole.Admin], user);
};
export const accessSupportOnly: Access = ({ req: { user } }) => {
  return checkForRoles([UserRole.CustomerSupport, UserRole.Admin], user);
};

/**
 * Access check: admin or the user himself
 */
export const accessAdminsOrUserHimself: Access = ({ req: { user } }): AccessResult => {
  if (user) {
    if (checkForRoles([UserRole.Admin], user)) {
      return true;
    }

    return {
      id: {
        equals: user.id,
      },
    };
  }

  return false;
};

/**
 * Access check: admin or the user "owning" the record (through 'user' relationship)
 */
export const accessAdminsOrUserOwning: Access = ({ req: { user } }): AccessResult => {
  if (user) {
    if (checkForRoles([UserRole.Admin], user)) {
      return true;
    }

    return {
      user: {
        equals: user.id,
      },
    };
  }

  return false;
};

export const accessSupportOrUserOwning: Access = ({ req: { user } }): AccessResult => {
  if (user) {
    if (checkForRoles([UserRole.CustomerSupport, UserRole.Admin], user)) {
      return true;
    }

    return {
      user: {
        equals: user.id,
      },
    };
  }

  return false;
};

/**
 * Access check: anyone is allowed
 */
export const accessAnyone: Access = () => true;

export function hasRole(role: UserRole, user: UserDto | undefined | null): boolean {
  return checkForRoles([role], user);
}
export function hasCustomerSupportRole(user: UserDto | undefined | null): boolean {
  return checkForRoles([UserRole.CustomerSupport, UserRole.Admin], user);
}

/**
 * Check if User has any of requested roles
 */
export function checkForRoles(roles: UserDto['roles'], user: UserDto | undefined | null): boolean {
  if (!user || !user.roles?.length) {
    return false;
  }
  return user.roles.some((userRole) => {
    return roles.includes(userRole);
  });
}
