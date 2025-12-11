import { style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { forCompLayer } from '@/styles/utils';

export const wrapper = style(
  forCompLayer({
    'display': 'flex',
    'alignItems': 'center',
    'padding': cssVal.space.base,
    'width': cssVal.space.l6,
    'maxWidth': '100%',
    'borderWidth': 1,
    'borderRadius': cssVal.radii.medium,
    'backgroundColor': vars.color.muted.default,
    'backgroundSize': '12%',
    'backgroundPositionX': '96%',
    'backgroundPositionY': 'center',
    'backgroundRepeat': 'no-repeat',
    '@media': {
      [cssVal.screen.xsAndSmaller]: {
        alignItems: 'flex-start',
        padding: cssVal.space.s1,
      },
    },
  }),
);
