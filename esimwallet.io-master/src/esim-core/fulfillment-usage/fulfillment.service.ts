import { isTestingEnv } from '@/env-helpers';
import { AppConsoleLogger, getConsoleLogger } from '@/lib/logger-console';

import { OrderItem } from '../order-items/order-item';
import { ProductSupplierType } from '../suppliers';

const FULFILLMENT_SERVICE_ENABLE_LOGGING = !isTestingEnv;

export abstract class FulfillmentService {
  public readonly supplier: ProductSupplierType;

  /**
   * {@link OrderItem} for which this service does fulfillment
   */
  public readonly order: OrderItem;

  protected logger: AppConsoleLogger;

  constructor(orderItem: OrderItem) {
    this.supplier = orderItem.fulfillment.supplier;
    this.order = orderItem;
    this.logger = getConsoleLogger(`FF ${orderItem.id}`, {
      enableLogging: FULFILLMENT_SERVICE_ENABLE_LOGGING,
    });
  }

  /**
   * Place a new order from Supplier
   *
   * @param order eSIMwallet order item (with ordered {@link EsimProduct},
   *              for which a new order from Supplier is to be made
   *
   * @return Order fulfillment info + essential info/status about eSIM card for that order
   */
  // abstract placeNewOrder(): Promise<[OrderFulfillment, Partial<EsimCardDto>]>;

  /**
   * Get usage info + eSIM card status for given order
   */
  // abstract syncProviderData(): Promise<[Partial<OrderItemDto>, Partial<EsimCardDto>]>;
}
