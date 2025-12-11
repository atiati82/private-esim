import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC, grid234Cols, pageContainer } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const whyEsimWalletListWrapper = style([
  pageContainer,
  grid234Cols,
  {
    margin: `${cssVal.space.s1} 0`,
  },
]);

export const whyEsimWalletListContentInfo = style([
  flexContainerC,
  {
    'background': vars.color.white,
    'flexDirection': 'column',
    'gap': cssVal.space.s1,
    'padding': cssVal.space.l1,
    'border': `1px solid ${vars.color.border}`,
    'borderRadius': cssVal.radii.default,
    ':hover': {
      borderColor: vars.color.primary.lighter,
    },
  },
]);

export const whyEsimWalletListContentIcon = style({
  color: vars.color.primary.default,
  marginBottom: '5px',
});

export const whyEsimWalletListContentDescription = style({
  color: vars.color.muted.lighter,
});
