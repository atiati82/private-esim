import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC, grid123Cols, pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const blogListingContainer = style([
  pageContainer,
  grid123Cols,
  {
    padding: cssVal.space.base,
  },
]);

export const blogListingTitle = style({
  textWrap: 'pretty',
});
export const blogListingTitleContainer = style([
  flexContainerC,
  {
    marginBottom: cssVal.space.base,
    gap: cssVal.space.base,
    width: '100%',
    color: vars.color.primary.darker,
  },
]);
