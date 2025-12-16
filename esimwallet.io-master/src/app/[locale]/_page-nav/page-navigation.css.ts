import { createVar, style } from '@vanilla-extract/css';

import { transitionBgColors } from '@/styles/animations/animations.css';
import { cssVal } from '@/styles/css-values';
import { flexContainerJbC, pageContainer } from '@/styles/layout.css';
import { rem } from '@/styles/utils';

const breakpoint = 550;
const mobileScreenBreakpoint = `screen and (max-width: ${breakpoint - 1}px)`;
const desktopScreenBreakpoint = `screen and (min-width: ${breakpoint}px)`;

const mediaHideOnMobile = {
  [mobileScreenBreakpoint]: {
    display: 'none',
  },
};
const mediaHideOnDesktop = {
  [desktopScreenBreakpoint]: {
    display: 'none',
  },
};

export const stickyWrapper = style({
  position: 'sticky',
  zIndex: cssVal.zIndex.nav,
  top: 0,
  backgroundColor: `rgba(10, 10, 10, 0.6)`,
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
});

export const container = style([
  pageContainer,
  flexContainerJbC,
  {
    'flexWrap': 'wrap',
    'height': rem(4.5),
    '@media': {
      [cssVal.screen.md]: {
        height: cssVal.space.l4,
      },
    },
  },
]);

const _borderRadiusVar = createVar();

export const nav = style({
  'vars': {
    [_borderRadiusVar]: cssVal.space.l1,
  },
  'padding': cssVal.space.s2,
  'fontSize': cssVal.fontSize.sm,
  'borderRadius': _borderRadiusVar,
  'backgroundColor': 'rgba(255, 255, 255, 0.03)',
  'backdropFilter': 'blur(16px)',
  'WebkitBackdropFilter': 'blur(16px)',
  'border': '1px solid rgba(255, 255, 255, 0.06)',
  'boxShadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 12px rgba(0, 0, 0, 0.2)',
  '@media': {
    ...mediaHideOnMobile,
    [cssVal.screen.md]: {
      padding: cssVal.space.s1,
      fontSize: cssVal.fontSize.base,
    },
  },
});
export const navItem = style([
  transitionBgColors,
  {
    'display': 'inline-block',
    'color': 'rgba(255, 255, 255, 0.9)',
    'textDecoration': 'none',
    'paddingTop': cssVal.space.s1,
    'paddingBottom': cssVal.space.s1,
    'paddingLeft': cssVal.space.s1,
    'paddingRight': cssVal.space.s1,
    'borderRadius': _borderRadiusVar,
    'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    'selectors': {
      '& + &': {
        marginLeft: cssVal.space.s4,
      },
      '&.active': {
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        color: 'hsl(0 0% 100%)',
        boxShadow: '0 0 20px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      '&.active:hover': {
        backgroundColor: 'rgba(37, 99, 235, 0.9)',
        boxShadow: '0 0 24px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      },
      '&:not(.active):hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
    ':active': {
      color: 'hsl(221.2 83.2% 63.3%)',
      transform: 'scale(0.98)',
    },
  },
]);

export const mobileNavTrigger = style({});
export const mobileCommandList = style({
  maxHeight: 'none',
});
export const hideWhenMainNavVisible = style({
  '@media': {
    ...mediaHideOnDesktop,
  },
});
