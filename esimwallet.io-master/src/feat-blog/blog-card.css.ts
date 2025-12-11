import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { cssVal } from '@/styles/css-values';
import { flexContainer, flexContainerC } from '@/styles/layout.css';
import { vars } from '@/styles/theme.css';

export const blogCard = recipe({
  base: {
    padding: 0,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: cssVal.radii.medium,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    selectors: {
      '&:hover': {
        borderColor: 'rgba(37, 99, 235, 0.4)',
        boxShadow: '0 0 30px rgba(37, 99, 235, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  variants: {
    variant: {
      gallery: {
        aspectRatio: '6/7',
      },
      regular: {},
    },
  },
  defaultVariants: {
    variant: 'gallery',
  },
});

export const blogCardContent = recipe({
  base: {
    position: 'relative',
    height: '100%',
    width: '100%',
    marginTop: 0,
  },
  variants: {
    variant: {
      gallery: {},
      regular: {
        aspectRatio: '1/1',
      },
    },
  },
});
export const blogCardImage = recipe({
  base: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    background: `${vars.color.black}`,
    backgroundSize: 'auto',
  },
  variants: {
    variant: {
      gallery: {},
      regular: {
        position: 'relative',
        borderRadius: cssVal.radii.medium,
      },
    },
  },
});

export const blogCardInfo = recipe({
  base: flexContainer,
  variants: {
    variant: {
      gallery: {
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        left: 0,
        height: '50%',
        color: 'rgba(255, 255, 255, 0.95)',
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(10, 10, 10, 0.95))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        width: '100%',
        padding: cssVal.space.base,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: cssVal.space.s1,
      },
      regular: {
        color: 'rgba(37, 99, 235, 1)',
        width: '100%',
        padding: `${cssVal.space.base} 0`,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: cssVal.space.s1,
        position: 'relative',
      },
    },
  },
});

export const blogCardTitle = style([
  flexContainerC,
  {
    fontSize: cssVal.fontSize.md,
    fontWeight: cssVal.fontWeight.normal,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textWrap: 'pretty',
  },
]);

export const blogCardSeeMore = style([
  flexContainerC,
  {
    gap: cssVal.space.base,
  },
]);
