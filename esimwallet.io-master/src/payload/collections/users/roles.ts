import type { OptionObject } from 'payload';

/**
 * Available User roles
 */
export enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  CustomerSupport = 'support',
  Customer = 'customer',
}

/**
 * Roles to select in CMS
 */
export const userRolesOptions: OptionObject[] = [
  { value: UserRole.Admin, label: 'Admin' },
  { value: UserRole.Editor, label: 'Editor' },
  { value: UserRole.CustomerSupport, label: 'Customer Support' },
  { value: UserRole.Customer, label: 'Customer' },
];

export const allUserRoles: UserRole[] = userRolesOptions.map((r) => r.value as UserRole);
