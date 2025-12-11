import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';

export const headline = style({
  marginBottom: cssVal.space.base,
});

export const flashMessage = style({
  marginBottom: cssVal.space.l2,
});
