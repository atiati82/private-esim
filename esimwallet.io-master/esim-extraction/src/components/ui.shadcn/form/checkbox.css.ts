import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';

// form <button> in which the <span> indicator (below) is being shown, when checked
export const root = style({
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
  borderWidth: 1,
  borderRadius: cssVal.radii.small,
  borderColor: vars.color.primary.lighter,
  outlineColor: vars.color.primary.lighter,
  selectors: {
    '&[data-state=checked]': {
      color: vars.color.primary.foreground,
      backgroundColor: vars.color.primary.lighter,
      borderColor: vars.color.primary.lighter,
    },
  },
});

export const indicator = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 1,
});

export const checkmarkIcon = style({
  width: '100%',
  height: '100%',
});
