import { globalStyle, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainer } from '@/styles/layout.css';

export const container = style([
  flexContainer,
  {
    alignItems: 'flex-start',
  },
]);
export const icon = style({
  width: '1.4rem',
  marginRight: cssVal.space.s1,
  marginTop: cssVal.space.s3,
  flexShrink: 0,
  opacity: 0.25,
});
export const content = style({
  flexGrow: 1,
});
globalStyle(`${content} b, ${content} strong`, {
  fontWeight: cssVal.fontWeight.semibold,
});

export const name = style({
  // color: vars.color.muted.foreground,
});
