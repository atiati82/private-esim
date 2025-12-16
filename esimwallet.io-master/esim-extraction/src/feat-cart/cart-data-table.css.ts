import { globalStyle, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';

export const cartDataTable = style({});
globalStyle(`${cartDataTable} tbody td`, {
  whiteSpace: 'nowrap',
});

export const qty = style({
  display: 'inline-block',
  minWidth: 20,
  textAlign: 'center',
});

export const headerQty = style({
  textAlign: 'center',
  paddingRight: cssVal.space.s1,
});
export const headerAmount = style({
  textAlign: 'right',
});
export const cellAmountFormatter = style({
  display: 'flex',
  justifyContent: 'flex-end',
});
