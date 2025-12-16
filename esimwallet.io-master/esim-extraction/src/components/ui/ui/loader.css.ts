import { style } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { animSpinner } from '@/styles/animations/animations.css';
import { cssVal } from '@/styles/css-values';

export const loaderVariants = recipe({
  base: {
    display: 'flex',
    justifyContent: 'center',
  },
  variants: {
    variant: {
      default: {
        padding: cssVal.space.l4,
      },
      short: {
        padding: cssVal.space.l1,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
export type LoaderVariants = RecipeVariants<typeof loaderVariants>;

export const spinner = style([animSpinner]);
