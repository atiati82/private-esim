import {
  MmCreatedOrder,
  MmCreateTopUpOrderReq,
  MmOrder,
  MmOrderLineItem,
  MmOrderLineItemDetail,
  MmProviderInfo,
  MmResponse,
} from '../mm-orders.types';
import { MmProductCategory } from '../mm-products.types';

/**
 * Handy function to mock MmOrder and override e.g. ICCID line
 */
export function mockMmOrder(
  mmOrder: MmOrder,
  lineItemDetailsOverrides: MmOrderLineItemDetail[] = [],
  orderLineItemOverrides: Partial<MmOrderLineItem> = {},
): MmOrder {
  const lineItemDetails: MmOrderLineItemDetail[] = mmOrder.orderLineItem.lineItemDetails.map(
    ({ name, value }) => {
      const override = lineItemDetailsOverrides.find((v) => v.name === name);
      return { name, value: override ? override.value : value };
    },
  );
  const orderLineItem: MmOrderLineItem = {
    ...mmOrder.orderLineItem,
    ...orderLineItemOverrides,
    lineItemDetails,
  };
  return { ...mmOrder, orderLineItem };
}

export const mockMmOrder1: MmOrder = {
  orderId: 'RBL-5404805',
  orderState: 'Completed',
  currencyCode: 'USD',
  created: '2024-08-23T09:45:23.767',
  updated: '2024-08-23T09:45:27.303',
  orderLineItem: {
    productId: '1146f7d8-95bc-4bde-a36f-6617ec387860', // eSIM: Indonesia 30GB
    productCategory: 'esim_realtime',
    productFamilyName: '3HK',
    productFamilyId: '6',
    title: 'Indonesia 30 GB',
    provider: '15',
    providerName: '3',
    providerLogo:
      'https://mobimatterstorage.blob.core.windows.net/mobimatter-assests/assets/3HK.png',
    retailPrice: 15.99,
    wholesalePrice: 11.3,
    lineItemDetails: [
      {
        // ICCID has been replaced in this case...
        // And MM API reports here updated/new ICCID
        // (Unlike in TopUp orders, where it still points to old ICCID)
        name: 'ICCID',
        value: '898520310300874177',
      },
      {
        name: 'SMDP_ADDRESS',
        value: 'hhk.prod.ondemandconnectivity.com',
      },
      {
        name: 'LOCAL_PROFILE_ASSISTANT',
        value: 'LPA:1$hhk.prod.ondemandconnectivity.com$5S4G6OJTJKYPDHE7',
      },
      {
        name: 'ACCESS_POINT_NAME',
        value: 'mobile.three.com.hk',
      },
      {
        name: 'ACTIVATION_CODE',
        value: '5S4G6OJTJKYPDHE7',
      },
      {
        name: 'PHONE_NUMBER',
        value: '+85267931444',
      },
      {
        name: 'CONF_CODE',
        value: '',
      },
    ],
  },
  label: 'XYZ',
};

export const mockMmOrder1_TopUp_OldICCID: MmOrder = {
  orderId: 'RBL-5667849',
  orderState: 'Completed',
  currencyCode: 'USD',
  created: '2024-09-08T01:34:12.653',
  updated: '2024-09-08T01:34:18.45',
  orderLineItem: {
    productId: 'da8e19e8-b518-4881-b8ad-0dc65b2eff95', // TopUp: Indonesia 30GB
    productCategory: 'esim_addon',
    productFamilyName: '3HK',
    productFamilyId: '6',
    title: 'TopUp Indonesia 30 GB',
    provider: '15',
    providerName: '3',
    providerLogo:
      'https://mobimatterstorage.blob.core.windows.net/mobimatter-assests/assets/3HK.png',
    retailPrice: 15.99,
    wholesalePrice: 11.3,
    lineItemDetails: [
      // ICCID has been replaced in this case... but the API (might still) report the old ICCID ;/
      {
        name: 'ICCID',
        value: '898520310300665855',
      },
      {
        name: 'PHONE_NUMBER',
        value: '+85267931444',
      },
      {
        name: 'PARENT_ORDER',
        value: 'RBL-5404805',
      },
      {
        name: 'PARENT_IDENTIFIER',
        value: '+85267931444',
      },
    ],
  },
  label: 'Andreas',
};

export const mockMmOrder1_Replacement: MmOrder = {
  orderId: 'RBL-6069722',
  orderState: 'Completed',
  currencyCode: 'USD',
  created: '2024-10-01T08:09:57.033',
  updated: '2024-10-01T08:10:11.293',
  orderLineItem: {
    productId: '60978d90-a19a-4f9d-a993-46487f419b41',
    productCategory: 'esim_replacement',
    productFamilyName: '3HK',
    productFamilyId: '6',
    title: '3HK eSIM replacement',
    provider: '15',
    providerName: '3',
    providerLogo:
      'https://mobimatterstorage.blob.core.windows.net/mobimatter-assests/assets/3HK.png',
    retailPrice: 3,
    wholesalePrice: 2,
    lineItemDetails: [
      {
        name: 'ICCID',
        value: '898520310300874177',
      },
      {
        name: 'SMDP_ADDRESS',
        value: 'hhk.prod.ondemandconnectivity.com',
      },
      {
        name: 'LOCAL_PROFILE_ASSISTANT',
        value: 'LPA:1$hhk.prod.ondemandconnectivity.com$5S4G6OJTJKYPDHE7',
      },
      {
        name: 'ACTIVATION_CODE',
        value: '5S4G6OJTJKYPDHE7',
      },
      {
        name: 'PHONE_NUMBER',
        value: '+85267931444',
      },
      {
        name: 'PARENT_ORDER',
        value: 'RBL-5404805',
      },
      {
        name: 'PARENT_IDENTIFIER',
        value: '+85267931444',
      },
    ],
  },
  label: 'Marcin R',
};

export const mockMmOrder1_TopUp: MmOrder = {
  orderId: 'RBL-6606581',
  orderState: 'Completed',
  merchantId: 'ed88eb82-29d9-41d7-8c6b-768acc4d0f29',
  externalId: null,
  currencyCode: 'USD',
  created: '2024-11-02T05:54:17.677',
  updated: '2024-11-02T05:57:44.703',
  orderLineItem: {
    productId: '6cd89e12-ba17-4c03-a758-d1083aee0858',
    productCategory: 'esim_addon',
    productFamilyName: '3HK',
    productFamilyId: '6',
    title: 'TopUp Indonesia 15 GB',
    provider: '15',
    providerName: '3',
    providerLogo:
      'https://mobimatterstorage.blob.core.windows.net/mobimatter-assests/assets/3HK.png',
    retailPrice: 11.99,
    wholesalePrice: 8,
    lineItemDetails: [
      {
        name: 'ICCID',
        value: '898520310300874177',
      },
      {
        name: 'PHONE_NUMBER',
        value: '+85267931444',
      },
      {
        name: 'WALLET_AUTH_TRANSACTION_ID',
        value: 'b5b567ae-eef3-4a7f-b7e1-3613295ba725',
      },
      {
        name: 'RECHARGABLE',
        value: 'True',
      },
      {
        name: 'PARENT_ORDER',
        value: 'RBL-5404805',
      },
      {
        name: 'PARENT_IDENTIFIER',
        value: '+85267931444',
      },
    ],
  },
  label: 'TopUp for Marcin',
};

export const mockMmOrder1_ProviderInfo: MmProviderInfo = {
  ussdCode: '#123',
  esim: {
    status: 'Installed',
    smdpCode: 'activated',
    installationDate: '2024-08-25T06:40:14.597Z',
    location: null,
    kycStatus: 'SIM_REPLACEMENT_RNR_REQ',
    iccid: '898520310300874177',
    phoneNumber: '+85267931444',
    puk: '15988512',
    isSuspended: false,
    wallet: {
      balanceHkd: 0,
    },
  },
  packages: [
    {
      name: 'Indonesia 15 GB, Roaming Data 15GB',
      associatedProductId: '79df2dca-a8aa-4204-806e-64f5caded50f',
      activationDate: '2024-11-03T15:43:52Z',
      expirationDate: '2024-12-03T15:43:52Z',
      totalAllowanceMb: 15360,
      totalAllowanceMin: null,
      usedMin: null,
      usedMb: 0,
    },
    {
      name: 'Indonesia 15 GB, Roaming Data 15GB',
      associatedProductId: '79df2dca-a8aa-4204-806e-64f5caded50f',
      activationDate: '2024-11-02T05:57:44Z',
      expirationDate: '2024-12-02T05:57:44Z',
      totalAllowanceMb: 15360,
      totalAllowanceMin: null,
      usedMin: null,
      usedMb: 2828,
    },
  ],
};

export const mockMmOrder1_ProviderInfo_Multiple: MmProviderInfo = {
  esim: {
    status: 'Installed',
    smdpCode: 'activated',
    installationDate: '2024-08-25T06:40:14.597Z',
    location: null,
    kycStatus: 'SIM_REPLACEMENT_RNR_REQ',
    iccid: '898520310300874177',
    phoneNumber: '+85267931444',
    puk: '15988512',
    isSuspended: false,
    wallet: {
      balanceHkd: 0,
    },
  },
  packages: [
    {
      name: 'Indonesia 15 GB, Roaming Data 15GB',
      associatedProductId: '79df2dca-a8aa-4204-806e-64f5caded50f',
      activationDate: '2024-03-03T03:03:03Z',
      expirationDate: '2099-01-01T00:00:00Z',
      totalAllowanceMb: 15360,
      totalAllowanceMin: null,
      usedMin: null,
      usedMb: 1234,
    },
    {
      name: 'TopUp Saudi and UAE 3 GB 90 days',
      associatedProductId: '58933f5b-ffc1-4bc0-a730-6bbdc32a1c43',
      activationDate: '2024-02-02T02:02:02Z',
      expirationDate: '2099-01-01T00:00:00Z',
      totalAllowanceMb: 3072,
      totalAllowanceMin: 500,
      usedMin: 100,
      usedMb: 3000,
    },
    {
      name: 'Indonesia 15 GB, Roaming Data 15GB',
      associatedProductId: '79df2dca-a8aa-4204-806e-64f5caded50f',
      activationDate: '2024-01-01T01:01:01Z',
      expirationDate: '2099-01-01T00:00:00Z',
      totalAllowanceMb: 15360,
      totalAllowanceMin: null,
      usedMin: null,
      usedMb: 15360,
    },
  ],
};

export const mockMmOrder1Response: MmResponse<MmOrder> = {
  statusCode: 200,
  result: mockMmOrder1,
};
export const mockMmOrderErrorResponse: MmResponse<MmOrder> = {
  statusCode: 404,
  message: 'order not found',
};

export const mockMmOrder1_CreateTopUpOrderReq: MmCreateTopUpOrderReq = {
  productId: '6cd89e12-ba17-4c03-a758-d1083aee0858',
  productCategory: MmProductCategory.TopUp,
  addOnOrderIdentifier: 'RBL-5404805',
  label: 'TopUp for Marcin',
};
export const mockMmOrder1_CreateTopUpOrderRes: MmResponse<MmCreatedOrder> = {
  statusCode: 200,
  result: {
    orderId: 'RBL-6606581',
    productCategory: 'esim_addon',
  },
};
