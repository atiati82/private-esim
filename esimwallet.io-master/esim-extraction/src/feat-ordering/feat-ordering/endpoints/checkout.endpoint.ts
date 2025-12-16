import { NextResponse } from 'next/server';
import { PayloadRequest } from 'payload';

import { EsimProduct } from '@/data/esim-product';
import { findProducts } from '@/data/find-products';
import { findCurrentUserFromReq } from '@/data/find-user';
import { OrderItemsCollectionId } from '@/esim-core/order-items/collection';
import { FetchErrorBody, responseWithError } from '@/lib/responses';
import { OrderItemDto, UserDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';

import { cartItemsToProductIds } from '@/feat-cart/cart-helpers';
import { CartState } from '@/feat-cart/cart.store';
import { CallCheckoutResponse } from '@/feat-ordering/call-checkout-endpoint';
import { prepareNewOrderItemDto } from '@/feat-ordering/prepare-new-order-item';
import { prepareNewTransactionDto } from '@/feat-ordering/prepare-new-transaction';
import { TransactionsCollectionId } from '@/feat-ordering/transactions/collection';
import { findMostRecentUnpaidTransaction } from '@/feat-ordering/transactions/find-transactions';
import { makeTransactionId } from '@/feat-ordering/transactions/transactions';
import { hasTheSameCartItems } from '@/feat-ordering/utils-ordering';

/**
 * This API endpoint during checkout process, receives cart state from the front-end
 * and creates necessary CMS records: {@link TransactionDto} and related {@link OrderItemDto}s
 * (i.e. ordered eSIM packages).
 *
 * @see callCheckoutEndpoint
 * @see createNewTransactionAndOrderItems
 */
export async function checkoutEndpoint(
  req: PayloadRequest,
): Promise<NextResponse<CallCheckoutResponse | FetchErrorBody>> {
  const { payload } = req;
  const logger = payload.logger;

  const user = await findCurrentUserFromReq(req);
  if (!user) {
    return NextResponse.json(
      responseWithError('Invalid user. Are you logged in?', 'Unauthorized'),
      { status: 401 },
    );
  }

  const cartState: CartState = await req.json?.();
  if (!cartState?.cartItems?.length) {
    return NextResponse.json(
      responseWithError('Invalid or empty Cart data received', 'INVALID_CART_STATE'),
      { status: 400 },
    );
  }

  const productIds = cartItemsToProductIds(cartState.cartItems);
  logger.info(productIds, `CREATE TRANSACTION... for cart items:`);

  //
  // Case: try to find recent (unpaid) transaction with the same Cart items
  //
  const recentTransaction = await findMostRecentUnpaidTransaction(payload, user.id);
  if (recentTransaction && hasTheSameCartItems(recentTransaction, cartState.cartItems)) {
    const response: CallCheckoutResponse = {
      isNew: false,
      transactionId: recentTransaction.id,
      orderItems: recentTransaction.orderItems.map((o) => getRelationIdVal(o)!),
      total: recentTransaction.total,
    };
    logger.info(`\t DONE: reused recent transaction: ${recentTransaction.id} with same CartState`);
    return NextResponse.json(response, { status: 201 });
  }

  //
  // Case: couldn't find recent transaction to re-cycle, so create a new one
  //
  const response: CallCheckoutResponse = await createNewTransactionAndOrderItems(req, cartState);
  return NextResponse.json(response, { status: 201 });
}

export async function createNewTransactionAndOrderItems(
  req: PayloadRequest,
  cartState: CartState,
): Promise<CallCheckoutResponse> {
  const { payload } = req;
  const logger = payload.logger;
  const user = req.user as UserDto;

  const transactionId = makeTransactionId();
  logger.info(`\t Creating new transaction ${transactionId}...`);

  const productIds = cartItemsToProductIds(cartState.cartItems);
  const products = await findProducts(payload, { ids: productIds });

  const ordersToCreate: Promise<OrderItemDto>[] = productIds.map((productId, idx) => {
    const product = products.find((p) => p.id === productId) as EsimProduct;
    if (!product) {
      throw new Error(
        `Invalid/non-existing ${productId} product found in the cart. Clear the cart and try again.`,
      );
    }

    return payload.create({
      req: { ...req, data: cartState }, // incl. cart state in req.data - collection hooks might depend on it
      collection: OrderItemsCollectionId,
      data: prepareNewOrderItemDto({ transactionId, product, user, idx }),
    });
  });

  let orderItems: OrderItemDto[] = [];
  try {
    orderItems = await Promise.all(ordersToCreate);
  } catch (error) {
    logger.error(
      { transactionId, productIds },
      `ERROR while creating Order Items for transaction.`,
    );
    throw error;
  }

  const orderItemIds = orderItems.map((order) => order.id);
  logger.info(
    { transactionId, orderItemIds },
    `\t Order items created, about to create Transaction record...`,
  );

  const newTransaction = await payload.create({
    req: { ...req, data: cartState }, // incl. cart state in req.data - collection hooks might depend on it
    collection: TransactionsCollectionId,
    data: prepareNewTransactionDto({ transactionId, orderItems, user }),
  });
  logger.info(`CREATE TRANSACTION ${transactionId} - DONE`);

  return {
    isNew: true,
    transactionId: newTransaction.id,
    orderItems: orderItemIds,
    total: newTransaction.total,
  };
}
