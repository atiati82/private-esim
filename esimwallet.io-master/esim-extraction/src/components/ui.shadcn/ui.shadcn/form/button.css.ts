import { createVar, style } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { animSpinner, transitionTextBgColors } from '@/styles/animations/animations.css';
import { cssVal } from '@/styles/css-values';
import { inlineFlexCC } from '@/styles/layout.css';
import { disabledButtonStates } from '@/styles/shared-rules';
import { vars } from '@/styles/theme.css';
import { linkHoverStyles, linkStyles } from '@/styles/typography.css';
import { forCompLayer, pxToRem } from '@/styles/utils';

export const buttonIconSize = createVar();

export const buttonVariants = recipe(
  {
    base: [
      inlineFlexCC,
      transitionTextBgColors,
      forCompLayer({
        paddingLeft: cssVal.space.s1,
        paddingRight: cssVal.space.s1,
        borderRadius: cssVal.radii.default,
        fontSize: cssVal.fontSize.sm,
        textDecoration: 'none',
        verticalAlign: 'middle', // fixes some issues when icon is rendered inside...
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
        borderWidth: 1,
        borderColor: 'transparent',
        ...disabledButtonStates,
      }),
    ],
    variants: {
      variant: {
        primary: forCompLayer({
          'color': vars.color.primary.foreground,
          'backgroundColor': vars.color.primary.default,
          ':hover': {
            backgroundColor: vars.color.primary.darker,
          },
        }),
        secondary: forCompLayer({
          'color': vars.color.secondary.foreground,
          'backgroundColor': vars.color.secondary.default,
          ':hover': {
            borderColor: vars.color.primary.default,
          },
        }),
        destructive: forCompLayer({
          'color': vars.color.destructive.foreground,
          'backgroundColor': vars.color.destructive.default,
          ':hover': {
            backgroundColor: vars.color.destructive.darker,
          },
        }),
        outline: forCompLayer({
          'color': vars.color.primary.default,
          'borderColor': vars.color.primary.default,
          'backgroundColor': vars.color.background,
          ':hover': {
            color: vars.color.primary.foreground,
            backgroundColor: vars.color.primary.default,
          },
        }),
        ghost: forCompLayer({
          'color': 'inherit',
          'backgroundColor': 'transparent',
          ':hover': {
            backgroundColor: vars.color.secondary.default,
          },
        }),
        link: forCompLayer({
          ...linkStyles,
          ':hover': linkHoverStyles,
        }),
      },
      /**
       * Button size
       *
       * * **tiny**: can be inlined inside standard text
       * * **sm**: used on product listing pages
       * * **toolbar**: tabs, inside button toolbar (group of buttons)
       * * **default**: standard in forms, actions in MyAccount etc.
       * * **lg**: large button (used in nav, buy button on product page,
       *           email cta, payment buttons with icon)
       * * **cta**: CTA on home page
       */
      size: {
        tiny: forCompLayer({
          height: pxToRem(24),
          paddingLeft: cssVal.space.s2,
          paddingRight: cssVal.space.s2,
          fontSize: cssVal.fontSize.xs,
          borderRadius: cssVal.radii.small,
        }),
        sm: forCompLayer({
          height: pxToRem(32),
          fontSize: cssVal.fontSize.sm,
          borderRadius: cssVal.radii.small,
        }),
        toolbar: forCompLayer({
          height: pxToRem(36),
          fontWeight: cssVal.fontWeight.semibold,
        }),
        default: forCompLayer({
          height: pxToRem(40),
          fontWeight: cssVal.fontWeight.semibold,
        }),
        lg: forCompLayer({
          height: pxToRem(48),
          paddingLeft: cssVal.space.base,
          paddingRight: cssVal.space.base,
          fontSize: cssVal.fontSize.base,
          fontWeight: cssVal.fontWeight.semibold,
        }),
        cta: forCompLayer({
          height: pxToRem(52),
          paddingLeft: cssVal.space.l1,
          paddingRight: cssVal.space.l1,
          fontSize: cssVal.fontSize.base,
          fontWeight: cssVal.fontWeight.semibold,
          borderRadius: cssVal.radii.medium,
        }),
        icon: forCompLayer({
          'vars': { [buttonIconSize]: pxToRem(40) },
          'padding': 0,
          'width': buttonIconSize,
          'height': buttonIconSize,
          'color': vars.color.primary.default,
          'backgroundColor': vars.color.secondary.default,
          ':hover': {
            backgroundColor: vars.color.accent.lighter,
            color: vars.color.primary.darker,
          },
        }),
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
  'btn',
);

// const buttonVariantIconClassName = buttonVariants({ size: 'icon' }).split(' ').pop();
// globalStyleCompLayer(`.${buttonVariantIconClassName} > svg`, {
//   width: '100%', // make the icon the size of the wrapping button.icon
// });

// TODO: support / style any icon inside button... for different size variants
export const loadingIcon = style([
  animSpinner,
  forCompLayer({
    marginRight: cssVal.space.s3,
  }),
]);

export type ButtonVariants = RecipeVariants<typeof buttonVariants>;
