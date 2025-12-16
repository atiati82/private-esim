import { EsimProduct, EsimProductType } from '@/data/esim-product';
import { LocationProductStats } from '@/data/location-product-stats';

/**
 * Prepares product stats for location (Destination or Region)
 * i.e. available deals count, best pricing etc.
 */
export function collectProductStats(locationProduct: EsimProduct[]): LocationProductStats {
  const starterProducts = locationProduct.filter((p) => p.productType === EsimProductType.eSIM);

  const productStats: LocationProductStats = {
    allProducts: locationProduct.length,
    eSimProducts: starterProducts.length,
    topUpProducts: locationProduct.length - starterProducts.length,
    priceFrom: 0,
    pricePerGbFrom: 0,
  };

  starterProducts.forEach((product) => {
    if (product.productPricing.listPrice) {
      productStats.priceFrom = productStats.priceFrom
        ? product.productPricing.listPrice < productStats.priceFrom
          ? product.productPricing.listPrice
          : productStats.priceFrom
        : product.productPricing.listPrice;
    }
    if (product.productPricing.pricePerGb) {
      productStats.pricePerGbFrom = productStats.pricePerGbFrom
        ? product.productPricing.pricePerGb < productStats.pricePerGbFrom
          ? product.productPricing.pricePerGb
          : productStats.pricePerGbFrom
        : product.productPricing.listPrice;
    }
  });

  return productStats;
}
