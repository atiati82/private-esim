import type { Locale as PayloadLocale } from 'payload';

import type { UserDto } from '@/payload/app-types';

/**
 * Public URL, where the site is available
 */
export const AppPublicUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || '';

/**
 * PayloadCMS API url
 */
export const PayloadApiUrl = AppPublicUrl + '/api';

/**
 * Our application API url (for Next.js route handlers)
 */
export const EsimApiUrl = '/esim-api';

export const MeUserApiUrl = AppPublicUrl + '/api/users/me';
export const UsersLoginUrl = AppPublicUrl + '/api/users/login';
export const UsersLogoutUrl = AppPublicUrl + '/api/users/logout';
export const AccountCreateApiUrl = AppPublicUrl + '/api/users';

/**
 * PayloadCMS admin UI URL
 */
export const PayloadAdminUrl = '/payload';

export const cmsLocales: PayloadLocale[] = [
  { code: 'de', label: 'German' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'pl', label: 'Polish' },
  { code: 'ru', label: 'Russian' },
];

//
// Auth: initial user created on empty db. Also set to default auto-login on localhost
//
export const initDevUser = 'admin@esimwallet.io';
export const initDevPassword = 'admin';
export const initUsersToCreate: Partial<UserDto>[] = [
  {
    email: 'editor@esimwallet.io',
    password: initDevPassword,
    roles: ['editor'],
    _verified: true,
  },
  { email: 'editor2@esimwallet.io', password: initDevPassword, roles: ['editor'] },
  { email: 'customer@esimwallet.io', password: initDevPassword, _verified: true },
  { email: 'customer2@esimwallet.io', password: initDevPassword },
];

export const emailFromAddress = 'info@esimwallet.io';
export const emailFromName = 'eSIMwallet';
