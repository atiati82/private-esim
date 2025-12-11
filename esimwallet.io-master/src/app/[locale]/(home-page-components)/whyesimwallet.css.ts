import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const whyEsimWalletWrapper = style([
  flexContainerC,
  {
    flexDirection: 'column',
    gap: cssVal.space.l1,
    marginTop: cssVal.space.l2,
    background: vars.color.muted.default,
    textAlign: 'center',
    padding: `${cssVal.space.l2} 0`,
  },
]);

export const whyEsimWalletSubtitle = style({
  'fontSize': cssVal.fontSize.md,
  'lineHeight': cssVal.lineHeight.dynamic,
  'margin': `0 ${cssVal.space.base}`,
  '@media': {
    [cssVal.screen.lg]: {
      width: '50%',
    },
  },
});
