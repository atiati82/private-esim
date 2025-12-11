import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC, flexContainerCC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const compatibleDevicesCardWrapper = style([
  flexContainerCC,
  {
    'flexDirection': 'column',
    'gap': cssVal.space.base,
    'border': '1px solid rgba(255, 255, 255, 0.08)',
    'borderRadius': cssVal.radii.large,
    'margin': `${cssVal.space.s1} 0`,
    'padding': cssVal.space.l1,
    'background': 'rgba(23, 23, 23, 0.7)',
    'backdropFilter': 'blur(16px)',
    'WebkitBackdropFilter': 'blur(16px)',
    'boxShadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.3)',
    'transition': 'all 0.3s ease',
    ':hover': {
      borderColor: 'rgba(37, 99, 235, 0.4)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 30px rgba(37, 99, 235, 0.15)',
    },
    '@media': {
      [cssVal.screen.smAndSmaller]: {
        margin: `${cssVal.space.s1} ${cssVal.space.base}`,
      },
    },
  },
]);

export const compatibleDevicesCardIcon = style({
  color: 'rgba(37, 99, 235, 1)',
  fill: 'rgba(37, 99, 235, 1)',
});

export const compatibleDevicesCardWrapperImage = style([
  flexContainerC,
  {
    gap: cssVal.space.l2,
    background: 'rgba(10, 10, 10, 0.5)',
    padding: `${cssVal.space.l1} ${cssVal.space.l2} 0`,
    borderRadius: cssVal.radii.default,
  },
]);

export const compatibleDevicesCardImage = style({
  maxWidth: '173px',
});

export const compatibleDevicesCardContent = style([
  {
    marginTop: cssVal.space.s2,
  },
]);

export const compatibleDevicesCardButton = style({
  width: '100%',
  fontWeight: cssVal.fontWeight.bold,
});
