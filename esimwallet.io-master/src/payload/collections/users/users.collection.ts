import { FieldAccess, type CollectionConfig } from 'payload';

import { UserDto } from '@/payload/app-types';
import { UsersCollectionId } from '@/payload/collections';
import {
  accessAdminsOnly,
  accessAdminsOrUserHimself,
  accessAnyone,
  checkForRoles,
  fieldAccessAdminsOnly,
  hasAccessToPayloadUi,
} from '@/payload/collections/access-helpers';
import { accountCreateHook } from '@/payload/collections/hooks/accountCreateHook';
import { validateReCaptchaHook } from '@/payload/collections/hooks/validateReCaptcha';
import { UserRole, userRolesOptions } from '@/payload/collections/users/roles';
import {
  accountVerifyEmailSubject,
  accountVerifyHtmlEmail,
} from '@/payload/collections/users/user-emails';

const readBySupportOrUserOwning: FieldAccess<UserDto> = ({ id, req }) => {
  return (
    checkForRoles([UserRole.CustomerSupport, UserRole.Admin], req.user) ||
    (!!req.user && id === req.user.id)
  );
};

export const UsersCollection: CollectionConfig = {
  slug: UsersCollectionId,
  typescript: { interface: 'UserDto' },
  auth: {
    tokenExpiration: 30 * 24 * 3600,
    maxLoginAttempts: 5,
    lockTime: 3600,
    verify: {
      generateEmailSubject: accountVerifyEmailSubject,
      generateEmailHTML: accountVerifyHtmlEmail,
    },
  },
  access: {
    admin: hasAccessToPayloadUi,
    create: accessAnyone,
    delete: accessAdminsOnly,
    read: accessAdminsOrUserHimself,
    update: accessAdminsOrUserHimself,
  },
  admin: {
    useAsTitle: 'email',
    listSearchableFields: ['email', 'fullName', 'stripeCustomerId'],
    defaultColumns: ['email', 'fullName', 'roles', 'stripeCustomerId', 'lastActiveAt'],
    description: 'Private eSIM customers and our PayloadCMS users.',
    pagination: { defaultLimit: 100 },
  },
  hooks: {
    beforeChange: [
      validateReCaptchaHook, // Account creation: ReCaptcha
      accountCreateHook, // Account creation: improved error (e.g. if email already registered)
    ],
    beforeLogin: [
      // TODO: validateReCaptchaHook,
    ],
  },
  defaultSort: '-updatedAt',
  labels: {
    singular: 'User, Customer',
    plural: 'Users, Customers',
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      defaultValue: '',
    },
    {
      name: 'roles',
      type: 'select',
      label: 'User Roles',
      hasMany: true,
      required: true,
      saveToJWT: true,
      options: userRolesOptions,
      defaultValue: [UserRole.Customer],
      access: {
        create: fieldAccessAdminsOnly,
        update: fieldAccessAdminsOnly,
      },
      admin: { position: 'sidebar' },
    },
    {
      // TODO: log most recent customer active time
      name: 'lastActiveAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/payload/collections/users/field-stripe-customer#FieldStripeCustomer',
        },
      },
      access: {
        read: readBySupportOrUserOwning,
        update: () => false,
      },
    },
  ],
};
