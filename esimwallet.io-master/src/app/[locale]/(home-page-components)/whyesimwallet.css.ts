import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC } from '@/styles/layout.css';

export const whyEsimWalletWrapper = style([
  flexContainerC,
  {
    flexDirection: 'column',
    gap: cssVal.space.l1,
    marginTop: cssVal.space.l2,
    background: 'linear-gradient(180deg, rgba(23, 23, 23, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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
