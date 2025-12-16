import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';

export const container = style([{}]);

export const productsListBox = style({
  marginTop: cssVal.space.s2,
  marginBottom: cssVal.space.l1,
});
