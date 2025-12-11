import { style } from '@vanilla-extract/css';

import { avatarSizeVar } from '@/components/ui.shadcn/avatar.css';
import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { lineClamp1 } from '@/styles/typography.css';
import { forCompLayer } from '@/styles/utils';

// Link wrapper for entire card
export const wrapper = style(
  forCompLayer({
    'display': 'flex',
    'alignItems': 'center',
    'padding': cssVal.space.base,
    'width': cssVal.space.l6,
    'maxWidth': '100%',
    'borderWidth': 1,
    'borderColor': 'rgba(255, 255, 255, 0.08)',
    'borderRadius': cssVal.radii.medium,
    'backgroundColor': 'rgba(23, 23, 23, 0.7)',
    'backdropFilter': 'blur(16px)',
    'WebkitBackdropFilter': 'blur(16px)',
    'boxShadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 20px rgba(0, 0, 0, 0.3)',
    'transition': 'all 0.3s ease',
    ':hover': {
      borderColor: 'rgba(37, 99, 235, 0.5)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 25px rgba(37, 99, 235, 0.2)',
    },
    '@media': {
      [cssVal.screen.xsAndSmaller]: {
        alignItems: 'flex-start',
        padding: cssVal.space.s1,
      },
    },
  }),
);

export const cardImage = style(
  forCompLayer({
    '@media': {
      [cssVal.screen.xsAndSmaller]: {
        vars: {
          [avatarSizeVar]: cssVal.space.l1,
        },
        marginTop: cssVal.space.s4,
      },
    },
  }),
);

export const cardData = style(
  forCompLayer({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginInlineStart: cssVal.space.s1,
    overflow: 'hidden',
  }),
);

export const cardTitle = style([lineClamp1]);
export const cardSubtitle = style([
  lineClamp1,
  forCompLayer({
    fontSize: cssVal.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.6)',
    whiteSpace: 'nowrap',
  }),
]);
