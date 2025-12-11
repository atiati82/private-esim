import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC, flexContainerCC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const blogPostInfoContainer = style([
  flexContainerC,
  {
    padding: `${cssVal.space.base} 0`,
    justifyContent: 'space-between',
    gap: cssVal.space.base,
    flexWrap: 'wrap',
  },
]);

export const blogPostInfoSection = style([
  flexContainerCC,
  {
    gap: cssVal.space.base,
    color: vars.color.secondary.foreground,
  },
]);
export const blogPostInfoAuthorContent = style([
  flexContainerCC,
  {
    gap: cssVal.space.base,
    borderRight: '1px solid',
    borderColor: vars.color.secondary.darker,
    paddingRight: cssVal.space.base,
  },
]);
