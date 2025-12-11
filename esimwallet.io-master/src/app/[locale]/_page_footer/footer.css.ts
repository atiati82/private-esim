import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';

export const footerWrapper = style({
  backgroundColor: 'rgba(10, 10, 10, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  marginTop: 'auto',
});

export const footerContainer = style([
  pageContainer,
  {
    paddingTop: cssVal.space.base,
    paddingBottom: cssVal.space.base,
  },
]);

export const footerTop = style({
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'space-between',
  'gap': cssVal.space.l1,
  'paddingBottom': cssVal.space.s2,
  'borderBottom': '1px solid rgba(255, 255, 255, 0.04)',
  '@media': {
    [cssVal.screen.smAndSmaller]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: cssVal.space.base,
    },
  },
});

export const logoLink = style({
  display: 'flex',
  alignItems: 'center',
});

export const logo = style({
  height: '24px',
  width: 'auto',
  opacity: 0.9,
});

export const footerNav = style({
  'display': 'flex',
  'gap': cssVal.space.l2,
  '@media': {
    [cssVal.screen.smAndSmaller]: {
      flexDirection: 'column',
      gap: cssVal.space.s2,
    },
  },
});

export const linkGroup = style({
  display: 'flex',
  gap: cssVal.space.base,
  flexWrap: 'wrap',
});

export const footerLink = style({
  'color': 'rgba(255, 255, 255, 0.5)',
  'fontSize': cssVal.fontSize.xs,
  'textDecoration': 'none',
  'transition': 'color 0.2s ease',
  ':hover': {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export const socialLinks = style({
  display: 'flex',
  gap: cssVal.space.s2,
  alignItems: 'center',
});

export const socialLink = style({
  'color': 'rgba(255, 255, 255, 0.4)',
  'transition': 'color 0.2s ease',
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  ':hover': {
    color: 'rgba(59, 130, 246, 1)',
  },
});

export const footerBottom = style({
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'space-between',
  'paddingTop': cssVal.space.s2,
  '@media': {
    [cssVal.screen.smAndSmaller]: {
      flexDirection: 'column',
      gap: cssVal.space.s1,
      alignItems: 'center',
    },
  },
});

export const copyright = style({
  color: 'rgba(255, 255, 255, 0.35)',
  fontSize: cssVal.fontSize.xs,
});

export const bottomLinks = style({
  display: 'flex',
  alignItems: 'center',
  gap: cssVal.space.s2,
});

export const bottomLink = style({
  'color': 'rgba(255, 255, 255, 0.35)',
  'fontSize': cssVal.fontSize.xs,
  'textDecoration': 'none',
  'transition': 'color 0.2s ease',
  ':hover': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export const divider = style({
  color: 'rgba(255, 255, 255, 0.2)',
  fontSize: cssVal.fontSize.xs,
});
