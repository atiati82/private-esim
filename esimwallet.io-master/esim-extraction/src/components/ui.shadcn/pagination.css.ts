import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { flexContainerC, flexContainerCC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { forCompLayer } from '@/styles/utils';

export const paginationContainer = style([
  flexContainerCC,
  {
    margin: `${cssVal.space.base} auto`,
  },
]);

export const paginationContent = style([
  flexContainerC,
  {
    gap: cssVal.space.s1,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
]);
export const paginationItem = style([
  {
    fontWeight: cssVal.fontWeight.semibold,
    color: vars.color.secondary.foreground,
  },
]);

export const paginationHref = recipe({
  variants: {
    as: {
      active: forCompLayer({
        'color': vars.color.secondary.default,
        'backgroundColor': vars.color.primary.default,
        ':hover': {
          color: vars.color.secondary.default,
          backgroundColor: vars.color.primary.darker,
        },
      }),
      outline: forCompLayer({
        border: '1px solid',
        borderColor: vars.color.secondary.darker,
      }),
      default: forCompLayer({
        'color': vars.color.secondary.foreground,
        'backgroundColor': 'transparent',
        ':hover': {
          color: vars.color.primary.default,
        },
      }),
    },
  },
  defaultVariants: {
    as: 'default',
  },
});
