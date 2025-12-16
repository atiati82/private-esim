import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';

export const root = style({
  position: 'relative',
  overflow: 'hidden',
});

export const viewport = style({
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
});

export const scrollbar = recipe({
  base: {
    display: 'flex',
    touchAction: 'none',
    userSelect: 'none',
  },
  variants: {
    orientation: {
      // h-full w-2.5 border-l border-l-transparent p-[1px]
      vertical: {
        height: '100%',
        width: cssVal.space.s1,
        padding: 1,
        borderLeftWidth: 1,
      },
      // h-2.5 flex-col border-t border-t-transparent p-[1px]
      horizontal: {
        width: '100%',
        height: cssVal.space.s1,
        padding: 1,
        flexDirection: 'column',
        borderTopWidth: 1,
      },
    },
  },
});

// "relative flex-1 rounded-full bg-border"
export const scrollAreaThumb = style({
  position: 'relative',
  flex: '1 1 0%',
  borderRadius: 9999,
  backgroundColor: vars.color.border,
});
