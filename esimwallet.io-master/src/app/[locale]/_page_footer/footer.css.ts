import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { quantumBlue, quantumSlate } from '@/styles/utils/colors';

export const footerWrapper = style({
  backgroundColor: 'rgba(10, 10, 10, 0.8)',
  backgroundImage: 'linear-gradient(180deg, rgba(23, 23, 23, 0.6) 0%, rgba(10, 10, 10, 0.9) 100%)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  borderTop: `1px solid ${vars.color.border}`,
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
  marginTop: cssVal.space.l2,
});

export const footerContainer = style([
  pageContainer,
  {
    'paddingTop': cssVal.space.base,
    'paddingBottom': cssVal.space.base,
    'display': 'flex',
    'flexDirection': 'column',
    'gap': cssVal.space.s2,
    '@media': {
      [cssVal.screen.md]: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    },
  },
]);

export const footerLinksRow = style({
  'display': 'flex',
  'flexWrap': 'wrap',
  'alignItems': 'center',
  'gap': cssVal.space.s2,
  '@media': {
    [cssVal.screen.smAndSmaller]: {
      justifyContent: 'center',
    },
  },
});

export const footerLink = style({
  'color': quantumSlate['400'],
  'fontSize': cssVal.fontSize.xs,
  'textDecoration': 'none',
  'transition': 'color 0.2s ease',
  ':hover': {
    color: quantumBlue['500'],
  },
});

export const footerDivider = style({
  color: vars.color.border,
  fontSize: cssVal.fontSize.xs,
  userSelect: 'none',
});

export const footerRight = style({
  'display': 'flex',
  'alignItems': 'center',
  'gap': cssVal.space.base,
  '@media': {
    [cssVal.screen.smAndSmaller]: {
      flexDirection: 'column',
      gap: cssVal.space.s2,
    },
  },
});

export const footerSocialList = style({
  display: 'flex',
  alignItems: 'center',
  gap: cssVal.space.s2,
});

export const footerIconSocialLink = style({
  'color': quantumSlate['500'],
  'transition': 'color 0.2s ease',
  ':hover': {
    color: quantumBlue['500'],
  },
});

export const footerCopyright = style({
  'color': quantumSlate['500'],
  'fontSize': cssVal.fontSize.xs,
  '@media': {
    [cssVal.screen.smAndSmaller]: {
      textAlign: 'center',
    },
  },
});
