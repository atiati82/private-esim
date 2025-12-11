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
    'background': 'rgba(23, 23, 23, 0.7)',
    'backdropFilter': 'blur(16px)',
    'WebkitBackdropFilter': 'blur(16px)',
    'flexDirection': 'column',
    'gap': cssVal.space.s1,
    'padding': cssVal.space.l1,
    'border': '1px solid rgba(255, 255, 255, 0.08)',
    'borderRadius': cssVal.radii.default,
    'boxShadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.3)',
    'transition': 'all 0.3s ease',
    ':hover': {
      borderColor: 'rgba(37, 99, 235, 0.5)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 30px rgba(37, 99, 235, 0.2)',
    },
  },
]);

export const whyEsimWalletListContentIcon = style({
  color: 'rgba(37, 99, 235, 1)',
  marginBottom: '5px',
});

export const whyEsimWalletListContentDescription = style({
  color: 'rgba(255, 255, 255, 0.6)',
});
