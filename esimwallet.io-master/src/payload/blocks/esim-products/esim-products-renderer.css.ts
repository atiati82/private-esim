import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const esimProductsBlockContainer = style([
  {
    marginTop: cssVal.space.base,
    marginBottom: cssVal.space.base,
  },
]);
export const esimProductsBlockHeadContainer = style([
  flexContainer,
  {
    flexDirection: 'column',
    marginBottom: cssVal.space.s1,
    gap: cssVal.space.s5,
  },
]);

export const esimProductsBlockTitle = style({
  textWrap: 'pretty',
  color: vars.color.primary.darker,
  fontWeight: cssVal.fontWeight.semibold,
});
export const esimProductsBlockSubtitle = style({
  textWrap: 'pretty',
  color: vars.color.muted.foreground,
  fontWeight: cssVal.fontWeight.normal,
});
