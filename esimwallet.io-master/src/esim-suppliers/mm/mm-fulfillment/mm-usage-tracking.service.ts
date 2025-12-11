import { EsimCardsCollectionId } from '@/esim-core/esim-cards/collection';
import { addEsimCardHistoryItem } from '@/esim-core/esim-cards/esim-card-helpers';
import {
  getInitialSupplierOrderId,
  shouldSyncEsimCard,
} from '@/esim-core/fulfillment-usage/fulfillment-usage-helpers';
import {
  EsimPackagesUpdates,
  UsageTrackingService,
} from '@/esim-core/fulfillment-usage/usage-tracking.service';
import { OrderItemsCollectionId } from '@/esim-core/order-items/collection';
import {
  getOrderItemLiveStatuses,
  isOrderedPackageExpired,
} from '@/esim-core/order-items/order-item';
import { ProductSupplier } from '@/esim-core/suppliers';
import { EsimCardDto, EsimCardSetup, OrderItemDto, PackageUsageDto } from '@/payload/app-types';
import { appGetPayload } from '@/payload/utils/get-payload';

import { MobimatterAPI } from '../mm-api';
import { MmProviderInfo, MmProviderPackageUsage } from '../mm-orders.types';
import { getEsimInstallationStatus, getEsimSmdpStatus } from './mm-fulfillment-helpers';

export class MmUsageTrackingService extends UsageTrackingService {
  public readonly supplier = ProductSupplier.MobiMatter;

  public constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  public async syncUsageData(eSIM: EsimCardDto): Promise<[EsimCardDto, ...OrderItemDto[]]> {
    this.setLogger(eSIM);

    const supplierOrderId = getInitialSupplierOrderId(eSIM);
    const shouldSync = shouldSyncEsimCard(eSIM);
    this.logger.log(`START USAGE DATA SYNC for eSIM...`, { shouldSync, supplierOrderId });

    if (!supplierOrderId || !shouldSync) {
      throw new Error(`Can't sync eSIM ${eSIM.id}: missing supplierOrderId or shouldSync = FALSE`);
    }

    const providerData = await MobimatterAPI.fetchProviderInfo(supplierOrderId);
    const [esimUpdate, packagesUpdates] = this.prepareAllUsageDataAndStatuses(eSIM, providerData);

    const payload = await appGetPayload();
    const resOrderItems: OrderItemDto[] = [];
    for (const orderedPackageId in packagesUpdates) {
      const res = await payload.update({
        collection: OrderItemsCollectionId,
        id: orderedPackageId,
        data: packagesUpdates[orderedPackageId],
      });
      resOrderItems.push(res);
    }
    const resEsimCard = await payload.update({
      collection: EsimCardsCollectionId,
      id: eSIM.id,
      data: esimUpdate,
    });

    return [resEsimCard, ...resOrderItems];
  }

  /**
   * @inheritDoc
   */
  public prepareAllUsageDataAndStatuses(
    eSIM: EsimCardDto,
    providerData: MmProviderInfo,
  ): [Partial<EsimCardDto>, EsimPackagesUpdates] {
    this.setLogger(eSIM);

    const packagesToProcess = this.getPackagesToProcess(eSIM.orderedPackages);
    const actPkgCount = packagesToProcess.length;
    const allPkgCount = eSIM.orderedPackages.length;
    this.logger.log(
      `START PREPARING ALL USAGE/STATUSES for eSIM...\n` +
        `Relevant/non-expired packages to process: ${packagesToProcess.length}` +
        (actPkgCount !== allPkgCount ? ` (out of all ${allPkgCount} for this eSIM)` : ''),
    );

    const eSIMCardUpdate = this.prepareEsimCardUpdate(eSIM, providerData);
    const esimPackagesUpdates = this.preparePackagesUpdates(providerData, packagesToProcess);

    return [eSIMCardUpdate, esimPackagesUpdates];
  }

  /**
   * Prepare eSIM card update, based on provider data.
   *
   * Also, it prepares eSIM card "live" statuses,
   * based on provided just-updated packages running for that eSIM.
   *
   * @private
   */
  public prepareEsimCardUpdate(
    eSIM: EsimCardDto,
    providerInfo: MmProviderInfo,
  ): Partial<EsimCardDto> {
    const iccid = providerInfo.esim.iccid;
    return {
      statusSmdp: getEsimSmdpStatus(providerInfo.esim.smdpCode, providerInfo.esim.isSuspended),
      setup: {
        iccid,
        phoneNo: providerInfo.esim.phoneNumber,
      } as EsimCardSetup,
      usageTrackingCode: providerInfo.ussdCode || undefined,

      // It'll only add new history item if sth meaningful changed (i.e. ICCID, installation status)
      esimHistory: addEsimCardHistoryItem(eSIM.esimHistory, {
        iccid,
        installationStatus: getEsimInstallationStatus(providerInfo),
        happenedAt: providerInfo.esim.installationDate ?? '',
        supplierOrderId: eSIM.esimHistory[0]?.supplierOrderId ?? 'ERROR:esimHistory-missing',
      }),

      usageLastSyncAt: new Date().toISOString(),
    };
  }

  /**
   * Gets all packages running on eSIM card, relevant to process
   */
  public getPackagesToProcess(orderedPackages: EsimCardDto['orderedPackages']): OrderItemDto[] {
    return (
      orderedPackages
        .map((esimPackage) => esimPackage.orderItem as OrderItemDto)
        // Filter out packages already marked as expired
        .filter((esimPackage) => !esimPackage.status?.isPackageExpired)
        // Filter out packages which are expiring/expired (because of expiry date)
        .filter((esimPackage) => !isOrderedPackageExpired(esimPackage.usage ?? {}))
    );
  }

  /**
   * Prepare usage and statuses updates for all packages running on eSIM
   * @private
   */
  public preparePackagesUpdates(
    providerInfo: MmProviderInfo,
    esimPackages: OrderItemDto[],
  ): EsimPackagesUpdates {
    const packagesToProcess = [...esimPackages];
    this.logger.log(
      `Preparing usage and statuses for *${esimPackages.length}* eSIM package(s)`,
      packagesToProcess.map((item) => `${item.id} - ${item.fulfillment.supplierProductId}`),
    );
    this.logger.log(
      `Received Provider usage data for ${providerInfo.packages.length} package(s).`,
      providerInfo.packages.map((p) => p.associatedProductId),
    );

    // Find matching package AND take it off from the stack of items to process
    const getMatchingPackage = (mmProductId: string): OrderItemDto | undefined => {
      const foundIdx = packagesToProcess.findIndex(
        (orderedPackage) => orderedPackage.fulfillment.supplierProductId === mmProductId,
      );
      if (foundIdx !== -1) {
        const [foundItem] = packagesToProcess.splice(foundIdx, 1);
        return foundItem;
      }
      this.logger.warn(
        `${mmProductId} - no matching eSIM package for this MM product. ` +
          `Make sure all packages/orders are assigned to this eSIM in our CMS.`,
      );
      return undefined;
    };

    const esimPackagesUpdates: EsimPackagesUpdates = {};
    providerInfo.packages.forEach((newUsageData: MmProviderPackageUsage) => {
      const esimPackage = getMatchingPackage(newUsageData.associatedProductId);
      if (!esimPackage) {
        return;
      }

      const currentPackageUsage = esimPackage.usage ?? ({} as PackageUsageDto);
      const mbUsageDelta = (newUsageData.usedMb ?? 0) - (currentPackageUsage.mbUsed ?? 0);
      const minUsageDelta = (newUsageData.usedMin ?? 0) - (currentPackageUsage.minUsed ?? 0);
      const newPackageUsage: PackageUsageDto = {
        ...currentPackageUsage,
        activationDate: newUsageData.activationDate,
        expirationDate: newUsageData.expirationDate,
        mbAllowance: newUsageData.totalAllowanceMb ?? currentPackageUsage.mbAllowance,
        mbUsed: newUsageData.usedMb ?? 0,
        mbUsageDelta,
        minAllowance: newUsageData.totalAllowanceMin ?? currentPackageUsage.minAllowance,
        minUsed: newUsageData.usedMin ?? 0,
        minUsageDelta,
      };

      esimPackagesUpdates[esimPackage.id] = {
        title: esimPackage.title,
        usage: newPackageUsage,
        status: getOrderItemLiveStatuses(newPackageUsage),
        usageLastSyncAt: new Date().toISOString(),
      };
      this.logger.log(`#${esimPackage.id}: new usage data prepared`);
    });

    // Whatever packages are left in ordered `relevantPackages`, they weren't matched,
    // based on data received from provider. In MobiMatter that means they're expired - so we need to
    // mark all remaining packages as expired.
    const expiredPackages = this.markRemainingPackagesAsExpired(packagesToProcess);

    return {
      ...esimPackagesUpdates,
      ...expiredPackages,
    };
  }

  private markRemainingPackagesAsExpired(unmatchedPackages: OrderItemDto[]): EsimPackagesUpdates {
    if (!unmatchedPackages.length) {
      return {};
    }

    const esimPackagesUpdates: EsimPackagesUpdates = {};
    unmatchedPackages.forEach((esimPackage) => {
      esimPackagesUpdates[esimPackage.id] = {
        title: esimPackage.title,
        status: {
          ...getOrderItemLiveStatuses({}),
          isPackageExpired: true,
          isActivelyUsingAllowance: false,
        },
        usageLastSyncAt: new Date().toISOString(),
      };
      this.logger.log(`#${esimPackage.id}: no usage data from provider - marking as expired`);
    });

    return esimPackagesUpdates;
  }
}
