import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { forCompLayer } from '@/styles/utils';

export const container = style(
  forCompLayer({
    marginBottom: cssVal.space.l3,
  }),
);

export const noProductsMsg = style(
  forCompLayer({
    marginBottom: cssVal.space.s1,
  }),
);
