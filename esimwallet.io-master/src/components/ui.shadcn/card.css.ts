import { style } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { flexContainerC, flexContainerJbC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { forCompLayer } from '@/styles/utils';

export const cardVariants = recipe({
  base: forCompLayer({
    position: 'relative',
    maxWidth: '100%',
  }),
  variants: {
    variant: {
      'default': forCompLayer({
        'padding': cssVal.space.base,
        'borderWidth': 1,
        'backgroundColor': vars.color.background,
        'boxShadow': vars.shadow.card,
        'borderRadius': cssVal.radii.medium,
        ':hover': {
          borderColor: vars.color.primary.lighter,
        },
      }),
      'modal': forCompLayer({
        'marginLeft': 'auto',
        'marginRight': 'auto',
        'padding': cssVal.space.l1,
        'backgroundColor': vars.color.background,
        'boxShadow': vars.shadow.compact,
        'borderRadius': cssVal.radii.large,
        '@media': {
          [cssVal.screen.smAndSmaller]: {
            width: 'auto',
            maxWidth: 'none',
            marginLeft: `-${cssVal.space.base}`,
            marginRight: `-${cssVal.space.base}`,
            padding: cssVal.space.base,
          },
        },
      }),
      'modal-grey': forCompLayer({
        'marginLeft': 'auto',
        'marginRight': 'auto',
        'padding': cssVal.space.l1,
        'backgroundColor': vars.color.muted.default,
        'boxShadow': vars.shadow.compact,
        'borderRadius': cssVal.radii.large,
        '@media': {
          [cssVal.screen.smAndSmaller]: {
            width: 'auto',
            maxWidth: 'none',
            marginLeft: `-${cssVal.space.base}`,
            marginRight: `-${cssVal.space.base}`,
            padding: cssVal.space.base,
          },
        },
      }),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
export type CardVariants = RecipeVariants<typeof cardVariants>;

export const cardHeader = style(forCompLayer({}));

export const cardTitle = style([flexContainerC, forCompLayer({})]);

export const cardSubtitle = style(
  forCompLayer({
    marginTop: cssVal.space.s4,
  }),
);

export const cardContent = style(
  forCompLayer({
    marginTop: cssVal.space.s2,
  }),
);

export const cardFooter = style([
  flexContainerJbC,
  forCompLayer({
    marginTop: cssVal.space.s1,
  }),
]);
