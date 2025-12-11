import { MmUsageTrackingService } from '@/esim-suppliers/mm/mm-fulfillment/mm-usage-tracking.service';
import { ProductSupplier, ProductSupplierType } from '../suppliers';
import type { UsageTrackingService } from './usage-tracking.service';

export class UsageTrackingFactoryService {
  /**
   * Depending on the product's supplier, prepares the right {@link UsageTrackingService}
   * to handle usage tracking.
   */
  static create<T extends UsageTrackingService>(forSupplier: ProductSupplierType): T {
    switch (forSupplier) {
      case ProductSupplier.MobiMatter:
        return new MmUsageTrackingService() as unknown as T;
      default:
        throw new Error(`UsageTrackingFactory: unsupported supplier: ${forSupplier}.`);
    }
  }
}
