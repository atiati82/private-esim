import { MmProvider } from '../mm-products.types';

export const mockMmProviders: MmProvider[] = [
  {
    providerId: 32,
    providerName: 'Viettel',
    providerLogo:
      'https://mobimatterstorage.blob.core.windows.net/mobimatter-assests/assets/viettel.png',
  },
  {
    providerId: 10,
    providerName: 'dtac',
    providerLogo:
      'https://mobimatterstorage.blob.core.windows.net/mobimatter-assests/assets/dtac.jpeg',
  },
  {
    providerId: 15,
    providerName: '3',
    providerLogo:
      'https://mobimatterstorage.blob.core.windows.net/mobimatter-assests/assets/3HK.png',
  },
  {
    providerId: 32, // on purpose, duplicate provider
    providerName: 'Viettel',
    providerLogo:
      'https://mobimatterstorage.blob.core.windows.net/mobimatter-assests/assets/viettel.png',
  },
];
