import { globalStyle, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { rem } from '@/styles/utils';

export const popoverTrigger = style({});

export const icon = style({
  width: '1.2rem',
  height: '1.2rem',
  flexShrink: 0,
  opacity: 0.5,
  selectors: {
    [`${popoverTrigger}:hover &`]: {
      opacity: 1,
    },
  },
});
export const content = style({
  width: rem(16),
  fontSize: cssVal.fontSize.sm,
});
globalStyle(`${content} b, ${content} strong`, {
  fontWeight: cssVal.fontWeight.semibold,
});

export const name = style({
  // color: vars.color.muted.foreground,
});
