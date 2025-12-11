import { FieldHook } from 'payload';

export const populateUserId: FieldHook = async ({ req, value, operation }) => {
  if (operation === 'create') {
    return req.user?.id;
  }
  return `${value}`;
};
