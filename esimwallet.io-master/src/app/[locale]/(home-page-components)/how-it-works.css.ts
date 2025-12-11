import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC } from '@/styles/layout.css';

export const howItWorksWrapper = style([
  flexContainerC,
  {
    flexDirection: 'column',
    gap: cssVal.space.l1,
    padding: `${cssVal.space.l2} 0`,
    textAlign: 'center',
    background: 'transparent',
  },
]);

export const howItWorksSubtitle = style({
  fontSize: cssVal.fontSize.md,
  lineHeight: cssVal.lineHeight.dynamic,
  padding: `0 ${cssVal.space.l1}`,
});
