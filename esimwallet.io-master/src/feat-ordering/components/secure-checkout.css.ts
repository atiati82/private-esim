import { globalStyle, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerCC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const headline = style([
  flexContainerCC,
  {
    marginBottom: cssVal.space.l1,
  },
]);

export const headlineIcon = style({
  marginRight: cssVal.space.s3,
});
globalStyle(`${headlineIcon} > path`, {
  fill: vars.color.primary.default,
  color: vars.color.background,
});

export const poweredByContainer = style({
  position: 'relative',
});
export const poweredBy = style({
  'position': 'absolute',
  'width': 150 / 2,
  'height': 34 / 2,
  'bottom': 5,
  'right': -150 / 2 - 10,
  'opacity': 0.5,
  'backgroundImage': 'url(/images/powered-by-stripe-black.svg)',
  'backgroundRepeat': 'no-repeat',
  'backgroundSize': 'contain',
  ':hover': {
    opacity: 1,
    backgroundImage: 'url(/images/powered-by-stripe-blue.svg)',
  },
});
