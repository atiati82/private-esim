import { style } from '@vanilla-extract/css';

import { avatarSizeVar } from '@/components/ui.shadcn/avatar.css';
import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { lineClamp1 } from '@/styles/typography.css';
import { forCompLayer } from '@/styles/utils';

// Link wrapper for entire card
export const wrapper = style(
  forCompLayer({
    //flex h-12 items-center rounded-md border border-input bg-background px-3
    // text-sm shadow hover:shadow-lg focus:outline-none focus:ring-1
    // focus:ring-ring md:h-16 lg:h-20 lg:px-5 lg:text-lg [&>h3]:line-clamp-1
    'display': 'flex',
    'alignItems': 'center',
    'padding': cssVal.space.base,
    'width': cssVal.space.l6,
    'maxWidth': '100%',
    'borderWidth': 1,
    'borderRadius': cssVal.radii.medium,
    'backgroundColor': vars.color.muted.default,
    ':hover': {
      borderColor: vars.color.primary.lighter,
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
    color: vars.color.muted.foreground,
    whiteSpace: 'nowrap',
  }),
]);
