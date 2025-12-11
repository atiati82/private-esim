import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { pageContainer, spaceBetween } from '@/styles/layout.css';
import { lightThemeTokens, vars } from '@/styles/theme.css';

export const heroWrapper = style({
  'position': 'relative',
  'height': 'auto',
  'background': `hsl(218, 37%, 23%) url('/images/hero-bg.svg') no-repeat`,
  'backgroundSize': 'cover',
  'backgroundPosition': 'bottom',
  'overflow': 'hidden',
  'color': vars.color.white,
  '::after': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '45%',
    height: '50vh',
    background: `linear-gradient(90deg, 
      hsl(221, 22%, 14%),
      hsl(218, 37%, 23%),
      hsl(216, 47%, 32%),
      hsl(214, 56%, 41%),
      hsl(210, 61%, 46%),
      hsl(206, 57%, 48%),
      hsl(202, 52%, 51%),
      hsl(199, 51%, 56%))`,
    pointerEvents: 'none',
    filter: 'blur(100px)',
  },
  '@media': {
    [cssVal.screen.md]: {
      height: '630px',
    },
  },
});

export const heroContainer = style([
  pageContainer,
  spaceBetween.y.base,
  {
    'position': 'relative',
    'paddingTop': cssVal.space.l2,
    'paddingBottom': cssVal.space.l1,
    'textAlign': 'center',
    'zIndex': 2,
    '@media': {
      [cssVal.screen.xsAndSmaller]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
]);

export const headline = style({
  padding: `0 ${cssVal.space.base}`,
});

export const subtitle = style({
  color: lightThemeTokens.color.white,
  opacity: 0.8,
  fontSize: cssVal.fontSize.lg,
  fontWeight: cssVal.fontWeight.light,
  lineHeight: cssVal.lineHeight.dynamic,
  padding: `0 ${cssVal.space.base}`,
});

export const badge = style([
  spaceBetween.x.s3,
  {
    width: 'fit-content',
    background: `hsla(0, 0%, 100%, 0.1)`,
    justifySelf: 'center',
    padding: `${cssVal.space.s5} ${cssVal.space.s1}`,
    borderRadius: cssVal.radii.large,
    fontSize: cssVal.fontSize.xs,
    margin: 'auto',
  },
]);
