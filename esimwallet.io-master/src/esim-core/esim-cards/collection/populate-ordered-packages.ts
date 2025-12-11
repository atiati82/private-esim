import { FieldHook } from 'payload';

import { EsimProductType, isEsimStarter } from '@/data/esim-product';
import { EsimCardDto } from '@/payload/app-types';
import { getRelationIdVal } from '@/payload/utils/data-utils';

import { findOrders } from '../../order-items/find-order-items';

/**
 * Prepare complete row items in {@link EsimCardDto.orderedPackages} array,
 * based on supplied `orderItem` IDs.
 *
 * Reasons for this:
 * * Have easy access to all orders and products running on the {@link EsimCard}.
 * * Be able to show all the details in PayloadCMS
 * * Do some validation here:
 *    * initial item *has to be* an eSIM starter,
 *    * there cannot be more than one starter etc
 *    * Products (from the order) need to exist in the DB
 *
 * @see EsimCardDto
 * @see EsimProductDto
 */
export interface PopulatedOrderedPackageItem {
  id?: string;
  orderItem: string;
  product: string;
  productName: string;
  productType: EsimProductType;
  createdAt: string;
}

/**
 * From a related Order Item, populate the rest of the data
 * (i.e. product, its type etc). Note that this is just
 * for readability and easy order management (e.g. needed
 * for the Row Label component).
 */
export const populateOrderedPackages: FieldHook<
  EsimCardDto,
  EsimCardDto['orderedPackages']
> = async ({ value, req: { payload } }) => {
  const _orderIds: string[] = (value || []).map(({ orderItem }) => getRelationIdVal(orderItem)!);
  const orderIds: string[] = [...new Set(_orderIds)]; // just to be sure, prevent adding same order multiple times
  const orders = await findOrders(payload, { ids: orderIds });

  const newValue: PopulatedOrderedPackageItem[] = orderIds
    .map((orderId) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        return;
      }

      return {
        orderItem: order.id,
        product: order.product.id,
        productName: order.product.name,
        productType: order.product.productType,
        createdAt: order.createdAt,
      } satisfies PopulatedOrderedPackageItem;
    })
    .filter((v) => !!v);

  const eSimStarterCount = newValue.filter((v) => isEsimStarter(v.productType)).length;
  const the1stOrder = newValue[newValue.length - 1];
  const is1stOrderEsimStarter = the1stOrder ? isEsimStarter(the1stOrder.productType) : true;

  if (eSimStarterCount > 1) {
    throw new Error(`Ordered Packages: there should be only 1 eSIM starter on the list.`);
  }
  if (!is1stOrderEsimStarter) {
    throw new Error(`Ordered Packages: the 1st order must be an eSIM starter.`);
  }

  return newValue satisfies EsimCardDto['orderedPackages'];
};
