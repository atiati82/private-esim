import { isTestingEnv } from '@/env-helpers';
import { getProductSupplierName, ProductSupplierType } from '@/esim-core/suppliers';
import { AppConsoleLogger, getConsoleLogger } from '@/lib/logger-console';
import { EsimCardDto, OrderItemDto } from '@/payload/app-types';

const USAGE_TRACKING_ENABLE_LOGGING = !isTestingEnv;

export interface EsimPackagesUpdates {
  [orderedItemId: string]: Partial<OrderItemDto>;
}

export abstract class UsageTrackingService {
  public readonly supplier!: ProductSupplierType;

  /**
   * {@link EsimCardDto} for which the usage tracking is being done
   * (incl. all assigned to this card {@link OrderItem}s aka Packages).
   */
  public readonly eSIM?: EsimCardDto;

  protected logger!: AppConsoleLogger;

  protected constructor() {
    // More 'detailed' logger can be set inside class members... when we have eSIM data
    this.setLogger(undefined);
  }

  /**
   * Fetch usage data from provider, prepare usage data and statuses for {@link EsimCard}
   * and all packages running on that eSIM - and store all that in the DB.
   *
   * @returns EsimCardDto and OrderItemDto entities (after updating in DB)
   */
  abstract syncUsageData(eSIM: EsimCardDto): Promise<[Partial<EsimCardDto>, ...OrderItemDto[]]>;

  /**
   * Prepare all usage data and statuses updates, for given {@link EsimCard} and its {@link OrderItem}(s).
   * Called from parent {@link syncUsageData()} method, which stores all updates in the CMS.
   */
  abstract prepareAllUsageDataAndStatuses(
    eSIM: EsimCardDto,
    ...usageData: unknown[]
  ): [Partial<EsimCardDto>, EsimPackagesUpdates];

  /**
   * Set internal logger
   *
   * NextJS
   */
  protected setLogger(eSIM: EsimCardDto | undefined): AppConsoleLogger {
    const supplierName = this.supplier ? getProductSupplierName(this.supplier, true) + ' ' : '';
    this.logger = getConsoleLogger(`${supplierName}UsageTracker eSIM:${eSIM?.id ?? 'N/A'}`, {
      enableLogging: USAGE_TRACKING_ENABLE_LOGGING,
    });
    return this.logger;
  }
}
