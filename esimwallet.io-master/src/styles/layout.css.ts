import { createVar, style } from '@vanilla-extract/css';

import { cssVal } from '@/styles/css-values';
import { vars } from '@/styles/theme.css';
import {
  forCompLayer,
  forThemeLayer,
  forUtilsLayer,
  globalStyleCompLayer,
  globalStyleUtilsLayer,
} from '@/styles/utils';

export const pageContainer = style(
  forCompLayer({
    'width': '100%',
    'maxWidth': '82rem', // ~1300px
    'marginLeft': 'auto',
    'marginRight': 'auto',
    'paddingLeft': cssVal.space.base,
    'paddingRight': cssVal.space.base,
    '@media': {
      [cssVal.screen.md]: {
        paddingLeft: cssVal.space.l1,
        paddingRight: cssVal.space.l1,
      },
      [cssVal.screen.lg]: {
        paddingLeft: cssVal.space.l2,
        paddingRight: cssVal.space.l2,
      },
    },
  }),
);

export const pageContainerWidthVar = createVar();
/**
 * Use instead of wide {@link pageContainer} for narrow, mobile-like centered page container
 */
export const narrowPageContainer = style(
  forCompLayer({
    'vars': {
      [pageContainerWidthVar]: '32rem',
    },
    'width': pageContainerWidthVar,
    'marginLeft': 'auto',
    'marginRight': 'auto',
    // 🤔not sure about that, if we want such a padding everywhere
    //   For now it works on e.g. account pages
    'marginTop': cssVal.space.base,
    'paddingLeft': cssVal.space.base,
    'paddingRight': cssVal.space.base,
    '@media': {
      [cssVal.screen.smAndSmaller]: {
        width: '100%',
      },
    },
  }),
);

export const containerWithBorder = style(
  forThemeLayer({
    borderWidth: 1,
    borderRadius: cssVal.radii.medium,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  }),
);

export const flexContainer = style(
  forUtilsLayer({
    display: 'flex',
  }),
);
export const flexContainerJbC = style(
  forUtilsLayer({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
);

export const flexContainerC = style(
  forUtilsLayer({
    display: 'flex',
    alignItems: 'center',
  }),
);
export const flexContainerCC = style(
  forUtilsLayer({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
);

/**
 * Inline-flex container, where everything is centered, on X and Y axis
 */
export const inlineFlexCC = style(
  forUtilsLayer({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
);

export const fullWidth = style(forUtilsLayer({ width: '100%' }));

export const screenReaderOnly = style(
  forUtilsLayer({
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    borderWidth: 0,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
  }),
);

/**
 * Hide element on XS screen (and smaller) - e.g. iPhone portrait
 */
export const hideOnXsAndSmaller = style(
  forUtilsLayer({
    '@media': {
      [cssVal.screen.xsAndSmaller]: { display: 'none' },
    },
  }),
);

/**
 * Control the space between child elements
 * Similar to TailwindCSS `space-x-...` and `space-y-...` classes
 */
export const spaceBetween = {
  x: {
    s4: style(forUtilsLayer({})),
    s3: style(forUtilsLayer({})),
    s2: style(forUtilsLayer({})),
    s1: style(forUtilsLayer({})),
    base: style(forUtilsLayer({})),
    l1: style(forUtilsLayer({})),
    l2: style(forUtilsLayer({})),
    l3: style(forUtilsLayer({})),
  },
  y: {
    s4: style(forUtilsLayer({})),
    s3: style(forUtilsLayer({})),
    s2: style(forUtilsLayer({})),
    s1: style(forUtilsLayer({})),
    base: style(forUtilsLayer({})),
    l1: style(forUtilsLayer({})),
    l2: style(forUtilsLayer({})),
    l3: style(forUtilsLayer({})),
  },
};
Object.entries(spaceBetween).forEach(([xy, items]) => {
  (Object.entries(items) as Array<[keyof typeof cssVal.space, string]>).forEach(
    ([spaceKey, cssClass]) => {
      const prop = xy === 'x' ? 'marginLeft' : 'marginTop';
      globalStyleUtilsLayer(`${cssClass} > :not([hidden]) ~ :not([hidden])`, {
        [prop]: cssVal.space[spaceKey],
      });
    },
  );
});

export const grid123Cols = style(
  forCompLayer({
    'display': 'grid',
    'gap': cssVal.space.l1,
    'gridTemplateColumns': 'repeat(1, minmax(0, 1fr))',
    '@media': {
      [cssVal.screen.xsAndSmaller]: {
        gap: cssVal.space.base,
      },
      [cssVal.screen.sm]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      [cssVal.screen.lg]: {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: cssVal.space.l2,
      },
    },
  }),
);
globalStyleCompLayer(`${grid123Cols} > *`, { width: 'auto' });

/**
 * Simple grid starting with 2 cols
 * then increasing to 3 and 4 on larger screens
 */
export const grid234Cols = style(
  forCompLayer({
    'display': 'grid',
    'gap': cssVal.space.base,
    'gridTemplateColumns': 'repeat(2, minmax(0, 1fr))',
    '@media': {
      [cssVal.screen.xsAndSmaller]: {
        gap: cssVal.space.s1,
      },
      [cssVal.screen.md]: {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      },
      [cssVal.screen.lg]: {
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      },
    },
  }),
);
globalStyleCompLayer(`${grid234Cols} > *`, { width: 'auto' });

export const gridNarrow12Cols = style(
  forCompLayer({
    'display': 'grid',
    'gap': cssVal.space.l1,
    'gridTemplateColumns': 'repeat(1, minmax(0, 1fr))',
    '@media': {
      [cssVal.screen.xsAndSmaller]: {
        gap: cssVal.space.base,
      },
      [cssVal.screen.sm]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
    },
  }),
);
globalStyleCompLayer(`${gridNarrow12Cols} > *`, { width: 'auto' });
