import {
  EsimCardInstallationStatus,
  initFulfilledEsimCardSmDpStatus,
} from '@/esim-core/esim-cards/collection';
import { EsimCardIdPrefix } from '@/esim-core/esim-cards/esim-card';
import { getInitialSupplierOrderId } from '@/esim-core/fulfillment-usage/fulfillment-usage-helpers';
import { ProductSupplier } from '@/esim-core/suppliers';
import { EsimCardDto, OrderItemDto } from '@/payload/app-types';

import { mockProviderThreeHKDto } from '@/testing/providers.mock';
import { mockUserDto } from '@/testing/users.mock';

export function mockEsimCardDto(dto: Partial<EsimCardDto> = {}): EsimCardDto {
  const date = new Date().toISOString();
  const iccid = '890000000000000' + `${++_lastEsimCardIdSeq}`.padStart(3, '0');
  const id = `${EsimCardIdPrefix}-mock-esim-` + iccid.substring(12);
  const esimCard: EsimCardDto = {
    id,
    createdAt: date,
    updatedAt: date,
    user: mockUserDto,
    statusSmdp: initFulfilledEsimCardSmDpStatus,
    orderedPackages: [],
    esimHistory: [
      {
        iccid,
        supplierOrderId: `MOCK-SUPPLIER-ORDER-${_lastEsimCardIdSeq}`,
        happenedAt: date,
        installationStatus: EsimCardInstallationStatus.New,
      },
    ],
    setup: {
      iccid,
      phoneNo: '+690006900069',
      smdpAddress: 'mock.smdp.address',
      activationCode: '123456',
      lpa: 'LPA:1$mock.smdp.address$123456',
      apn: 'mock-apn.com',
    },
    usageTracking: true,
    provider: mockProviderThreeHKDto,
    supplier: ProductSupplier.MobiMatter,

    ...dto,
  };
  esimCard.esimHistory[0].supplierOrderId =
    getInitialSupplierOrderId(esimCard) || esimCard.esimHistory[0].supplierOrderId;

  return esimCard;
}
let _lastEsimCardIdSeq = 0;

export function mockICCID(): string {
  // Just return sth resembling ICCID (i.e. number starting with 89)
  return `89${Math.random()}`.replace('.', '');
}

/**
 * Handy function to prepare {@link EsimCardDto.orderedPackages} list, from {@link OrderItemDto} objects.
 *
 * IMPORTANT: provided packages should be from newest/latest to the oldest (initial).
 *
 * @example:
 * ```
 * const packageA = mockOrderItemDto();
 * const packageB = mockOrderItemDto();
 * const esimCard = mockEsimCardDto({
 *   orderedPackages: mockEsimCardOrderedPackages([packageA, packageB]),
 * });
 * ```
 */
export function mockEsimCardOrderedPackages(
  orderedPackages: OrderItemDto[],
): EsimCardDto['orderedPackages'] {
  return orderedPackages.map((orderedPackage) => ({ orderItem: orderedPackage }));
}
