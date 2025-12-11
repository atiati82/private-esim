import type { Meta, StoryObj } from '@storybook/react';

import { EsimPlanKyC, EsimProduct, EsimProductAttribute } from '@/data/esim-product';
import { useCmsContent } from '@/payload/cms-content/use-cms-content.hook';

import { compileProductFeatures } from '@/feat-product/compile-product-features';
import { ProductCard } from '@/feat-product/product-card';
import {
  mockDestinationHk,
  mockDestinationTw,
  mockDestinationUK,
} from '@/testing/destinations.mock';
import {
  mockProductDefaultEsimVoiceKyc,
  mockProductEsimUk,
  mockProductEsimUk2,
  mockProductTopUp,
} from '@/testing/products.mock';

const meta: Meta<typeof ProductCard> = {
  title: 'eSIMwallet / Products / Product Card',
  component: ProductCard,
  argTypes: {},
  args: {
    location: mockDestinationUK,
    product: mockProductDefaultEsimVoiceKyc,
    productFeatures: compileProductFeatures(mockProductDefaultEsimVoiceKyc, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const productKycMinimal: EsimProduct = {
  ...mockProductDefaultEsimVoiceKyc,
  productAttributes: mockProductDefaultEsimVoiceKyc.productAttributes.filter(
    (pa) => !pa.name.startsWith(EsimProductAttribute.KYC),
  ),
};
const productKycNo: EsimProduct = {
  ...productKycMinimal,
  planKycPolicy: EsimPlanKyC.No,
};
export const KycRequired: Story = {
  args: {
    location: mockDestinationHk,
    product: mockProductDefaultEsimVoiceKyc,
    productFeatures: compileProductFeatures(mockProductDefaultEsimVoiceKyc, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [mockDestinationHk, mockDestinationTw],
    }),
  },
};
export const KycRequiredMinimal: Story = {
  args: {
    location: mockDestinationHk,
    product: productKycMinimal,
    productFeatures: compileProductFeatures(productKycMinimal, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};
export const KycNo: Story = {
  args: {
    location: mockDestinationHk,
    product: productKycNo,
    productFeatures: compileProductFeatures(productKycNo, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};

export const LimitsPresent: Story = {
  args: {
    location: mockDestinationUK,
    product: mockProductEsimUk2,
    productFeatures: compileProductFeatures(mockProductEsimUk2, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};
export const LimitsNoLimits: Story = {
  args: {
    location: mockDestinationUK,
    product: mockProductEsimUk,
    productFeatures: compileProductFeatures(mockProductEsimUk, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};
export const LimitsUnknown: Story = {
  args: {
    location: mockDestinationTw,
    product: mockProductDefaultEsimVoiceKyc,
    productFeatures: compileProductFeatures(mockProductDefaultEsimVoiceKyc, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};

const productNoPhoneNum: EsimProduct = {
  ...mockProductDefaultEsimVoiceKyc,
  productAttributes: mockProductDefaultEsimVoiceKyc.productAttributes.filter(
    (pa) => !pa.name.startsWith(`voice`),
  ),
};
export const PhoneYes: Story = {
  args: {
    location: mockDestinationTw,
    product: mockProductDefaultEsimVoiceKyc,
    productFeatures: compileProductFeatures(mockProductDefaultEsimVoiceKyc, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};
export const PhoneNo: Story = {
  args: {
    location: mockDestinationTw,
    product: productNoPhoneNum,
    productFeatures: compileProductFeatures(productNoPhoneNum, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};

const productNoHotspot: EsimProduct = {
  ...mockProductDefaultEsimVoiceKyc,
  productAttributes: mockProductDefaultEsimVoiceKyc.productAttributes.filter(
    (pa) => !pa.name.startsWith(EsimProductAttribute.FeatHotspot),
  ),
};
export const HotspotYes: Story = {
  args: {
    location: mockDestinationTw,
    product: mockProductDefaultEsimVoiceKyc,
    productFeatures: compileProductFeatures(mockProductDefaultEsimVoiceKyc, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};
export const HotspotNo: Story = {
  args: {
    location: mockDestinationTw,
    product: productNoHotspot,
    productFeatures: compileProductFeatures(productNoHotspot, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};

export const TopUp: Story = {
  args: {
    location: mockDestinationTw,
    product: mockProductTopUp,
    productFeatures: compileProductFeatures(mockProductTopUp, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};

export const WithTopUpsList: Story = {
  args: {
    location: mockDestinationTw,
    product: mockProductDefaultEsimVoiceKyc,
    productTopUps: [mockProductTopUp, mockProductTopUp, mockProductTopUp],
    productFeatures: compileProductFeatures(mockProductDefaultEsimVoiceKyc, {
      productsContent: useCmsContent().getProductsContent(),
      destinations: [],
    }),
  },
};
