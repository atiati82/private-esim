import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerC, flexContainerCC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const compatibleDevicesCardWrapper = style([
  flexContainerCC,
  {
    'flexDirection': 'column',
    'gap': cssVal.space.base,
    'border': `1px solid ${vars.color.border}`,
    'borderRadius': cssVal.radii.large,
    'margin': `${cssVal.space.s1} 0`,
    'padding': cssVal.space.l1,
    'background': vars.color.background,
    '@media': {
      [cssVal.screen.smAndSmaller]: {
        margin: `${cssVal.space.s1} ${cssVal.space.base}`,
      },
    },
  },
]);

export const compatibleDevicesCardIcon = style({
  color: vars.color.primary.default,
  fill: vars.color.primary.default,
});

export const compatibleDevicesCardWrapperImage = style([
  flexContainerC,
  {
    gap: cssVal.space.l2,
    background: vars.color.muted.default,
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
