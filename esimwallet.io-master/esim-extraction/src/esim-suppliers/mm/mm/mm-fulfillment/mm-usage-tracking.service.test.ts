import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import cloneDeep from 'lodash/cloneDeep';
import { http, HttpResponse, RequestHandler } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';

import { EsimProductType } from '@/data/esim-product';
import { EsimCardInstallationStatus, EsimCardSmDpStatus } from '@/esim-core/esim-cards/collection';
import { EsimCardHistoryItem } from '@/esim-core/esim-cards/esim-card-helpers';
import { UsageTrackingFactoryService } from '@/esim-core/fulfillment-usage/usage-tracking-factory.service';
import { ProductSupplier } from '@/esim-core/suppliers';
import { DateTimeRegexp } from '@/lib/utils';
import {
  EsimCardDto,
  OrderFulfillment,
  OrderItemDto,
  OrderItemLiveStatusDto,
  PackageUsageDto,
} from '@/payload/app-types';

import { mockDatePast } from '@/testing/date.mock';
import { mockEsimCardInPayload } from '@/testing/esim-cards-in-payload';
import { mockEsimCardDto, mockEsimCardOrderedPackages } from '@/testing/esim-cards.mock';
import { ignoredPayloadRequests } from '@/testing/msw';
import {
  mockOrderItemInPayload,
  mockOrderWithProductInPayload,
} from '@/testing/order-items-in-payload';
import { mockOrderItemDto } from '@/testing/order-items.mock';
import { mockProductDto } from '@/testing/products.mock';
import { MobimatterAPI } from '../mm-api';
import { MmProviderInfo } from '../mm-orders.types';
import {
  mockMmOrder1_ProviderInfo,
  mockMmOrder1_ProviderInfo_Multiple,
} from '../mocks/mm-data.mock';
import { MmUsageTrackingService } from './mm-usage-tracking.service';

describe('MM Usage Tracking:', function () {
  let service: MmUsageTrackingService;
  beforeEach(() => {
    service = UsageTrackingFactoryService.create<MmUsageTrackingService>(
      ProductSupplier.MobiMatter,
    );
  });

  const mockSupplierOrderId = 'RBL-5404805'; // for semi-real test with CMS and API fetching

  let providerUsageData: MmProviderInfo;
  let orderItem_A_butExpired: OrderItemDto;
  let orderItem_A: OrderItemDto;
  let orderItem_B: OrderItemDto;
  let orderItem_C_likeA: OrderItemDto;
  let orderItem_X_noProviderData_soMustBeExpired: OrderItemDto;

  beforeEach(() => {
    const productTopUp1 = mockProductDto({ productType: EsimProductType.TopUp });
    const productTopUp2 = mockProductDto({ productType: EsimProductType.TopUp });
    const productStarterX = mockProductDto();

    providerUsageData = cloneDeep(mockMmOrder1_ProviderInfo_Multiple);
    providerUsageData.packages[0].associatedProductId = productTopUp1.supplierProductId;
    providerUsageData.packages[1].associatedProductId = productTopUp2.supplierProductId;
    providerUsageData.packages[2].associatedProductId = productTopUp1.supplierProductId;

    orderItem_A_butExpired = mockOrderItemDto({
      title: `Order Package: Product A (most-recently-ordered, 1st on the list, but Expired) #${productTopUp1.id}`,
      product: productTopUp1,
      usage: { expirationDate: mockDatePast },
    });
    orderItem_A = mockOrderItemDto({
      title: `Order Package: Product A #${productTopUp1.id}`,
      product: productTopUp1,
    });
    orderItem_B = mockOrderItemDto({
      title: `Order Package: Product B #${productTopUp2.id}`,
      product: productTopUp2,
    });
    orderItem_C_likeA = mockOrderItemDto({
      title: `Order Package: Product C (oldest, last on the list, same as the newer A) #${productTopUp1.id}`,
      fulfillment: { supplierOrderId: mockSupplierOrderId } as OrderFulfillment,
      product: productTopUp1,
    });
    orderItem_X_noProviderData_soMustBeExpired = mockOrderItemDto({
      title: `Order Package: No usage data (not present in provider data) #${productStarterX.id}`,
      product: productStarterX,
    });
  });

  describe('getPackagesToProcess()', () => {
    test('should get only relevant/non-expired packages', () => {
      const packageExpiredByDate = mockOrderItemDto({
        usage: { expirationDate: mockDatePast },
      });
      const packageExpiredByStatus = mockOrderItemDto({
        status: { isPackageExpired: true },
      });
      const packageActive = mockOrderItemDto();

      const res = service.getPackagesToProcess([
        { orderItem: packageExpiredByDate },
        { orderItem: packageActive },
        { orderItem: packageExpiredByStatus },
      ]);
      expect(res.length).toBe(1);
      expect(res[0].id).toEqual(packageActive.id);
    });
  });

  describe('prepareAllUsageDataAndStatuses()', () => {
    test('should have eSIM card update AND all eSIM packages in the result', () => {
      // Ordered items: from most recent to the oldest ones
      const orderedItems: OrderItemDto[] = [
        orderItem_A_butExpired,
        orderItem_A,
        orderItem_B,
        orderItem_C_likeA,
        orderItem_X_noProviderData_soMustBeExpired,
      ];
      const esimCard = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages(orderedItems),
      });
      const [esimUpdate, packagesUpdates] = service.prepareAllUsageDataAndStatuses(
        esimCard,
        providerUsageData,
      );

      expect.soft(esimUpdate).toBeDefined();
      expect.soft(esimUpdate.setup?.iccid).toBeDefined();
      expect.soft(esimUpdate.esimHistory?.length).toBeGreaterThanOrEqual(1);

      const packageIds = Object.keys(packagesUpdates);
      expect.soft(packageIds).not.toContain(orderItem_A_butExpired.id);
      expect.soft(packageIds).toContain(orderItem_A.id);
      expect.soft(packageIds).toContain(orderItem_B.id);
      expect.soft(packageIds).toContain(orderItem_C_likeA.id);
      expect.soft(packageIds).toContain(orderItem_X_noProviderData_soMustBeExpired.id);
    });

    test(`should only process relevant/not-expired packages - others shouldn't appear on updates list at all`, () => {
      // Ordered items: from most recent to the oldest ones
      const orderedItems: OrderItemDto[] = [
        orderItem_A_butExpired,
        orderItem_A,
        orderItem_X_noProviderData_soMustBeExpired,
      ];
      const esimCard = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages(orderedItems),
      });
      const [_, packagesUpdates] = service.prepareAllUsageDataAndStatuses(
        esimCard,
        providerUsageData,
      );
      expect(packagesUpdates[orderItem_A_butExpired.id]).not.toBeDefined();
      expect(packagesUpdates[orderItem_A.id]).toBeDefined();
      expect(packagesUpdates[orderItem_X_noProviderData_soMustBeExpired.id]).toBeDefined();
    });
  });

  describe('preparePackagesUpdates()', function () {
    test('should have all packages in the updates result', () => {
      // Ordered items: from most recent to the oldest ones
      const orderedItems: OrderItemDto[] = [
        orderItem_A,
        orderItem_B,
        orderItem_C_likeA,
        orderItem_X_noProviderData_soMustBeExpired,
      ];
      const res = service.preparePackagesUpdates(providerUsageData, orderedItems);
      const resIds = Object.keys(res);
      expect.soft(resIds).toContain(orderItem_A.id);
      expect.soft(resIds).toContain(orderItem_B.id);
      expect.soft(resIds).toContain(orderItem_C_likeA.id);
      expect.soft(resIds).toContain(orderItem_X_noProviderData_soMustBeExpired.id);
    });

    test('should have usage data and statuses in the updates result', () => {
      // Ordered items: from most recent to the oldest ones
      const orderedItems: OrderItemDto[] = [
        orderItem_A,
        orderItem_B,
        orderItem_C_likeA,
        orderItem_X_noProviderData_soMustBeExpired,
      ];
      const res = service.preparePackagesUpdates(providerUsageData, orderedItems);

      expect.soft(res[orderItem_A_butExpired.id]).toBeUndefined();

      expect.soft(res[orderItem_A.id].usage).toMatchObject(<PackageUsageDto>{
        activationDate: providerUsageData.packages[0].activationDate,
        expirationDate: providerUsageData.packages[0].expirationDate,
        mbAllowance: 15360,
        mbUsed: 1234,
        mbUsageDelta: 1234,
        minAllowance: undefined,
        minUsed: 0,
        minUsageDelta: 0,
      });
      expect.soft(res[orderItem_A.id].status).toMatchObject(<OrderItemLiveStatusDto>{
        isActivelyUsingAllowance: true,
        isPackageExpired: false,
        isPackageUsedUp: false,
      });

      expect.soft(res[orderItem_B.id].usage).toMatchObject(<PackageUsageDto>{
        activationDate: providerUsageData.packages[1].activationDate,
        expirationDate: providerUsageData.packages[1].expirationDate,
        mbAllowance: 3072,
        mbUsed: 3000,
        mbUsageDelta: 3000,
        minAllowance: 500,
        minUsed: 100,
        minUsageDelta: 100,
      });
      expect.soft(res[orderItem_B.id].status).toMatchObject(<OrderItemLiveStatusDto>{
        isActivelyUsingAllowance: true,
        isPackageExpired: false,
        isPackageUsedUp: false,
      });

      expect.soft(res[orderItem_C_likeA.id].usage).toMatchObject(<PackageUsageDto>{
        mbAllowance: 15360,
        mbUsed: 15360,
      });
      expect.soft(res[orderItem_C_likeA.id].status).toMatchObject(<OrderItemLiveStatusDto>{
        isActivelyUsingAllowance: false,
        isPackageExpired: false,
        isPackageUsedUp: true,
      });

      // This package should not have update for usage...
      // It should only have statuses update (i.e. expired)
      expect.soft(res[orderItem_X_noProviderData_soMustBeExpired.id].usage).toBeUndefined();
      expect.soft(res[orderItem_X_noProviderData_soMustBeExpired.id].status).toMatchObject(<
        OrderItemLiveStatusDto
      >{
        isActivelyUsingAllowance: false,
        isPackageExpired: true,
      });
    });

    test('should have usage data ONLY for packages found in provider data - the remaining should have only status update', () => {
      // Ordered items: from most recent to the oldest ones
      const orderedItems: OrderItemDto[] = [
        orderItem_A,
        orderItem_B,
        orderItem_C_likeA,
        orderItem_X_noProviderData_soMustBeExpired,
      ];
      const res = service.preparePackagesUpdates(providerUsageData, orderedItems);
      const itemsWithUsageUpdates = Object.values(res).filter((item) => !!item.usage);
      const itemsWithStatusUpdates = Object.values(res).filter((item) => !!item.status);
      expect(itemsWithUsageUpdates.length).toBe(3);
      expect(itemsWithStatusUpdates.length).toBe(4);
    });

    test('handle case when provider data contains more packages than on eSIM file', () => {
      // Mock Provider data contains 3 packages...
      // Here we only provide 2 packages on eSIM.
      // This situation isn't normal and shouldn't happen... If does, it's some sort of anomaly.
      // For now these unmatched Provider's packages are quietly ignored - we just generate log warning.
      const res = service.preparePackagesUpdates(providerUsageData, [orderItem_A, orderItem_B]);
      expect(Object.keys(res)).toEqual([orderItem_A.id, orderItem_B.id]);
    });

    test('all package updates should have last sync date', () => {
      // Ordered items: from most recent to the oldest ones
      const orderedItems: OrderItemDto[] = [
        orderItem_A_butExpired,
        orderItem_A,
        orderItem_B,
        orderItem_C_likeA,
        orderItem_X_noProviderData_soMustBeExpired,
      ];
      const res = service.preparePackagesUpdates(providerUsageData, orderedItems);
      Object.values(res).forEach((item) => {
        expect(item).toMatchObject({
          usageLastSyncAt: expect.stringMatching(DateTimeRegexp),
        });
      });
    });
  });

  describe('prepareEsimCardUpdate()', function () {
    test('SMDP status (and other basic data) should be updated', () => {
      const initEsim = mockEsimCardDto();
      const esimUpdate = service.prepareEsimCardUpdate(initEsim, mockMmOrder1_ProviderInfo);
      expect.soft(esimUpdate).toMatchObject({
        statusSmdp: EsimCardSmDpStatus.Activated,
        usageTrackingCode: '#123',
      } as EsimCardDto);
      expect.soft(esimUpdate.usageLastSyncAt).toMatch(DateTimeRegexp);
    });
    test('new ICCID should be updated and added to history', () => {
      const initEsim = mockEsimCardDto();
      const initHistory = initEsim.esimHistory[0] as EsimCardHistoryItem;
      const esimUpdate = service.prepareEsimCardUpdate(initEsim, mockMmOrder1_ProviderInfo);

      expect(esimUpdate.setup?.iccid).not.toEqual(initEsim.setup.iccid);
      expect(esimUpdate.setup?.iccid).toEqual(mockMmOrder1_ProviderInfo.esim.iccid);

      expect(esimUpdate.esimHistory!.length).toEqual(initEsim.esimHistory.length + 1);
      const newHistoryItem = esimUpdate.esimHistory![0] as EsimCardHistoryItem;
      expect(newHistoryItem.iccid).not.toEqual(initHistory.iccid);
      expect(newHistoryItem.iccid).toEqual(mockMmOrder1_ProviderInfo.esim.iccid);
    });
    test('new installationStatus should be added to history', () => {
      const initEsim = mockEsimCardDto();
      const initHistory = initEsim.esimHistory[0] as EsimCardHistoryItem;
      const esimUpdate = service.prepareEsimCardUpdate(initEsim, mockMmOrder1_ProviderInfo);

      expect(esimUpdate.esimHistory!.length).toEqual(initEsim.esimHistory.length + 1);
      const newHistoryItem = esimUpdate.esimHistory![0] as EsimCardHistoryItem;
      expect(newHistoryItem.installationStatus).not.toEqual(initHistory.installationStatus);
      expect(newHistoryItem.installationStatus).toEqual(EsimCardInstallationStatus.Installed);
    });
  });

  describe('syncUsageData(): with CMS', () => {
    let server: SetupServerApi;
    beforeAll(async () => {
      const mockHandlers: RequestHandler[] = [
        ...ignoredPayloadRequests,
        http.get(new RegExp(MobimatterAPI.fetchProviderInfoUrl), () => {
          return HttpResponse.json(providerUsageData);
        }),
      ];
      server = setupServer(...mockHandlers);
      server.listen({ onUnhandledRequest: 'warn' });
    });
    afterAll(() => server.close());

    beforeEach(async () => {
      await mockOrderWithProductInPayload(orderItem_X_noProviderData_soMustBeExpired);
      await mockOrderWithProductInPayload(orderItem_C_likeA);
      await mockOrderWithProductInPayload(orderItem_B);
      // Don't use `mockOrderWithProductInPayload` - products assigned to these are already created above
      await mockOrderItemInPayload(orderItem_A);
      await mockOrderItemInPayload(orderItem_A_butExpired);
    });
    afterEach(() => {
      server.resetHandlers();
    });

    test('should fetch usage data, generate usage data and store it in db', async () => {
      const orderedItems: OrderItemDto[] = [
        orderItem_A_butExpired,
        orderItem_A,
        orderItem_B,
        orderItem_C_likeA,
        orderItem_X_noProviderData_soMustBeExpired,
      ];

      const _esimCard = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages(orderedItems),
      });
      const esimCard = await mockEsimCardInPayload(_esimCard);

      //
      // Smoke test: eSIM and packages before update
      //
      expect.soft(esimCard.setup.iccid).toMatch(/000000\d+$/); // fake/mock ICCID
      expect.soft(esimCard.esimHistory.length).toBe(1);
      expect.soft(esimCard.esimHistory[0].iccid).toMatch(/000000\d+$/);
      expect.soft(esimCard.esimHistory[0].iccid).toMatch(/000000\d+$/);
      expect.soft(esimCard.esimHistory[0].installationStatus).toBe(EsimCardInstallationStatus.New);
      const orderedItemsBeforeUpdate: OrderItemDto[] = esimCard.orderedPackages.map(
        (row) => row.orderItem as OrderItemDto,
      );
      const orderItem_A_beforeUpdate = orderedItemsBeforeUpdate[1];
      expect(orderItem_A_beforeUpdate.status).toEqual({});
      expect(orderItem_A_beforeUpdate.usage).toEqual({});

      const [esimUpdated, ...packagesUpdates] = await service.syncUsageData(esimCard);
      // Expect one package less in updates, because it's already expired
      expect(packagesUpdates.length).toBe(orderedItems.length - 1);
      expect(esimUpdated.orderedPackages.length).toBe(orderedItems.length);

      //
      // Test eSIM card updates
      //
      expect.soft(esimUpdated.setup.iccid).not.toMatch(/000000\d+$/); // fake/mock ICCID
      expect.soft(esimUpdated.setup.iccid).toBe(providerUsageData.esim.iccid);
      expect.soft(esimUpdated.esimHistory[0].iccid).toBe(providerUsageData.esim.iccid);
      expect
        .soft(esimUpdated.esimHistory[0].installationStatus)
        .toBe(EsimCardInstallationStatus.Installed);

      //
      // Smoke test returned packages updates
      // Note: detailed tests are above, for `preparePackagesUpdates()` method
      //
      const orderItem_A_updated = packagesUpdates.find((item) => item.id === orderItem_A.id);
      expect.soft(orderItem_A_updated?.usage).toMatchObject({
        mbAllowance: 15360,
        mbUsed: 1234,
      } as PackageUsageDto);
      expect.soft(orderItem_A_updated?.status).toMatchObject({
        isActivelyUsingAllowance: true,
        isPackageExpired: false,
        isPackageUsedUp: false,
      } as OrderItemLiveStatusDto);

      const orderItem_C_updated = packagesUpdates.find((item) => item.id === orderItem_C_likeA.id);
      expect.soft(orderItem_C_updated?.status).toMatchObject({
        isActivelyUsingAllowance: false,
        isPackageExpired: false,
        isPackageUsedUp: true,
      } as OrderItemLiveStatusDto);

      const orderItem_X_updated = packagesUpdates.find(
        (item) => item.id === orderItem_X_noProviderData_soMustBeExpired.id,
      );
      expect.soft(orderItem_X_updated?.status).toMatchObject({
        isPackageExpired: true,
      } as OrderItemLiveStatusDto);
    });
  });
});
