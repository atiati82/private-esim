import { beforeEach, describe, expect, test } from 'vitest';

import { EsimPlanType, EsimProduct } from '@/data/esim-product';
import { EsimProductDto, OrderItemDto } from '@/payload/app-types';

import { makeTransactionId, TransactionIdRegexp } from '@/feat-ordering/transactions/transactions';
import { mockOrderItemDto } from '@/testing/order-items.mock';
import { mockProductDto } from '@/testing/products.mock';
import { mockUserDto } from '@/testing/users.mock';
import { FulfillmentStatus } from '../fulfillment-usage/fulfillment-status';
import { ProductSupplier } from '../suppliers';
import {
  getOrderItemLiveStatuses,
  makeOrderItemId,
  makeOrderItemObj,
  OrderItem,
  OrderItemIdRegexp,
} from './order-item';
import { OrderItemLiveStatus, PackageUsage } from './order-item-types';

describe('OrderItem:', function () {
  describe('OrderItem IDs', function () {
    const transactionId = '99940919-a60c11';

    test('makeOrderItemId', () => {
      const id = makeOrderItemId(transactionId, 0);
      expect(id).toBe('96940919-0a60c11');
      const id2 = makeOrderItemId(transactionId, 5);
      expect(id2).toBe('96940919-5a60c11');
    });

    test('OrderItemId Regexp', () => {
      const id = makeOrderItemId(transactionId, 0);
      expect(id).toBe('96940919-0a60c11');
      expect(id).toMatch(OrderItemIdRegexp);
      expect(id).not.toMatch(TransactionIdRegexp);
      expect(id.substring(1)).not.toMatch(OrderItemIdRegexp);
      expect(id.substring(0, id.length - 1)).not.toMatch(OrderItemIdRegexp);
    });
  });
  describe('make OrderItem obj:', () => {
    let transactionId: string;
    let productDto: EsimProductDto;
    let orderItemDto: OrderItemDto;
    let orderItem: OrderItem;
    beforeEach(() => {
      transactionId = makeTransactionId();
      productDto = mockProductDto(
        { planType: EsimPlanType.VoiceAndData, planDataAllowance: 7, planVoiceAllowance: 1000 },
        { listPrice: 5.55 },
      );
      orderItemDto = mockOrderItemDto({ product: productDto, transaction: transactionId });
      orderItem = makeOrderItemObj(orderItemDto);
    });

    test('Should have basic data', () => {
      expect(orderItem).toMatchObject(<Partial<OrderItem>>{
        id: expect.stringMatching(/^969-mock-order-item/),
        user: expect.objectContaining({ id: mockUserDto.id }),
        updatedAt: '',
        createdAt: '',
      });
    });
    test('Should have product data', () => {
      expect(orderItem).toMatchObject(<Partial<OrderItem>>{
        product: expect.objectContaining(<Partial<EsimProduct>>{
          id: productDto.id,
          name: productDto.name,
          productPricing: expect.objectContaining({
            listPrice: 5.55,
          }),
        }),
      });
    });
    test('Should have transaction and fulfillment data', () => {
      expect(orderItem).toMatchObject(<Partial<OrderItem>>{
        transaction: expect.objectContaining({
          id: transactionId,
        }),
        fulfillment: {
          status: FulfillmentStatus.New,
          supplier: ProductSupplier.MobiMatter,
          supplierProductId: productDto.supplierProductId,
        },
      });
    });
    test('Should have pricing', () => {
      expect(orderItem).toMatchObject(<Partial<OrderItem>>{
        price: 555,
        supplierPrice: 99,
        profit: expect.closeTo(4.6, 1),
      });
    });
    test('Should NOT have eSIM (by default)', () => {
      expect(orderItem).toMatchObject(<Partial<OrderItem>>{
        eSIM: undefined,
      });
    });
    test('Should have package usage data', () => {
      expect(orderItem.syncedAt).toBe(undefined);
      expect(orderItem.packageUsage).toMatchObject(<PackageUsage>{
        activationDate: undefined,
        expirationDate: undefined,
        mbAllowance: 7168,
        mbUsed: 0,
        mbUsageDelta: 0,
        minAllowance: 1000,
        minUsed: 0,
        minUsageDelta: 0,
      });
    });
    test('Should have status filled', () => {
      expect(orderItem.status).toMatchObject(<OrderItemLiveStatus>{
        isPackageExpired: false,
        isPackageUsedUp: false,
        isActivelyUsingAllowance: false,
      });
    });
  });

  describe('getOrderItemLiveStatuses', () => {
    test('when usage data is not yet available', () => {
      const res = getOrderItemLiveStatuses({});
      expect(res).toMatchObject(<OrderItemLiveStatus>{
        isPackageExpired: false,
        isPackageUsedUp: false,
        isActivelyUsingAllowance: false,
      });
    });
    test('isPackageExpired: false (1)', () => {
      const res = getOrderItemLiveStatuses({
        expirationDate: undefined,
      });
      expect(res.isPackageExpired).toBe(false);
    });
    test('isPackageExpired: false (2)', () => {
      const res = getOrderItemLiveStatuses({
        expirationDate: '2099-01-01T00:00:00Z',
      });
      expect(res.isPackageExpired).toBe(false);
    });
    test('isPackageExpired: true', () => {
      const res = getOrderItemLiveStatuses({
        expirationDate: '2000-01-01T00:00:00Z',
      });
      expect(res.isPackageExpired).toBe(true);
    });
    test('isPackageUsedUp: data only', () => {
      expect
        .soft(getOrderItemLiveStatuses({ mbAllowance: 100, mbUsed: null }))
        .toHaveProperty('isPackageUsedUp', false);
      expect
        .soft(getOrderItemLiveStatuses({ mbAllowance: 100, mbUsed: 10 }))
        .toHaveProperty('isPackageUsedUp', false);
      expect
        .soft(getOrderItemLiveStatuses({ mbAllowance: 100, mbUsed: 101 }))
        .toHaveProperty('isPackageUsedUp', true);
    });
    test('isPackageUsedUp: voice only', () => {
      expect
        .soft(getOrderItemLiveStatuses({ minAllowance: 100, minUsed: null }))
        .toHaveProperty('isPackageUsedUp', false);
      expect
        .soft(getOrderItemLiveStatuses({ minAllowance: 100, minUsed: 10 }))
        .toHaveProperty('isPackageUsedUp', false);
      expect
        .soft(getOrderItemLiveStatuses({ minAllowance: 100, minUsed: 100 }))
        .toHaveProperty('isPackageUsedUp', true);
    });
    test('isPackageUsedUp: data + voice', () => {
      expect
        .soft(
          getOrderItemLiveStatuses({
            mbAllowance: 100,
            mbUsed: 100,
            minAllowance: 100,
            minUsed: null,
          }),
        )
        .toHaveProperty('isPackageUsedUp', false);
      expect
        .soft(
          getOrderItemLiveStatuses({
            mbAllowance: 100,
            mbUsed: 0,
            minAllowance: 100,
            minUsed: 100,
          }),
        )
        .toHaveProperty('isPackageUsedUp', false);
      expect
        .soft(
          getOrderItemLiveStatuses({
            mbAllowance: 100,
            mbUsed: 100,
            minAllowance: 100,
            minUsed: 100,
          }),
        )
        .toHaveProperty('isPackageUsedUp', true);
    });
    test('isActivelyUsingAllowance', () => {
      expect.soft(getOrderItemLiveStatuses({})).toHaveProperty('isActivelyUsingAllowance', false);
      expect
        .soft(getOrderItemLiveStatuses({ mbUsageDelta: 0 }))
        .toHaveProperty('isActivelyUsingAllowance', false);
      expect
        .soft(getOrderItemLiveStatuses({ mbUsageDelta: 1, minUsageDelta: 1 }))
        .toHaveProperty('isActivelyUsingAllowance', true);
      expect
        .soft(
          getOrderItemLiveStatuses({
            expirationDate: '2099-01-01T00:00:00Z',
            mbUsageDelta: 1,
          }),
        )
        .toHaveProperty('isActivelyUsingAllowance', true);
      expect
        .soft(
          getOrderItemLiveStatuses({
            expirationDate: '2000-01-01T00:00:00Z',
            mbUsageDelta: 1,
          }),
        )
        .toHaveProperty('isActivelyUsingAllowance', false);

      // Used up packages shouldn't be marked as actively using allowance (since they used up)
      expect
        .soft(getOrderItemLiveStatuses({ mbAllowance: 1, mbUsed: 1, mbUsageDelta: 1 }))
        .toMatchObject({
          isPackageUsedUp: true,
          isActivelyUsingAllowance: false,
        } as OrderItemLiveStatus);
    });
  });
});
