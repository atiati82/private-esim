import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerCC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const headlineHeroContainer = style([
  flexContainerCC,
  {
    position: 'relative',
    backgroundImage: 'url(/images/hero-grid.png)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    flexDirection: 'column',
    gap: cssVal.space.base,
    padding: `${cssVal.space.l1} 0`,
  },
]);
export const headlineHeroTip = style({
  display: 'inline-flex',
  backgroundColor: vars.color.primary.foreground,
  padding: cssVal.space.s1,
  color: vars.color.primary.darker,
  borderRadius: cssVal.radii.large,
  fontSize: cssVal.fontSize.sm,
  gap: cssVal.space.base,
  alignItems: 'center',
  textWrap: 'pretty',
});
export const headlineHeroTitle = style({
  textWrap: 'pretty',
});
export const headlineHeroSubtitle = style({
  color: vars.color.secondary.foreground,
  fontWeight: cssVal.fontWeight.light,
  textWrap: 'pretty',
});
