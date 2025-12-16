import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { http, HttpResponse, RequestHandler } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';

import { EsimProductType } from '@/data/esim-product';
import { EsimCardInstallationStatus, EsimCardSmDpStatus } from '@/esim-core/esim-cards/collection';
import { EsimCardIdRegexp } from '@/esim-core/esim-cards/esim-card';
import { FulfillmentFactoryService } from '@/esim-core/fulfillment-usage/fulfillment-factory.service';
import { findOrder } from '@/esim-core/order-items/find-order-items';
import { makeOrderItemObj, OrderItem } from '@/esim-core/order-items/order-item';
import { ProductSupplier } from '@/esim-core/suppliers';
import { generateRandomString } from '@/lib/generate-random-string';
import {
  EsimCardDto,
  EsimCardSetup,
  EsimProductDto,
  OrderFulfillment,
  OrderItemDto,
} from '@/payload/app-types';
import { appGetPayload } from '@/payload/utils/get-payload';

import { mockEsimCardInPayload } from '@/testing/esim-cards-in-payload';
import { mockEsimCardDto, mockEsimCardOrderedPackages, mockICCID } from '@/testing/esim-cards.mock';
import { ignoredPayloadRequests } from '@/testing/msw';
import { mockOrderItemInPayload } from '@/testing/order-items-in-payload';
import { mockOrderItemDto } from '@/testing/order-items.mock';
import { mockProductInPayload } from '@/testing/products-in-payload';
import { mockProductDto } from '@/testing/products.mock';
import { mockProviderThreeHKDto } from '@/testing/providers.mock';
import { MobimatterAPI } from '../mm-api';
import { MmOrder, MmResponse } from '../mm-orders.types';
import {
  mockMmOrder,
  mockMmOrder1,
  mockMmOrder1_Replacement,
  mockMmOrder1_TopUp,
} from '../mocks/mm-data.mock';
import { getMmOrderLineDetail } from './mm-fulfillment-helpers';
import { MmFulfillmentService } from './mm-fulfillment.service';

describe('MM Fulfillment:', function () {
  describe('Prepare data entities', () => {
    function getServiceForOrder({
      supplierOrderId,
      productType,
    }: {
      supplierOrderId: string;
      productType?: EsimProductType;
    }): [MmFulfillmentService, OrderItem] {
      const productDto = mockProductDto({
        productType: productType ?? EsimProductType.eSIM,
        provider: mockProviderThreeHKDto,
      });
      const orderItemDto = mockOrderItemDto({
        product: productDto,
        fulfillment: {
          supplierOrderId,
        } as OrderFulfillment,
      });
      const orderItem = makeOrderItemObj(orderItemDto);
      return [FulfillmentFactoryService.create<MmFulfillmentService>(orderItem), orderItem];
    }

    test('prepare eSIM card: starter', () => {
      const [service, orderItem] = getServiceForOrder({
        supplierOrderId: mockMmOrder1.orderId,
      });
      const dto: EsimCardDto = service.prepareEsimCardStarter(mockMmOrder1);
      expect.soft(dto.id).toMatch(EsimCardIdRegexp);
      expect.soft(dto.user).toEqual(orderItem.user.id);

      expect.soft(dto.statusSmdp).toEqual(EsimCardSmDpStatus.Created);

      expect.soft(dto.orderedPackages?.length).toBe(1);
      expect.soft(dto.orderedPackages?.[0].orderItem).toBe(orderItem.id);

      expect.soft(dto.esimHistory).toEqual(<EsimCardDto['esimHistory']>[
        {
          happenedAt: expect.stringContaining('2024-08-23'),
          iccid: '898520310300874177',
          supplierOrderId: 'RBL-5404805',
          installationStatus: EsimCardInstallationStatus.New,
          installedAt: undefined,
        },
      ]);
      expect.soft(dto.setup).toEqual(<EsimCardSetup>{
        iccid: '898520310300874177',
        phoneNo: expect.stringContaining('+852'),
        smdpAddress: 'hhk.prod.ondemandconnectivity.com',
        lpa: 'LPA:1$hhk.prod.ondemandconnectivity.com$5S4G6OJTJKYPDHE7',
        activationCode: '5S4G6OJTJKYPDHE7',
        confirmationCode: '',
        apn: 'mobile.three.com.hk',
      });

      expect.soft(dto.usageTracking).toBe(true);
      expect.soft(dto.usageTrackingCode).toBe(undefined);
      expect.soft(dto.provider).toEqual('three-hk');
      expect.soft(dto.supplier).toEqual(ProductSupplier.MobiMatter);
      expect.soft(dto.usageLastSyncAt).toBe(undefined);
      expect.soft(dto.createdAt).toMatch(/^\d{4}-/);
      expect.soft(dto.updatedAt).toMatch(/^\d{4}-/);
    });

    test('prepare eSIM card: starter: should throw error if not for starter order', () => {
      const [service] = getServiceForOrder({
        supplierOrderId: mockMmOrder1.orderId,
      });
      expect(() => service.prepareEsimCardStarter(mockMmOrder1_TopUp)).toThrowError();
    });

    test('prepare eSIM card: for TopUps', () => {
      const initOrder = mockOrderItemDto();
      const esimStarter = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages([initOrder]),
      });

      const [service, orderItem] = getServiceForOrder({
        supplierOrderId: mockMmOrder1_TopUp.orderId,
        productType: EsimProductType.TopUp,
      });
      const dtoUpdate = service.prepareEsimCardTopUp(mockMmOrder1_TopUp, esimStarter);
      expect.soft(dtoUpdate).toEqual(<EsimCardDto>{
        orderedPackages: [{ orderItem: orderItem.id }, { orderItem: initOrder.id }],
        updatedAt: mockMmOrder1_TopUp.updated,
      });
    });

    test('prepare eSIM card: for TopUps: should throw error when not a TopUp order', () => {
      const existingEsimDto = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages([mockOrderItemDto()]),
      });
      const [service] = getServiceForOrder({
        supplierOrderId: mockMmOrder1_TopUp.orderId,
        productType: EsimProductType.TopUp,
      });
      expect(() => service.prepareEsimCardTopUp(mockMmOrder1, existingEsimDto)).toThrowError(
        /expected eSIM TopUp order/,
      );
    });
  });

  describe('With CMS:', () => {
    async function makeServiceForOrder({
      supplierOrderId,
      productType,
    }: {
      supplierOrderId: string;
      productType?: EsimProductType;
    }): Promise<MmFulfillmentService> {
      const productDto = await mockProductInPayload({
        productType: productType ?? EsimProductType.eSIM,
        provider: mockProviderThreeHKDto.id,
      });
      const orderItemDto = await mockOrderItemInPayload({
        product: productDto,
        fulfillment: {
          supplierOrderId,
        } as OrderFulfillment,
      });
      const orderItem = makeOrderItemObj(orderItemDto);
      return FulfillmentFactoryService.create<MmFulfillmentService>(orderItem);
    }

    let lastEsimStarterSupplierOrderId: string = '';
    let lastEsimStarterICCID: string = '';
    async function makeMockEsimStarter(
      supplierOrderId = 'RBL-ORDER-' + generateRandomString(8),
    ): Promise<[EsimCardDto, OrderItemDto]> {
      const initOrder = await mockOrderItemInPayload({
        fulfillment: {
          supplierProductId: mockMmOrder1.orderLineItem.productId,
          supplierOrderId,
        } as OrderFulfillment,
      });
      const esimStarterDto = mockEsimCardDto({
        orderedPackages: mockEsimCardOrderedPackages([initOrder]),
      });
      const esimStarter = await mockEsimCardInPayload(esimStarterDto);
      lastEsimStarterSupplierOrderId = supplierOrderId;
      lastEsimStarterICCID = esimStarter.setup.iccid;
      return [esimStarter, initOrder];
    }

    let server: SetupServerApi;
    let mockResponseForOrder: (orderId: string) => MmOrder;
    beforeAll(async () => {
      const mockHandlers: RequestHandler[] = [
        ...ignoredPayloadRequests,
        http.get(
          `${MobimatterAPI.fetchOrderInfoUrl}/:orderId`,
          ({ params }: { params: { orderId: string } }) => {
            return HttpResponse.json(<MmResponse<MmOrder>>{
              statusCode: 200,
              result: mockResponseForOrder(params.orderId),
            });
          },
        ),
      ];
      server = setupServer(...mockHandlers);
      server.listen({ onUnhandledRequest: 'warn' });
    });
    afterAll(() => server.close());
    afterEach(() => server.resetHandlers());

    describe('generateEsimCardForOrder', async () => {
      test('for eSIM starter', async () => {
        const mockSupplierOrderId = 'RBL-ORDER-' + generateRandomString(8);
        const service = await makeServiceForOrder({
          supplierOrderId: mockSupplierOrderId,
        });
        const orderItem = service.order;

        mockResponseForOrder = () =>
          mockMmOrder({
            ...mockMmOrder1,
            orderId: mockSupplierOrderId,
          });
        const esimCardDto = await service.generateEsimCardForOrder();

        // Detailed creation of eSIM card entity is tested above - here just a smoke test...
        expect.soft(esimCardDto).toBeDefined();
        expect.soft(esimCardDto.setup.iccid).toEqual('898520310300874177');
        expect.soft(esimCardDto.setup.lpa).toMatch(/^LPA:1\$hhk/);
        expect.soft(esimCardDto.esimHistory[0].iccid).toEqual('898520310300874177');

        // OrderedPackages should have data populated (via eSIM collection populating hook)
        // Again, just do a basic smoke test, if the data makes sense
        expect.soft(esimCardDto.orderedPackages[0].productType).toEqual(EsimProductType.eSIM);
        const populatedOrderItem = esimCardDto.orderedPackages[0].orderItem as OrderItemDto;
        const populatedProduct = esimCardDto.orderedPackages[0].product as EsimProductDto;
        expect.soft(populatedOrderItem.id).toEqual(orderItem.id);
        expect.soft(populatedOrderItem.fulfillment.supplierOrderId).toEqual(mockSupplierOrderId);
        expect.soft(populatedProduct.id).toEqual(orderItem.product.id);
        expect
          .soft(populatedProduct.supplierProductId)
          .toEqual(orderItem.fulfillment.supplierProductId);

        const payload = await appGetPayload();
        const orderItemDtoFresh = await findOrder(payload, orderItem.id);
        expect.soft(orderItemDtoFresh.eSIM?.id).toEqual(esimCardDto.id);
        expect.soft(orderItemDtoFresh.eSIM?.orderedPackages.length).toBe(1);
        expect.soft(orderItemDtoFresh.eSIM?.esimHistory.length).toBe(1);
      });

      test('for TopUp', async () => {
        const [esimStarter, initOrder] = await makeMockEsimStarter();
        expect(esimStarter.orderedPackages.length).toBe(1);

        mockResponseForOrder = () =>
          mockMmOrder(
            {
              ...mockMmOrder1_TopUp,
              orderId: lastEsimStarterSupplierOrderId,
            },
            [{ name: 'ICCID', value: lastEsimStarterICCID }],
          );
        const service = await makeServiceForOrder({
          productType: EsimProductType.TopUp,
          supplierOrderId: lastEsimStarterSupplierOrderId,
        });
        const updatedDto = await service.generateEsimCardForOrder();
        expect(updatedDto.id).toEqual(esimStarter.id);
        expect(updatedDto.setup).toEqual(esimStarter.setup); // setup data shouldn't change
        expect(updatedDto.orderedPackages.length).toBe(2);
        expect(updatedDto.orderedPackages[0].productType).toEqual(EsimProductType.TopUp);
        expect(updatedDto.orderedPackages[0].orderItem).toMatchObject({
          id: service.order.id,
        });
        expect(updatedDto.orderedPackages[1].productType).toEqual(EsimProductType.eSIM);
        expect(updatedDto.orderedPackages[1].orderItem).toMatchObject({
          id: initOrder.id,
        });
      });

      test('for Replacement', async () => {
        const payload = await appGetPayload();
        const [initEsim] = await makeMockEsimStarter();

        expect.soft(initEsim.setup.iccid).toMatch(/000000\d+$/); // expect mock/fake ICCID
        expect.soft(initEsim.orderedPackages.length).toBe(1);
        expect.soft(initEsim.esimHistory.length).toBe(1);
        expect.soft(initEsim.esimHistory[0].iccid).toMatch(/000000\d+$/);

        const replacementOrderId = 'RBL-REPL-' + generateRandomString(8);
        const replacementICCID = mockICCID();
        mockResponseForOrder = () =>
          mockMmOrder(
            {
              ...mockMmOrder1_Replacement,
              orderId: replacementOrderId,
            },
            [
              { name: 'ICCID', value: replacementICCID },
              { name: 'PARENT_ORDER', value: lastEsimStarterSupplierOrderId },
            ],
          );
        const service = await makeServiceForOrder({
          productType: EsimProductType.Replacement,
          supplierOrderId: replacementOrderId,
        });
        const updatedDto = await service.generateEsimCardForOrder();
        expect(updatedDto.id).toEqual(initEsim.id);
        expect(updatedDto.setup).toMatchObject({
          iccid: replacementICCID,
          lpa: getMmOrderLineDetail(mockMmOrder1_Replacement, 'LOCAL_PROFILE_ASSISTANT'),
          phoneNo: getMmOrderLineDetail(mockMmOrder1_Replacement, 'PHONE_NUMBER'),
        } as EsimCardSetup);
        expect(updatedDto.orderedPackages.length).toBe(2);
        expect(updatedDto.esimHistory.length).toBe(2);
        expect(updatedDto.esimHistory[0]).toMatchObject({
          iccid: replacementICCID,
          supplierOrderId: replacementOrderId,
        });
        expect(updatedDto.esimHistory[1]).toMatchObject({
          iccid: lastEsimStarterICCID,
          supplierOrderId: lastEsimStarterSupplierOrderId,
        });

        const orderItemDtoFresh = await findOrder(payload, service.order.id);
        expect.soft(orderItemDtoFresh.eSIM?.id).toEqual(initEsim.id);
      });
    });

    describe('findExistingEsimCard', async () => {
      test('should find existing eSIM by ICCID', async () => {
        const [mockEsimStarter] = await makeMockEsimStarter();
        const service = await makeServiceForOrder({
          supplierOrderId: mockMmOrder1_TopUp.orderId,
          productType: EsimProductType.TopUp,
        });
        const foundEsim = await service.findExistingEsimCard(
          mockMmOrder(mockMmOrder1_TopUp, [{ name: 'ICCID', value: lastEsimStarterICCID }]),
        );
        expect(foundEsim).toBeDefined();
        expect.soft(foundEsim?.id).toBe(mockEsimStarter.id);
        expect.soft(foundEsim?.setup.iccid).toBe(lastEsimStarterICCID);
      });

      test('should find existing eSIM by parent order id, if by ICCID did not work', async () => {
        const [mockEsimStarter] = await makeMockEsimStarter();
        const mockEsimICCID = mockEsimStarter.setup.iccid;

        const mmOrderId = 'RBL-ORDER-' + generateRandomString(8);
        const mmOrderWithDifferentICCID = mockMmOrder(
          { ...mockMmOrder1_Replacement, orderId: mmOrderId },
          [
            { name: 'ICCID', value: mockICCID() },
            { name: 'PARENT_ORDER', value: lastEsimStarterSupplierOrderId },
          ],
        );
        const differentICCID = getMmOrderLineDetail(mmOrderWithDifferentICCID, 'ICCID');
        expect.soft(differentICCID).not.toBe(mockEsimICCID);

        const service = await makeServiceForOrder({
          supplierOrderId: mmOrderId,
          productType: EsimProductType.Replacement,
        });

        const foundEsim = await service.findExistingEsimCard(mmOrderWithDifferentICCID);
        expect(foundEsim).toBeDefined();
        expect.soft(foundEsim?.id).toBe(mockEsimStarter.id);
        expect.soft(foundEsim?.setup.iccid).toBe(mockEsimICCID);
      });

      test('should NOT find existing eSIM by parent order id', async () => {
        const [mockEsimStarter] = await makeMockEsimStarter();
        const mockEsimICCID = mockEsimStarter.setup.iccid;

        const mmOrder: MmOrder = mockMmOrder(mockMmOrder1_Replacement, [
          { name: 'ICCID', value: mockICCID() },
          { name: 'PARENT_ORDER', value: 'RBL-NON-EXISTING-' + generateRandomString(8) },
        ]);
        const differentICCID = getMmOrderLineDetail(mmOrder, 'ICCID');
        expect.soft(differentICCID).not.toBe(mockEsimICCID);

        const service = await makeServiceForOrder({
          supplierOrderId: mmOrder.orderId,
          productType: EsimProductType.TopUp,
        });

        await expect(service.findExistingEsimCard(mmOrder)).rejects.toThrowError(
          /Could not find eSIM/,
        );
      });
    });
  });
});
