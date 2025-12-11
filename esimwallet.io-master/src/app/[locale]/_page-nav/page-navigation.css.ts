import { createVar, style } from '@vanilla-extract/css';

import { transitionBgColors } from '@/styles/animations/animations.css';
import { cssVal } from '@/styles/css-values';
import { flexContainerJbC, pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
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
  backgroundColor: `hsl(0 0% 100% / 0.8)`,
  backdropFilter: 'blur(6px)',
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
  'backgroundColor': vars.color.secondary.default,
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
    'color': vars.color.foreground,
    'textDecoration': 'none',
    'paddingTop': cssVal.space.s1,
    'paddingBottom': cssVal.space.s1,
    'paddingLeft': cssVal.space.s1,
    'paddingRight': cssVal.space.s1,
    'borderRadius': _borderRadiusVar,
    'selectors': {
      '& + &': {
        marginLeft: cssVal.space.s4,
      },
      '&.active': {
        backgroundColor: vars.color.background,
      },
    },
    ':hover': {
      backgroundColor: vars.color.background,
    },
    ':active': {
      color: vars.color.foregroundAccent,
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
