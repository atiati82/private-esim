import { EsimProductsContent } from '@/payload/app-types';

export enum EsimProductsContentId {
  KycTitle = 'kyc_title',
  KycTitle2 = 'kyc_title2',
  KycNo = 'kyc_0',
  KycNoWithExceptions = 'kyc_0_exceptions',
  KycRequired = 'kyc_1',
  KycExplanation = 'kyc_explanation',
  KycMissing = 'kyc_missing',
  Limits = 'limits',
  LimitsNoLimits = 'limits:no-limits',
  LimitsUnknown = 'limits-unknown',
  ProductTypeTitle = 'product-type-title',
  ProductTypeEsim = 'product-type-eSIM',
  ProductTypeTopUp = 'product-type-TopUp',
  PhoneYes = 'phone_yes',
  PhoneNo = 'phone_no',
  HotspotYes = 'hotspot_yes',
  HotspotNo = 'hotspot_no',
  Speed4G = 'speed_4g',
  Speed5G = 'speed_5g',
}

export const esimProductsSeedContent: EsimProductsContent = {
  id: '',
  createdAt: '',
  updatedAt: '',
  dynamicContent: {
    items: [
      { id: EsimProductsContentId.ProductTypeTitle, content: 'eSIM Type' },
      {
        id: EsimProductsContentId.ProductTypeEsim,
        content: '<strong>eSIM card</strong> (starter) from {PROVIDER_NAME} provider.',
      },
      {
        id: EsimProductsContentId.ProductTypeTopUp,
        content:
          '<strong>Top-Up</strong> (you need an existing eSIM card from {PROVIDER_NAME} provider).',
      },
      {
        id: EsimProductsContentId.PhoneYes,
        content:
          'Phone Number: Yes - {PHONE_NUM}.\\nReceiving GSM phone calls and traditional SMS is possible.',
      },
      {
        id: EsimProductsContentId.PhoneNo,
        content:
          'Phone Number: No.\\nReceiving GSM phone calls and traditional SMS is not possible.',
      },
      {
        id: EsimProductsContentId.Speed4G,
        content: '4G',
      },
      {
        id: EsimProductsContentId.Speed5G,
        content: '5G LTE',
      },
      {
        id: EsimProductsContentId.HotspotYes,
        content: 'Yes. Enjoy connectivity on all of your devices!',
      },
      {
        id: EsimProductsContentId.HotspotNo,
        content: 'No.',
      },
      { id: EsimProductsContentId.KycTitle, content: 'KYC (ID Verification)' },
      { id: EsimProductsContentId.KycTitle2, content: 'KYC Extra Information' },
      {
        id: EsimProductsContentId.KycNo,
        content:
          'KYC not required. Enjoy anonymous internet hassle-free, without providing your passport/identity documents.',
      },
      {
        id: EsimProductsContentId.KycNoWithExceptions,
        content:
          'KYC is generally not required, but there are some exemptions.\\nSee details in the tab below.',
      },
      {
        id: EsimProductsContentId.KycRequired,
        content: '<strong>KYC is required.</strong> See tab below for extra information.',
      },
      {
        id: EsimProductsContentId.KycExplanation,
        content:
          'KYC might be required in some cases and/or for some destinations. If so, you will need to perform additional steps to get verified. Please see the details below.',
      },
      {
        id: 'kyc:hk',
        content:
          '<b>KYC is required for Hong-Kong.</b>\\nHere you have steps to follow:\\n[Content from CMS here]',
      },
      {
        id: 'kyc:tw',
        content:
          '<b>KYC is required for Taiwan.</b>\\nHere you have steps to follow:\\n[Content from CMS here]',
      },
      {
        id: EsimProductsContentId.KycMissing,
        content: 'KYC info is missing. Contact us for details.',
      },
      {
        id: EsimProductsContentId.Limits,
        content: 'Some limits might apply:',
      },
      {
        id: EsimProductsContentId.LimitsNoLimits,
        content: 'No Limits, no hourly/daily quotas, no speed limits, etc.',
      },
      {
        id: EsimProductsContentId.LimitsUnknown,
        content: 'We are unaware of any limits on this data plan.',
      },
    ],
  },
  aboutText: {
    items: [
      {
        content:
          'Ut non mattis turpis, non molestie metus. Integer consequat lacinia felis, at aliquam ante vestibulum eu. Mauris vulputate iaculis magna sit amet cursus.',
      },
      {
        content:
          'Nam id erat eu libero dictum ullamcorper. Integer pretium, leo in faucibus pretium, leo metus gravida diam, sed fermentum risus metus quis sem. Aliquam pulvinar lacinia luctus. Donec sollicitudin consectetur augue nec tristique. Maecenas id felis nisi. Mauris consequat, ante cursus venenatis aliquam, ante nisi dapibus libero, sit amet malesuada est augue ac urna. Etiam odio urna, sagittis eu aliquet in, molestie sit amet urna. In hac habitasse platea dictumst.',
      },
    ],
  },
};
