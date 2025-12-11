import { OrderItemsCollectionId } from '@/esim-core/order-items/collection';
import { EsimProductDto, OrderItemDto, UserDto } from '@/payload/app-types';
import { getRelationIdVal, isObject } from '@/payload/utils/data-utils';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

import { mockUserInPayload } from '@/testing/users-in-payload';
import { mockOrderItemDto } from './order-items.mock';
import { mockProductInPayload } from './products-in-payload';

/**
 * Mock {@link OrderItemDto} in the CMS.
 *
 * Will also insert/create records of:
 * * {@link UserDto} - ONLY if `user` field is empty
 * * {@link EsimProductDto} - ONLY  if `product` field is empty.
 */
export async function mockOrderItemInPayload(
  dto: Partial<OrderItemDto> = {},
): Promise<OrderItemDto> {
  const payload = await appGetPayloadStandalone();

  const user = (dto.user as UserDto) ?? (await mockUserInPayload({}));
  const product: EsimProductDto = isObject(dto.product)
    ? dto.product
    : await mockProductInPayload({});
  const mockDto = mockOrderItemDto({ ...dto, user, product });

  const data: OrderItemDto = {
    ...mockDto,
    user: getRelationIdVal(user)!,
    transaction: getRelationIdVal(mockDto.transaction)!,
    esimCard: getRelationIdVal(mockDto.esimCard),
    product: getRelationIdVal(product)!,
  };
  return payload.create({
    collection: OrderItemsCollectionId,
    data,
    overrideAccess: true,
    showHiddenFields: true,
  });
}

/**
 * Mock {@link OrderItemDto} AND related {@link EsimProductDto} in the CMS.
 *
 * This is similar to the {@link mockOrderItemInPayload} above, but this one
 * will ALWAYS create a CMS product, based on data in `product` field
 * (while the other function would ignore it and assume the product is already in DB).
 */
export async function mockOrderWithProductInPayload(
  dto: Partial<OrderItemDto> = {},
): Promise<OrderItemDto> {
  if (!isObject(dto.product)) {
    throw new Error('OrderItemDto.product: expecting a full EsimProductDto data');
  }
  const product = await mockProductInPayload(dto.product);
  return mockOrderItemInPayload({ ...dto, product });
}
