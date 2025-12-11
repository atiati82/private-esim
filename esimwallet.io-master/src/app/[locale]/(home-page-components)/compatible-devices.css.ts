import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const compatibleDevicesWrapper = style([
  flexContainerC,
  {
    flexDirection: 'column',
    gap: cssVal.space.l1,
    background: vars.color.muted.default,
    textAlign: 'center',
    padding: `${cssVal.space.l2} 0`,
  },
]);

export const compatibleDevicesHeadline = style({
  '@media': {
    [cssVal.screen.xsAndSmaller]: {
      padding: `0 ${cssVal.space.base}`,
    },
  },
});

export const compatibleDevicesSubtitle = style({
  fontSize: cssVal.fontSize.md,
  lineHeight: cssVal.lineHeight.dynamic,
  padding: `0 ${cssVal.space.l1}`,
});
