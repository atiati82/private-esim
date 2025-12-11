import { CartItem, CartItemToAdd } from '@/feat-cart/cart.store';

export const mockCartItemsDummy: CartItem[] = [
  {
    id: 0,
    productId: 'product-0',
    name: 'Product Indonesia',
    location: 'id',
    qty: 1,
    unitPrice: 19.99,
  },
  { id: 1, productId: 'product-1', name: 'Product USA', location: 'us', qty: 3, unitPrice: 50 },
  {
    id: 2,
    productId: 'product-2',
    name: 'Product CH USA',
    location: 'america',
    qty: 2,
    unitPrice: 100,
  },
];

export const mockCartItemToAdd0: CartItemToAdd = {
  productId: 'product-id-0',
  name: 'EU UK and CH 50GB',
  unitPrice: 20.99,
  location: 'ch',
};
export const mockCartItemToAdd1: CartItemToAdd = {
  productId: 'product-id-1',
  name: 'EU Unlimited Calls',
  unitPrice: 41.99,
  location: 'europe',
};
