import { NextResponse } from 'next/server';
import { PayloadHandler, PayloadRequest } from 'payload';

import { responseWithError } from '@/lib/responses';
import { UserDto } from '@/payload/app-types';

import { findOrder } from '../order-items/find-order-items';
import { isOrderOrEsimOwnedByUser } from '../utils-esim-core';

/**
 * Connect to supplier, fetch and update order item with the newest usage stats.
 * It'll also create eSIM Card record for new orders.
 */
export const syncProviderDataEndpoint: PayloadHandler = async (
  req: PayloadRequest,
): Promise<NextResponse> => {
  const { payload, routeParams } = req;
  const logger = payload.logger;
  const orderId = (routeParams?.order as string) ?? '';
  logger.info(`SYNC PROVIDER DATA for Order#${orderId}...`);

  const user = req.user as UserDto | undefined;
  if (!user) {
    return NextResponse.json(
      responseWithError('Invalid user. Are you logged in?', 'Unauthorized'),
      { status: 401 },
    );
  }

  const order = await findOrder(payload, orderId);
  logger.info(`\t for eSIM: ${order.eSIM?.id ?? 'not created yet'}`);

  if (order && !isOrderOrEsimOwnedByUser(order, user)) {
    return NextResponse.json(
      responseWithError(`No permissions to Order#${orderId}`, 'USER_NOT_OWNER'),
      { status: 403 },
    );
  }

  if (order) {
    return NextResponse.json({}, { status: 201 });
  }

  logger.error(`ERROR: Couldn't find Order#${orderId}.`);
  return NextResponse.json(
    responseWithError(`Couldn't find Order#${orderId}`, 'TRANSACTION_NOT_FOUND'),
    { status: 404 },
  );
};
