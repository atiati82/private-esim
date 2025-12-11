import { globalStyle, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { rem } from '@/styles/utils';

export const wrapper = style({});
export const productsList = style({
  marginBottom: 0,
  marginLeft: `-${rem(15 / 16)}`,
  marginRight: `-${rem(15 / 16)}`,
});
globalStyle(`.${productsList} .family-products-head`, {
  borderRadius: 0,
});

globalStyle(`.${productsList} .no-products-msg`, {
  marginLeft: cssVal.space.base,
});
