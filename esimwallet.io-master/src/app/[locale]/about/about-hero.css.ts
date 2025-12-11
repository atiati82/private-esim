import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const aboutHeroContainer = style([
  pageContainer,
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: cssVal.space.l2,
    marginBottom: cssVal.space.l2,
    gap: cssVal.space.base,
  },
]);

export const aboutHeroSubTitle = style({
  padding: cssVal.space.s1,
  gap: cssVal.space.s3,
  borderRadius: cssVal.radii.large,
  backgroundColor: vars.color.primary.foreground,
  fontSize: cssVal.fontSize.xs,
});

export const aboutHeroDescription = style({
  fontSize: cssVal.fontSize.lg,
  color: vars.color.secondary.foreground,
  textAlign: 'center',
});
