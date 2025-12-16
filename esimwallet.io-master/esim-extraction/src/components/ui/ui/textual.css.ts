import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { vars } from '@/styles/theme.css';
import { textAlignCenter, textLg, textMuted, textSm } from '@/styles/typography.css';

export const textualVariants = recipe({
  variants: {
    as: {
      p: {},
      li: {},
      div: {},
      // pre: 'rounded-sm bg-muted font-mono',
      // blockquote: 'border-l-2 pl-5 italic',
    },
    size: {
      sm: [textSm],
      lg: [textLg, textMuted],
    },
    variant: {
      lead: [
        textLg,
        {
          color: vars.color.muted.lighter,
        },
      ],
      footer: [textSm, textMuted],
      muted: [textMuted],
    },
    align: {
      center: [textAlignCenter],
    },
  },
  defaultVariants: {
    as: 'p',
  },
});

export type TextualVariants = RecipeVariants<typeof textualVariants>;
