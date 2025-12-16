import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC } from '@/styles/layout.css';

export const compatibleDevicesWrapper = style([
  flexContainerC,
  {
    flexDirection: 'column',
    gap: cssVal.space.l1,
    background:
      'linear-gradient(180deg, rgba(10, 10, 10, 0.9) 0%, rgba(23, 23, 23, 0.7) 50%, rgba(10, 10, 10, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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
