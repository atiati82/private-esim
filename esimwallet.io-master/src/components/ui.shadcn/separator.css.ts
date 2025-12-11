import { createVar } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import { forCompLayer } from '@/styles/utils';

const separatorSpaceVar = createVar();

export const separatorVariants = recipe(
  {
    base: forCompLayer({
      flexShrink: 0,
      backgroundColor: vars.color.border,
    }),
    variants: {
      space: {
        s5: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.s5 } }),
        s4: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.s4 } }),
        s3: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.s3 } }),
        s2: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.s2 } }),
        s1: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.s1 } }),
        base: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.base } }),
        l1: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.l1 } }),
        l2: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.l2 } }),
        l3: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.l3 } }),
        l4: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.l4 } }),
        l5: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.l5 } }),
        l6: forCompLayer({ vars: { [separatorSpaceVar]: cssVal.space.l6 } }),
      },
      orientation: {
        horizontal: forCompLayer({
          height: '1px',
          width: '100%',
          marginTop: separatorSpaceVar,
          marginBottom: separatorSpaceVar,
        }),
        vertical: forCompLayer({
          width: '1px',
          height: '100%',
          marginLeft: separatorSpaceVar,
          marginRight: separatorSpaceVar,
        }),
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      space: 'base',
    },
  },
  'sep',
);

export type SeparatorVariants = RecipeVariants<typeof separatorVariants>;
