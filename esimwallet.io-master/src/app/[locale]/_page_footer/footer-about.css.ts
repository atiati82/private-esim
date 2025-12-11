import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { lightThemeTokens, vars } from '@/styles/theme.css';
import { forCompLayer, hslVal } from '@/styles/utils';

export const footerLogoSection = style({
  display: 'flex',
  flexDirection: 'column',
  gridArea: 'logo',
});

export const footerLogoLink = style({
  marginTop: -2,
  marginBottom: -2, // just to align the text under with the text in the following column(s)
  alignSelf: 'flex-start',
});
export const footerLogo = style(
  forCompLayer({
    'color': lightThemeTokens.color.white,
    ':hover': {
      textShadow: `0px 0px 16px hsla(${hslVal(lightThemeTokens.color.white)}, .69)`,
    },
  }),
);

export const footerCompanyDescription = style({
  'fontSize': cssVal.fontSize.sm,
  'color': vars.color.white,
  'opacity': 0.7,
  'marginInlineEnd': cssVal.space.l2,
  '@media': {
    [cssVal.screen.smAndSmaller]: {
      marginInlineEnd: 0,
    },
  },
});

export const footerLogoPaymentsIcons = style({
  marginTop: cssVal.space.base,
  marginBottom: cssVal.space.s1,
  display: 'flex',
  alignItems: 'center',
  gap: cssVal.space.base, // spacing between icons
});

export const footerPaymentsLogo = style({
  color: vars.color.white,
});
