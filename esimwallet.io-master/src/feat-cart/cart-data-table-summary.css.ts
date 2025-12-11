import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';

export const container = style({
  marginTop: cssVal.space.base,
});

export const summaryRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '50%',
  marginLeft: 'auto',
  marginTop: cssVal.space.s1,
  marginBottom: cssVal.space.s1,
  fontSize: cssVal.fontSize.sm,
});
export const summaryRowFinal = style({
  paddingTop: cssVal.space.s1,
  borderTopWidth: 1,
  borderColor: vars.color.border,
  fontSize: cssVal.fontSize.base,
});

const columnBase = style({
  textAlign: 'right',
  whiteSpace: 'nowrap',
  width: '50%',
});
export const columnDescr = style([columnBase, {}]);
export const columnAmount = style([
  columnBase,
  {
    width: '40%',
    paddingRight: cssVal.space.base,
  },
]);
