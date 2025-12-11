import React, { Suspense } from 'react';

import { RootPageArgs } from '@/lib/types';

import { Headline } from '@/components/ui/Headline';
import { Loader } from '@/components/ui/loader';
import { RenderFlashMessage } from '@/components/ui/message/render-flash-message';
import { CartPage } from '@/feat-cart/cart-page';
import { narrowPageContainer } from '@/styles/layout.css';
import * as styles from './page.css';

export const dynamic = 'force-dynamic';

const NextCartPage: React.FC<RootPageArgs> = () => {
  return (
    <div className={narrowPageContainer}>
      <RenderFlashMessage className={styles.flashMessage} messagePath="checkout" />
      <Headline className={styles.headline}>Your Cart</Headline>
      <Suspense fallback={<Loader variant="short" />}>
        <CartPage />
      </Suspense>
    </div>
  );
};

export default NextCartPage;
