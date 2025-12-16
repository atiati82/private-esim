import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { vars } from '@/styles/theme.css';

export const headlineVariants = recipe({
  base: {},
  variants: {
    like: {
      // use globally available .h1, .h1-large etc classes, defined in typography.css
      'h1-large': ['h1-large'],
      'h1': ['h1'],
      'h1-small': ['h1-small'],
      'h2-large': ['h2-large'],
      'h2': ['h2'],
      'h2-small': ['h2-small'],
      'h3': ['h3'],
      'h4': ['h4'],
      'h5': ['h5'],
      'h6-large': ['h6-large'],
      'h6': ['h6'],
    },
    align: {
      center: {
        textAlign: 'center',
      },
    },
    accent: {
      true: {
        color: vars.color.foregroundAccent,
      },
    },
  },
});

export type HeadlineVariants = RecipeVariants<typeof headlineVariants>;
