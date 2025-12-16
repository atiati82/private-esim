import { EsimProductType, type EsimProduct } from '@/data/esim-product';
import type { EsimProvider } from '@/data/provider';

/**
 * When product has countries less or equal to {@link TravelerCardCountriesCountLimit}
 * it is considered a 'Traveler Card' (i.e. not a Global eSIM)
 */
export const TravelerCardCountriesCountLimit = 50;

export function getProductLotName(product: EsimProduct | undefined): string {
  const isTopUp = product?.productType === EsimProductType.TopUp;
  if (isTopUp) {
    return 'Top-Ups';
  }

  const destinationsCount = product?.destinations.length || 0;

  if (destinationsCount > TravelerCardCountriesCountLimit) {
    return 'Global eSIM';
  } else if (destinationsCount > 1) {
    return 'Traveler Card';
  }
  return 'Local eSIM';
}

/**
 * Sort products to the desired order: by plan validity, then minutes, then data allowance
 */
export function sortProducts(products: EsimProduct[]): EsimProduct[] {
  products.sort((a, b) => {
    let res = a.planValidity - b.planValidity;
    if (res === 0) {
      res = a.planVoiceAllowance - b.planVoiceAllowance;
      if (res === 0) {
        res = a.planDataAllowance - b.planDataAllowance;
        if (res === 0) {
          res = a.productPricing.listPrice - b.productPricing.listPrice;
        }
      }
    }
    return res;
  });

  return products;
}

interface FamilyProducts {
  familyId: string;
  provider: EsimProvider;
  products: EsimProduct[];
}

export function sortFamilyProducts(products: FamilyProducts[]): FamilyProducts[] {
  products.sort((a, b) => {
    const productA = a.products[0];
    const productB = b.products[0];
    let res = productA?.destinations.length - productB?.destinations.length;
    if (res === 0) {
      res = b.products.length - a.products.length;
    }
    return res;
  });

  return products;
}

export function productsByFamily(products: EsimProduct[]): FamilyProducts[] {
  const familyProducts: FamilyProducts[] = products.reduce(
    (familyProducts: FamilyProducts[], product: EsimProduct) => {
      const familyId = _getFamilyGroupById(product);

      let familyEntry = familyProducts.find((item) => item.familyId === familyId);
      if (!familyEntry) {
        familyEntry = {
          familyId,
          products: [],
          provider: product.provider,
        };
        familyProducts.push(familyEntry);
      }

      familyEntry.products.push(product);

      return familyProducts;
    },
    [],
  );

  sortFamilyProducts(familyProducts);

  return familyProducts;
}

function _getFamilyGroupById(product: EsimProduct): string {
  return (product.productFamily[0] || product.provider.id) + '_' + product.destinations.length;
}
