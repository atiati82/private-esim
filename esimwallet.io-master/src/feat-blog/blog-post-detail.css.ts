import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainer, pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const blogPostContainer = style([
  pageContainer,
  {
    'backgroundImage': 'url(/images/hero-grid.png)',
    'backgroundRepeat': 'no-repeat',
    'backgroundPosition': '0 0%',
    'backgroundSize': 'contain',
    '@media': {
      [cssVal.screen.md]: {
        backgroundPosition: '0 10%',
      },
    },
  },
]);
export const blogPostFeaturedImage = style({
  width: '100%',
  aspectRatio: '10/4',
  position: 'relative',
  borderRadius: cssVal.radii.medium,
  overflow: 'hidden',
  background: `${vars.color.black}`,
});
export const blogPostTitle = style({
  color: vars.color.primary.darker,
  marginTop: cssVal.space.l1,
  marginBottom: cssVal.space.base,
  textWrap: 'pretty',
});

export const blogPostSection = style([
  flexContainer,
  {
    '@media': {
      [cssVal.screen.md]: {
        gap: cssVal.space.l3,
      },
    },
  },
]);
export const blogPostMainSection = style({
  'width': '100%',
  '@media': {
    [cssVal.screen.md]: {
      width: '75%',
    },
  },
});
export const blogPostMainContent = style({
  marginTop: cssVal.space.l1,
  marginBottom: cssVal.space.l2,
});
export const blogPostSideSection = style({
  'width': '25%',
  'marginTop': cssVal.space.l3,
  'top': cssVal.space.base,
  'display': 'none',
  '@media': {
    [cssVal.screen.md]: {
      display: 'block',
    },
  },
});
