/**
 * List of eSIM suppliers in our system.
 * Keep it short, as 2-letter code.
 * This ID is used in `Product.ID` generation.
 */
export enum ProductSupplier {
  MobiMatter = 'mm',
}
type ProductSupplierStrings = `${ProductSupplier}`;
export type ProductSupplierType = ProductSupplier | ProductSupplierStrings;

/**
 * Get supplier name, for display purposes
 */
export function getProductSupplierName(
  supplier: ProductSupplierType,
  shortVersion: boolean = false,
): string {
  switch (supplier) {
    case ProductSupplier.MobiMatter:
      return shortVersion ? 'MM' : 'MobiMatter';
    default:
      return supplier;
  }
}
