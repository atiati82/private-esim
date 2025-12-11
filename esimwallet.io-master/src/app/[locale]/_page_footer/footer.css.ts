import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { quantumNeutral, quantumBlue } from '@/styles/utils/colors';

export const footerWrapper = style({
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
  backgroundImage: `linear-gradient(180deg, rgba(23, 23, 23, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)`,
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  position: 'sticky',
  top: '100%',
  marginTop: cssVal.space.l2,
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 -4px 30px rgba(0, 0, 0, 0.3)',
});

export const footerContainer = style([
  pageContainer,
  {
    'paddingTop': cssVal.space.l1,
    'paddingBottom': cssVal.space.l1,
    'color': vars.color.white,
    'alignItems': 'start',
    'display': 'grid',
    'gridTemplateColumns': 'repeat(3, 1fr)',
    'gridTemplateRows': 'auto auto 1fr',
    'gap': `${cssVal.space.s2}`,
    'gridAutoRows': 'minmax(auto, 1fr)',
    'gridTemplateAreas': `
        "logo logo contact"
        "explore-esim legal customer-care"
      `,
    '@media': {
      [cssVal.screen.md]: {},
      [cssVal.screen.lg]: {
        paddingTop: cssVal.space.l2,
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateAreas: `
          "logo logo explore-esim legal customer-care"
          "logo logo explore-esim legal contact"
        `,
      },
      [cssVal.screen.smAndSmaller]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateAreas: `
          "logo logo"
          "explore-esim customer-care"
          "explore-esim contact"
          "legal ."
        `,
      },
    },
  },
]);

// logo

// explore section
export const footerExploreESIMwallet = style({
  display: 'flex',
  flexDirection: 'column',
  gridArea: 'explore-esim',
  marginTop: cssVal.space.s1,
});

//customer care
export const footerCustomerCareSection = style({
  display: 'flex',
  flexDirection: 'column',
  fontSize: cssVal.fontSize.sm,
  gridArea: 'customer-care',
  marginTop: cssVal.space.s1,
});

// legal
export const footerLegalSection = style({
  display: 'flex',
  flexDirection: 'column',
  fontSize: cssVal.fontSize.sm,
  gridArea: 'legal',
  marginTop: cssVal.space.s1,
});

// contact
export const footerContactSection = style({
  display: 'flex',
  flexDirection: 'column',
  gridArea: 'contact',
  marginTop: cssVal.space.s1,
});

// copyrights
export const footerCopyrightsWrapper = style({
  paddingTop: cssVal.space.base,
  paddingBottom: cssVal.space.base,
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
});
export const footerCopyrights = style([
  pageContainer,
  {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'space-between',
    'color': vars.color.white,
    'fontSize': cssVal.fontSize.xs,
    'fontWeight': cssVal.fontWeight.light,
    '@media': {
      [cssVal.screen.smAndSmaller]: {
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: cssVal.space.s1,
      },
    },
  },
]);

export const footerCopyrightsSocialWrapper = style({
  display: 'flex',
  gap: cssVal.space.s1,
});

export const footerCopyrightsSocialList = style({
  display: 'flex',
  alignItems: 'center',
  gap: cssVal.space.s1,
});

// icon
export const footerIconSocialLink = style({
  'color': vars.color.white,
  'opacity': 0.7,
  ':hover': {
    color: vars.color.white,
    opacity: 1,
  },
});
