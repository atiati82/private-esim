import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';

const screenInfo = (screen?: keyof typeof cssVal.screen): string => {
  return `SCREEN: ${(screen || '_').toUpperCase()}`;
};

/**
 * Debug screen, rendered on the bottom of the page (in the sticky footer)
 */
export const debugScreens = style({
  ':before': {
    position: 'absolute',
    zIndex: 2147483647,
    opacity: 0.69,
    left: cssVal.space.base,
    bottom: cssVal.space.base,
    paddingLeft: cssVal.space.s1,
    paddingRight: cssVal.space.s1,
    fontSize: cssVal.fontSize.tiny,
    borderRadius: cssVal.radii.small,
    color: '#fff',
    backgroundColor: 'hsl(228, 51%, 21%)',
    boxShadow: '0 0 0 0.5px #fff',
    content: screenInfo(),
  },
  '@media': {
    [cssVal.screen.xs]: {
      ':before': { content: screenInfo('xs') },
    },
    [cssVal.screen.sm]: {
      ':before': { content: screenInfo('sm') },
    },
    [cssVal.screen.md]: {
      ':before': { content: screenInfo('md'), left: 'calc(50% - 30px)' },
    },
    [cssVal.screen.lg]: {
      ':before': { content: screenInfo('lg') },
    },
    [cssVal.screen.xl]: {
      ':before': { content: screenInfo('xl') },
    },
    [cssVal.screen.xxl]: {
      ':before': { content: screenInfo('xxl') },
    },
  },
});
