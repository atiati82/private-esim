import { StyleRule } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';

export const disabledStyles: StyleRule = {
  opacity: cssVal.opacity.disabled,
  pointerEvents: 'none',
  cursor: 'not-allowed',
};

export const disabledButtonStates: StyleRule = {
  ':disabled': disabledStyles,
  'selectors': {
    '&[aria-disabled=true]': disabledStyles,
  },
};
