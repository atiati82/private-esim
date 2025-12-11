import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';

export const footerSectionTitle = style({
  marginBottom: cssVal.space.s4,
});
export const footerSectionList = style({
  display: 'flex',
  flexDirection: 'column',
  fontSize: cssVal.fontSize.sm,
});
export const footerNavLinks = style({
  'width': 'fit-content',
  'paddingRight': cssVal.space.s2,
  'color': vars.color.white,
  'opacity': 0.7,
  ':hover': {
    color: vars.color.white,
    opacity: 1,
  },
});
