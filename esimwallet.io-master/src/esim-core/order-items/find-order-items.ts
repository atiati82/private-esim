import type { Payload, Where } from 'payload';

import { OrderItemsCollectionId } from './collection';
import { makeOrderItemObj, OrderItem } from './order-item';

export async function findOrder(
  payload: Payload,
  id: string,
  options: { depth?: number } = {},
): Promise<OrderItem> {
  const res = await payload.findByID({
    collection: OrderItemsCollectionId,
    id,
    depth: options.depth ?? 1,
  });
  return makeOrderItemObj(res);
}

type FindOrdersConditions = {
  ids?: string[];
};
export async function findOrders(
  payload: Payload,
  cond: FindOrdersConditions = {},
  options: { depth?: number } = {},
): Promise<OrderItem[]> {
  const where: Where = {};
  if (cond.ids) {
    where.id = { in: cond.ids };
  }
  const res = await payload.find({
    collection: OrderItemsCollectionId,
    where,
    limit: 99,
    depth: options.depth ?? 1,
  });
  return res.docs.map(makeOrderItemObj);
}
