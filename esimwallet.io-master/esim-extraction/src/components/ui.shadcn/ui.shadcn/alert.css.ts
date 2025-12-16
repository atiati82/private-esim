import { globalStyle, style } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { spaceBetween } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { forBaseLayer, forCompLayer } from '@/styles/utils';

export const alertVariants = recipe({
  base: forCompLayer({
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'center',
    'marginLeft': 'auto',
    'marginRight': 'auto',
    'padding': cssVal.space.l1,
    'backgroundColor': vars.color.background,
    'boxShadow': vars.shadow.card,
    'borderRadius': cssVal.radii.large,
    '@media': {
      [cssVal.screen.smAndSmaller]: {
        marginLeft: cssVal.space.l2,
        marginRight: cssVal.space.l2,
      },
    },
  }),
  variants: {
    variant: {
      default: forCompLayer({}),
      success: forCompLayer({}),
      warning: forCompLayer({}),
      error: forCompLayer({}),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
export type AlertVariants = RecipeVariants<typeof alertVariants>;
export type AlertVariantsVariant = 'default' | 'success' | 'warning' | 'error';
export const alertVariantsVariants: AlertVariantsVariant[] = [
  'default',
  'success',
  'warning',
  'error',
];

export const alertCssSelector = alertVariants({ variant: 'default' }).split(' ')[0];
export const alertSuccessCssSelector = alertVariants({ variant: 'success' }).split(' ').pop();
export const alertWarningCssSelector = alertVariants({ variant: 'warning' }).split(' ').pop();
export const alertErrorCssSelector = alertVariants({ variant: 'error' }).split(' ').pop();

globalStyle(
  `${alertCssSelector} > svg`,
  forBaseLayer({
    width: 32,
    height: 32,
    marginBottom: cssVal.space.s1,
  }),
);
globalStyle(
  `${alertSuccessCssSelector} > svg`,
  forBaseLayer({
    color: vars.color.success.foreground,
  }),
);
globalStyle(
  `${alertWarningCssSelector} > svg`,
  forBaseLayer({
    color: vars.color.warning.foreground,
  }),
);
globalStyle(
  `${alertErrorCssSelector} > svg`,
  forBaseLayer({
    color: vars.color.destructive.default,
  }),
);

export const title = style(
  forCompLayer({
    textAlign: 'center',
  }),
);

export const description = style([
  spaceBetween.y.s1,
  forCompLayer({
    fontSize: cssVal.fontSize.sm,
    marginTop: cssVal.space.s4,
    textAlign: 'center',
    selectors: {
      [`${title} + &`]: { marginTop: cssVal.space.s1 },
    },
  }),
]);
