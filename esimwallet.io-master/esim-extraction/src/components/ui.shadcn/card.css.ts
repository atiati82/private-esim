import { style } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { flexContainerC, flexContainerJbC } from '@/styles/layout.css';
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
        'borderColor': 'rgba(255, 255, 255, 0.08)',
        'backgroundColor': 'rgba(23, 23, 23, 0.6)',
        'backdropFilter': 'blur(12px)',
        'WebkitBackdropFilter': 'blur(12px)',
        'boxShadow': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'borderRadius': cssVal.radii.medium,
        'transition': 'all 0.3s ease',
        ':hover': {
          borderColor: 'rgba(37, 99, 235, 0.4)',
          boxShadow: '0 0 30px rgba(37, 99, 235, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      }),
      'modal': forCompLayer({
        'marginLeft': 'auto',
        'marginRight': 'auto',
        'padding': cssVal.space.l1,
        'backgroundColor': 'rgba(23, 23, 23, 0.9)',
        'backdropFilter': 'blur(20px)',
        'WebkitBackdropFilter': 'blur(20px)',
        'borderColor': 'rgba(255, 255, 255, 0.1)',
        'borderWidth': 1,
        'boxShadow': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
        'backgroundColor': 'rgba(23, 23, 23, 0.7)',
        'backdropFilter': 'blur(16px)',
        'WebkitBackdropFilter': 'blur(16px)',
        'borderColor': 'rgba(255, 255, 255, 0.08)',
        'borderWidth': 1,
        'boxShadow': '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
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
