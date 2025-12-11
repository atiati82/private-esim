import { EsimProductType } from '@/data/esim-product';
import { isTestingEnv } from '@/env-helpers';
import {
  EsimCardsCollectionId,
  initFulfilledEsimCardSmDpStatus,
} from '@/esim-core/esim-cards/collection';
import { makeEsimCardId } from '@/esim-core/esim-cards/esim-card';
import {
  addEsimCardHistoryItem,
  addOrderIntoOrderedPackages,
} from '@/esim-core/esim-cards/esim-card-helpers';
import { findEsimCardByICCID } from '@/esim-core/esim-cards/find-esim-cards';
import { FulfillmentService } from '@/esim-core/fulfillment-usage/fulfillment.service';
import { OrderItemsCollectionId } from '@/esim-core/order-items/collection';
import { ProductSupplier } from '@/esim-core/suppliers';
import { EsimCardDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';
import { appGetPayload } from '@/payload/utils/get-payload';

import { MobimatterAPI } from '../mm-api';
import { MmOrder } from '../mm-orders.types';
import {
  ensureMmEsimReplacement,
  ensureMmEsimStarter,
  ensureMmEsimTopUp,
  ensureOrderId,
  getEsimSetupData,
  getMmOrderLineDetail,
} from './mm-fulfillment-helpers';

export class MmFulfillmentService extends FulfillmentService {
  public readonly supplier: ProductSupplier = ProductSupplier.MobiMatter;

  /**
   * MobiMatter order data, for current {@link this.order}.
   */
  private mmOrder?: MmOrder;

  /**
   * Main method responsible for preparing eSIM card for **eSIMwallet** order.
   *
   * * Connects to API(s), to get whatever data is needed to prepare eSIM card
   * * Generates eSIM record in CMS (for eSIM starters)
   * * Updates eSIM record for TopUp / Replacement orders
   * * Adds ref to eSIM card to current **eSIMwallet** order
   */
  public async generateEsimCardForOrder(): Promise<EsimCardDto> {
    const payload = await appGetPayload();
    this.logger.log(`Generating eSIM card for ${this.order.product.productType} order.`);

    const mmOrderData = await this.getMmOrderData();

    let esimCardDto: EsimCardDto;
    switch (this.order.product.productType) {
      case EsimProductType.eSIM:
      case EsimProductType.eSIMdelayed:
        ensureMmEsimStarter(mmOrderData);
        esimCardDto = this.prepareEsimCardStarter(mmOrderData);
        esimCardDto = await payload.create({
          collection: EsimCardsCollectionId,
          data: esimCardDto,
        });
        break;
      case EsimProductType.TopUp:
        ensureMmEsimTopUp(mmOrderData);
        esimCardDto = await this.findExistingEsimCard(mmOrderData);
        const esimCardTopUpUpdate = this.prepareEsimCardTopUp(mmOrderData, esimCardDto);
        esimCardDto = await payload.update({
          collection: EsimCardsCollectionId,
          id: esimCardDto.id,
          data: esimCardTopUpUpdate,
        });
        break;
      case EsimProductType.Replacement:
        ensureMmEsimReplacement(mmOrderData);
        esimCardDto = await this.findExistingEsimCard(mmOrderData);
        const esimCardReplacementUpdate = this.prepareEsimCardReplacement(mmOrderData, esimCardDto);
        esimCardDto = await payload.update({
          collection: EsimCardsCollectionId,
          id: esimCardDto.id,
          data: esimCardReplacementUpdate,
        });
        break;
      default:
    }

    if (esimCardDto!) {
      await payload.update({
        collection: OrderItemsCollectionId,
        id: this.order.id,
        data: { esimCard: esimCardDto.id },
      });
      return esimCardDto;
    } else {
      throw new Error(
        `eSIM card could not be generated for order #${this.order.id} (MM order #${mmOrderData.orderId})`,
      );
    }
  }

  /**
   * @private
   *
   * For non-starter orders, find an existing {@link EsimCard} record.
   * This is normally done by looking for `ICCID` in our system.
   *
   * In rare cases, MobiMatter might return old ICCID (before eSIM replacement).
   * Also, we won't get a result for eSIM replacement order (since that order
   * contains already a new ICCID) - - in such scenario we always fallback to
   * searching by original order id, which is stored in eSIM card history items.
   */
  public async findExistingEsimCard(mmOrder: MmOrder): Promise<EsimCardDto> {
    const payload = await appGetPayload();

    const iccid = getMmOrderLineDetail(mmOrder, 'ICCID');
    const parentSupplierOrderId = getMmOrderLineDetail(mmOrder, 'PARENT_ORDER');
    this.logger.log(`Looking for existing eSIM card ICCID: ${iccid}`);

    // For TopUp orders, we should be able to find the eSIM by ICCID...
    let eSIM = await findEsimCardByICCID(payload, iccid);
    if (eSIM) {
      this.logger.log(`eSIM found: ${eSIM?.id}.`);
      return eSIM;
    }

    // For eSIM replacement we won't be able find by ICCID (since the order has new ICCID)
    // We have to look up by initial/parent supplier order id, which should exist in eSIM's history.
    else if (parentSupplierOrderId) {
      this.logger.log(`eSIM with ICCID ${iccid} not found.`);
      this.logger.log(`Searching by original order #${parentSupplierOrderId}`);

      const res = await payload.find({
        collection: EsimCardsCollectionId,
        where: { 'esimHistory.supplierOrderId': { equals: parentSupplierOrderId } },
        depth: 1,
      });
      eSIM = res.docs[0];

      if (eSIM) {
        this.logger.log(
          `Success: eSIM with ICCID ${eSIM.setup.iccid} found (for requested ICCID ${iccid})`,
        );
        return eSIM;
      }
    }

    throw new Error(
      `Could not find eSIM for ICCID ${iccid} nor by original order #${parentSupplierOrderId}.`,
    );
  }

  /**
   * Prepare {@link EsimCardDto}, the initial version, made when 1st
   * initial order is being made.
   */
  public prepareEsimCardStarter(mmOrder: MmOrder): EsimCardDto {
    ensureMmEsimStarter(mmOrder);
    const iccid = getMmOrderLineDetail(mmOrder, 'ICCID');
    this.logger.log(`Preparing eSIM Card initial data for ICCID ${iccid}`);

    const providerId = getRelationIdVal(this.order.product.provider)!;
    const dto: EsimCardDto = {
      id: makeEsimCardId(providerId, iccid, isTestingEnv),
      user: getRelationIdVal(this.order.user)!,
      statusSmdp: initFulfilledEsimCardSmDpStatus,

      orderedPackages: [{ orderItem: this.order.id }],
      esimHistory: addEsimCardHistoryItem([], {
        iccid,
        happenedAt: mmOrder.updated,
        supplierOrderId: mmOrder.orderId,
      }),

      setup: getEsimSetupData(mmOrder),
      provider: providerId,
      supplier: ProductSupplier.MobiMatter,

      usageTracking: this.order.product.usageTracking,
      usageTrackingCode: undefined,
      usageLastSyncAt: undefined,
      createdAt: mmOrder.created,
      updatedAt: mmOrder.updated,
    };

    this.logger.log(`eSIM Card [${dto.id}] initial data prepared.`);
    return dto;
  }

  /**
   * Prepare {@link EsimCardDto} update for TopUp order
   */
  public prepareEsimCardTopUp(mmOrder: MmOrder, existingEsim: EsimCardDto): Partial<EsimCardDto> {
    ensureMmEsimTopUp(mmOrder);
    return {
      orderedPackages: addOrderIntoOrderedPackages(existingEsim.orderedPackages, this.order.id),
      updatedAt: mmOrder.updated,
    };
  }

  /**
   * Prepare {@link EsimCardDto} update for eSIM replacement order
   */
  public prepareEsimCardReplacement(
    mmOrder: MmOrder,
    existingEsim: EsimCardDto,
  ): Partial<EsimCardDto> {
    ensureMmEsimReplacement(mmOrder);
    const newICCID = getMmOrderLineDetail(mmOrder, 'ICCID');
    return {
      setup: getEsimSetupData(mmOrder, existingEsim.setup),
      orderedPackages: addOrderIntoOrderedPackages(existingEsim.orderedPackages, this.order.id),
      esimHistory: addEsimCardHistoryItem(existingEsim.esimHistory, {
        iccid: newICCID,
        supplierOrderId: mmOrder.orderId,
        happenedAt: mmOrder.updated,
      }),
      updatedAt: mmOrder.updated,
    };
  }

  private async getMmOrderData(): Promise<MmOrder> {
    if (!this.mmOrder) {
      const supplierOrderId = ensureOrderId(this.order.fulfillment.supplierOrderId);
      this.mmOrder = await MobimatterAPI.fetchOrderInfo(supplierOrderId);

      const iccid = getMmOrderLineDetail(this.mmOrder, 'ICCID');
      this.logger.log(`MM API order data for #${supplierOrderId} received (ICCID: ${iccid})`);
      // console.log(`MOBIMATTER API: ORDER DATA for ${supplierOrderId}`, this.mmOrder);
    }
    return this.mmOrder;
  }
}
