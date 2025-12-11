'use client';

import React, { MouseEventHandler, useTransition } from 'react';

import { emitFlashMessage, MessageType } from '@/data-store/messages';
import { navigateAction } from '@/data-store/router/router';
import { useAppDispatch } from '@/data-store/store-hooks';
import { Destination } from '@/data/destination';
import { EsimProduct } from '@/data/esim-product';
import { Region } from '@/data/region';
import { urlForCart } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { ButtonLink } from '@/navigation';

import { Button } from '@/components/ui.shadcn/form/button';
import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { addItemAction, CartItemToAdd } from '@/feat-cart/cart.store';
import { SecureCheckoutButton } from '@/feat-cart/secure-checkout-button';
import * as styles from './product-buy-button.css';

interface ProductBuyButtonProps {
  className?: string;
  /**
   * Product URL
   */
  url: string;
  product: EsimProduct;
  location: Destination | Region | undefined;
  isDetailsView?: boolean;
}

/**
 * The Buy button for eSIM package.
 * Shown on listings and details view (single page) of the product.
 */
export const ProductBuyButton: React.FC<ProductBuyButtonProps> = ({
  className,
  product,
  location,
  isDetailsView,
}) => {
  const dispatch = useAppDispatch();
  const [_, startTransition] = useTransition();

  const onBuyClick: MouseEventHandler = (ev): void => {
    ev.preventDefault();

    const cartItemToAdd: CartItemToAdd = {
      productId: product.id,
      name: product.name,
      unitPrice: product.productPricing.listPrice,
      location: location?.id,
    };
    dispatch(addItemAction(cartItemToAdd));
    dispatch(
      emitFlashMessage({
        path: 'checkout',
        messageType: MessageType.Success,
        title: 'Added to your cart',
        message: (
          <>
            <span>
              Product <strong>{product.name}</strong> has been added to your shopping cart.
            </span>
            <div className={styles.buttons}>
              <ButtonLink href={'/'} variant="secondary">
                Continue Shopping
              </ButtonLink>
              <SecureCheckoutButton style={{ width: 'auto' }}>Fast Checkout</SecureCheckoutButton>
            </div>
          </>
        ),
      }),
    );
    startTransition(() => {
      dispatch(navigateAction(urlForCart()));
    });
  };

  return (
    <Button onClick={onBuyClick} className={cn(styles.buyButton, className)}>
      {isDetailsView ? 'ADD TO CART' : 'BUY'}{' '}
      <CurrencyFormatter
        amount={product.productPricing.listPrice}
        className={styles.buyButtonPrice}
      />
    </Button>
  );
};
