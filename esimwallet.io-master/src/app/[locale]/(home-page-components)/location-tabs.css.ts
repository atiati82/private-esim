import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { flexContainerCC } from '@/styles/layout.css';
import { rem } from '@/styles/utils';

export const container = style([flexContainerCC, {}]);

export const buttonGroup = style({
  'width': rem(24),
  'zIndex': 2,
  '@media': {
    [cssVal.screen.xsAndSmaller]: {
      width: '100%',
    },
  },
});
