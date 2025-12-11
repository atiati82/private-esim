import { style } from '@vanilla-extract/css';

import { transitionTextBgColors } from '@/styles/animations/animations.css';
import { cssVal } from '@/styles/css-values';
import { lightThemeTokens, vars } from '@/styles/theme.css';
import { forBaseLayer, hslVal } from '@/styles/utils';

export const logoLink = style({
  lineHeight: 1,
});

export const logoWrapper = style([
  transitionTextBgColors,
  forBaseLayer({
    'paddingRight': cssVal.space.s1, // just to increase the "clickable" area
    'display': 'inline-flex',
    'alignItems': 'center',
    // Not sure about global styling of this:
    // Logo has these small dots outside the main wallet. This looks mis-aligned
    // when compared with text under etc. Add negative left offset to mitigate it.
    'marginInlineStart': '-0.56rem',
    'color': vars.color.primary.default,
    'fontSize': cssVal.fontSize.lg,
    'fontWeight': cssVal.fontWeight.bold,
    ':hover': {
      textShadow: `0px 0px 16px hsla(${hslVal(lightThemeTokens.color.primary.lighter)}, .55)`,
    },
  }),
]);

export const logoIcon = style(
  forBaseLayer({
    width: '1.66em', // scale it together with the parent font-size
  }),
);

export const logoText = style(
  forBaseLayer({
    marginTop: cssVal.space.s4,
  }),
);
