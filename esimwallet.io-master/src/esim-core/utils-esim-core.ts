import { UserDto } from '@/payload/app-types';
import { hasCustomerSupportRole } from '@/payload/collections/access-helpers';
import { getRelationIdVal } from '@/payload/utils/data-utils';

import { OrderItem } from './order-items/order-item';

/**
 * Check if user has "rights" for the Order OR the eSIM card record.
 *
 * This is being used to determine if eSIM card should be displayed
 * in customer's *My Wallet* page.
 */
export function isOrderOrEsimOwnedByUser(
  order: OrderItem,
  user: UserDto | undefined,
  allowCustomerSupport = true,
): boolean {
  if (!user?.id) {
    return false;
  }

  if (allowCustomerSupport && hasCustomerSupportRole(user)) {
    return true;
  }

  const orderUserId = getRelationIdVal(order.user);
  const esimUserId = getRelationIdVal(order.eSIM?.user);
  return orderUserId === user.id || esimUserId === user.id;
}
