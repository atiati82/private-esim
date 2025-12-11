import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { lightThemeTokens, vars } from '@/styles/theme.css';
import { hslVal, rem } from '@/styles/utils';

export const mainCardHeroImage = style({
  'display': 'none',
  'width': rem(28),
  'height': 'auto',
  'position': 'absolute',
  'boxShadow': `0 0 100px 30px hsla(${hslVal(lightThemeTokens.color.primary.default)}, .55)`,
  'background': `linear-gradient(45deg, hsl(227.1, 14.4%, 38%) 0%, hsl(223.8, 39.6%, 55.9%) 45%, hsl(200, 49%, 70%) 100%)`,
  'borderRadius': cssVal.radii.large,
  'margin': 'auto',
  'left': '50%',
  'transform': 'translateX(-50%)',
  'zIndex': 2,
  '@media': {
    [cssVal.screen.md]: {
      display: 'block',
    },
  },
});

export const mainHeroImage = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: cssVal.radii.large,
});
