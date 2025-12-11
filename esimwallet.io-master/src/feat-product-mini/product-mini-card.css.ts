import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { spaceBetween } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { lineClamp1 } from '@/styles/typography.css';
import { rem } from '@/styles/utils';

export const card = style({
  // normally width would be controlled by grid, where this card is used
  'width': '20rem',
  /**
  'borderColor': vars.color.primary.foreground,
  'color': vars.color.primary.foreground,
  'backgroundColor': 'hsl(220, 29%, 50%)',
  'backgroundImage': `linear-gradient(
    45deg,
    hsl(227.1, 14.4%, 38%) 0%,
    hsl(223.8, 39.6%, 55.9%) 45%,
    hsl(200, 49%, 70%) 100%
  )`, **/
  '@media': {
    [cssVal.screen.xsAndSmaller]: {
      width: 'auto',
    },
  },
});

export const cardHeader = style({});

export const cardTitle = style([{}]);
export const cardProductName = style([lineClamp1, {}]);

export const cardSubtitle = style({
  color: vars.color.foregroundAccent,
});

export const cardContent = style([
  spaceBetween.y.s4,
  {
    fontSize: cssVal.fontSize.xs,
  },
]);

export const cardFooter = style({
  // Make BUY button standing out a bit...
  marginLeft: -2,
  marginRight: -2,
});

export const productDestinations = style({
  marginRight: cssVal.space.s3,
});

export const productEditLink = style({
  'position': 'absolute',
  'display': 'none',
  'top': rem(-0.4),
  'right': rem(-0.4),
  'opacity': 0.3,
  ':hover': {
    opacity: 1,
  },
  'selectors': {
    [`${card}:hover &`]: {
      display: 'block',
    },
  },
});
