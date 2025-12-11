import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { forCompLayer } from '@/styles/utils';

export const badgeVariants = recipe({
  base: forCompLayer({
    display: 'inline-flex',
    paddingTop: cssVal.space.s5,
    paddingBottom: cssVal.space.s5,
    paddingLeft: cssVal.space.s2,
    paddingRight: cssVal.space.s2,
    borderRadius: cssVal.radii.large,
    fontSize: cssVal.fontSize.xs,
    fontWeight: cssVal.fontWeight.semibold,
    borderWidth: 1,
    borderColor: 'transparent',
    textDecoration: 'none',
  }),
  variants: {
    variant: {
      primary: forCompLayer({
        color: vars.color.primary.foreground,
        backgroundColor: vars.color.primary.default,
        // ':hover': {
        //   backgroundColor: vars.color.primary.darker,
        // },
      }),
      secondary: forCompLayer({
        color: vars.color.secondary.foreground,
        backgroundColor: vars.color.secondary.default,
        // ':hover': {
        //   borderColor: vars.color.primary.default,
        // },
      }),
      warning: forCompLayer({
        color: vars.color.warning.foreground,
        backgroundColor: vars.color.warning.default,
      }),
      destructive: forCompLayer({
        color: vars.color.destructive.foreground,
        backgroundColor: vars.color.destructive.default,
        // ':hover': {
        //   backgroundColor: vars.color.destructive.darker,
        // },
      }),
      outline: forCompLayer({
        color: vars.color.primary.default,
        borderColor: vars.color.primary.default,
        backgroundColor: vars.color.background,
        // ':hover': {
        //   color: vars.color.primary.foreground,
        //   backgroundColor: vars.color.primary.default,
        // },
      }),
    },
    size: {
      default: forCompLayer({}),
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export type BadgeVariants = RecipeVariants<typeof badgeVariants>;
