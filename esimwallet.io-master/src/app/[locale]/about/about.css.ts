import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const aboutContainer = style([
  pageContainer,
  {
    display: 'flex',
    flexDirection: 'column',
    gap: cssVal.space.l2,
  },
]);

export const aboutSectionWrap = style({
  'display': 'flex',
  'flexDirection': 'column',
  'justifyContent': 'start',
  'alignItems': 'start',
  'gap': cssVal.space.l1,
  'padding': cssVal.space.l1,
  'backgroundColor': vars.color.primary.foreground,
  'borderRadius': cssVal.radii.large,
  '@media': {
    [cssVal.screen.md]: {
      padding: cssVal.space.l2,
    },
  },
});

export const subTitle = style({
  fontSize: cssVal.fontSize.lg,
  fontWeight: cssVal.fontWeight.semibold,
  color: vars.color.primary.default,
});
