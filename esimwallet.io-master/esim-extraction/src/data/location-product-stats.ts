import { Optional } from '@/types';

/**
 * Product stats (available deals count, best pricing etc.)
 * for location (Destination or Region)
 */
export interface LocationProductStats {
  allProducts: number;
  eSimProducts: number;
  topUpProducts: number;
  priceFrom: number;
  pricePerGbFrom: number;
}

export function makeLocationProductStats(
  productStats: Optional<LocationProductStats> | undefined,
): LocationProductStats {
  return {
    allProducts: productStats?.allProducts ?? 0,
    eSimProducts: productStats?.eSimProducts ?? 0,
    topUpProducts: productStats?.topUpProducts ?? 0,
    priceFrom: productStats?.allProducts ?? 0,
    pricePerGbFrom: productStats?.pricePerGbFrom ?? 0,
  };
}

export const productStats: LocationProductStats = {
  allProducts: 0,
  eSimProducts: 0,
  topUpProducts: 0,
  priceFrom: 0,
  pricePerGbFrom: 0,
};
