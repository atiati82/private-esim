import { ProductSupplier } from '@/esim-core/suppliers';
import { OrderItemDto, TransactionDto } from '@/payload/app-types';

import { mockUserDto } from './users.mock';

export const mockTransactionDto_Item0: OrderItemDto = {
  id: '99941010-0mockT0',
  title: '99941010-0mockT0 - Indonesia 30GB, 3HK',
  price: 4999,
  supplierPrice: 3760,
  profit: 33,
  user: mockUserDto.id,
  fulfillment: {
    status: 'New',
    supplier: ProductSupplier.MobiMatter,
    supplierProductId: '1146f7d8-95bc-4bde-a36f-6617ec387860', // eSIM starter: Indonesia 30GB, 3HK
  },
  transaction: '99941010-mockT0',
  transactionPaymentStatus: 'requires_payment_method',
  esimCard: undefined,
  product: 'indonesia-30d30gb-3hk-mm387860.esim',
  status: {},
  createdAt: '2024-10-11T04:20:30.400Z',
  updatedAt: '2024-10-11T04:20:30.400Z',
};

export const mockTransactionDto_Item1: OrderItemDto = {
  ...mockTransactionDto_Item0,
  id: '99941010-1mockT0',
  title: '99941010-1mockT0 - TopUp Indonesia 15GB, 3HK',
  price: 2000,
  supplierPrice: 1000,
  profit: 1000,
  fulfillment: {
    status: 'New',
    supplier: ProductSupplier.MobiMatter,
    supplierProductId: '6cd89e12-ba17-4c03-a758-d1083aee0858', // TopUp: Indonesia 15GB, 3HK
  },
  product: 'indonesia-30d15gb-3hk-mmee0858.topup',
};

export const mockTransactionDtoNewUnpaid: TransactionDto = {
  id: '99941010-mockT0',
  user: mockUserDto,
  total: 6999,
  orderItems: { docs: [mockTransactionDto_Item0, mockTransactionDto_Item1] },
  paymentStatus: 'requires_payment_method',
  createdAt: '2024-10-11T04:20:30.400Z',
  updatedAt: '2024-10-11T04:20:30.400Z',
};

export const mockTransactionWithDuplicatesDto: TransactionDto = {
  id: '99941010-mockT0',
  user: mockUserDto,
  total: 6999,
  orderItems: {
    docs: [mockTransactionDto_Item0, mockTransactionDto_Item1, mockTransactionDto_Item1],
  },
  paymentStatus: 'requires_payment_method',
  createdAt: '2024-10-11T04:20:30.400Z',
  updatedAt: '2024-10-11T04:20:30.400Z',
};
