import { MmFulfillmentService } from '@/esim-suppliers/mm/mm-fulfillment/mm-fulfillment.service';
import { OrderItem } from '../order-items/order-item';
import { ProductSupplier } from '../suppliers';
import type { FulfillmentService } from './fulfillment.service';

export class FulfillmentFactoryService {
  /**
   * Depending on the product's supplier, prepares the right {@link FulfillmentService}
   * to handle the fulfillment.
   */
  static create<T extends FulfillmentService>(orderItem: OrderItem): T {
    const forSupplier = orderItem.fulfillment.supplier as ProductSupplier;

    switch (forSupplier) {
      case ProductSupplier.MobiMatter:
        return new MmFulfillmentService(orderItem) as unknown as T;
      default:
        throw new Error(`FulfillmentFactoryService: unsupported supplier: ${forSupplier}.`);
    }
  }
}
