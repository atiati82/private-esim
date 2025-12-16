import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';

export const wrapper = style({
  display: 'flex',
  marginTop: cssVal.space.l1,
  marginBottom: cssVal.space.base,
});

export const data = style({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  marginInlineStart: cssVal.space.s1,
});

export const title = style([]);
export const subtitle = style({
  fontSize: cssVal.fontSize.sm,
  color: vars.color.muted.foreground,
});
