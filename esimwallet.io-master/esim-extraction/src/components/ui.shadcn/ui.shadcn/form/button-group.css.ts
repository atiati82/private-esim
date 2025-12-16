import { style } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { inlineFlexCC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';
import { forCompLayer, globalStyleCompLayer } from '@/styles/utils';

export const buttonGroupVariants = recipe(
  {
    base: [
      inlineFlexCC,
      forCompLayer({
        height: cssVal.space.l2,
        padding: cssVal.space.s4,
        gap: cssVal.space.s3,
        lineHeight: 1.1,
        borderRadius: cssVal.radii.default,
        backgroundColor: vars.color.secondary.default,
      }),
    ],
    variants: {
      variant: {},
    },
  },
  'container',
);
export type ButtonGroupVariants = RecipeVariants<typeof buttonGroupVariants>;

export const buttonGroupItem = style(
  forCompLayer({
    position: 'relative',
    height: '100%',
    flexGrow: 1,
  }),
);

export const itemMotionTracker = style(forCompLayer({}));

//
// Assume the 1st nested element in the button group is a button or link
// and style them accordingly
//
globalStyleCompLayer(`${buttonGroupItem} > a, ${buttonGroupItem} > button`, {
  width: '100%',
  height: '100%',
  color: vars.color.muted.lighter,
  fontWeight: 600, // for some reason, here our standard weights (400,500,700) don't work that well...
  textAlign: 'center',
  backgroundColor: 'transparent',
});
globalStyleCompLayer(`${buttonGroupItem} > a:hover, ${buttonGroupItem} > button:hover`, {
  color: vars.color.foregroundAccent,
  backgroundColor: vars.color.muted.default,
});
globalStyleCompLayer(`${buttonGroupItem} > .active`, {
  color: vars.color.foregroundAccent,
  backgroundColor: vars.color.background,
});
