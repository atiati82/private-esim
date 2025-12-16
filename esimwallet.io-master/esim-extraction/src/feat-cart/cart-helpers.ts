import type { CartItem } from '@/feat-cart/cart.store';

export function getCartOrderTotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
}

/**
 * Convert cart items into flat list of products to order.
 * For products with multiple quantity, multiple individual items will be returned.
 */
export function cartItemsToProductIds(items: CartItem[]): string[] {
  const productIds: string[] = items.reduce(
    (products: string[], cartItem) => [
      ...products,
      ...Array(cartItem.qty).fill(cartItem.productId),
    ],
    [],
  );
  return productIds.filter(Boolean);
}
