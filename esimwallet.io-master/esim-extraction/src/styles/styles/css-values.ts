import { pxToRem } from '@/styles/utils';
import { modularRemScale } from '@/styles/utils/scale';

const breakpoints = {
  xs: 360, //
  sm: 520, //
  md: 768, //
  lg: 1024, //
  xl: 1200, //
  xxl: 1400, //
} as const;

export const cssVal = {
  screen: {
    /**
     * Phones (portrait) e.g. iPhone (AND larger screens)
     */
    xs: `screen and (min-width: ${breakpoints.xs}px)`,
    /**
     * Phones (portrait) e.g. iPhone (AND smaller screens)
     */
    xsAndSmaller: `screen and (max-width: ${breakpoints.sm - 1}px)`,
    /**
     * Phones (landscape) AND larger
     */
    sm: `screen and (min-width: ${breakpoints.sm}px)`,
    smAndSmaller: `screen and (max-width: ${breakpoints.md - 1}px)`,
    /**
     * Tablets (portrait) AND larger screens
     */
    md: `screen and (min-width: ${breakpoints.md}px)`,
    /**
     * Tablets (landscape) AND larger screens
     */
    lg: `screen and (min-width: ${breakpoints.lg}px)`,
    /**
     * Laptops AND larger screens
     */
    xl: `screen and (min-width: ${breakpoints.xl}px)`,
    /**
     * Desktops AND larger screens
     */
    xxl: `screen and (min-width: ${breakpoints.xxl}px)`,
  },

  font: {
    /**
     * The `--font-satoshi` variable comes from local font {@link fontSatoshi} setup,
     * which is attached in the main layout.tsx to the `<html>` tag.
     */
    base: 'var(--font-satoshi)',
    mono: `'Fira Code', 'Source Code Pro', Menlo, 'Courier New', Courier, monospace;`,
  },

  fontSize: {
    /** 10px = 0625rem */
    tiny: pxToRem(10),
    /** 12px = 0.75rem */
    xs: pxToRem(12),
    /** 14px = 0.875rem */
    sm: pxToRem(14),
    /** 16px = 1rem */
    base: pxToRem(16),
    /** 20px = 1.25rem */
    md: pxToRem(20),
    /** 24px = 1.5rem */
    lg: pxToRem(24),
    /** 32px = 2rem */
    xl: pxToRem(32),
    /** 40px = 2.5rem */
    xl2: pxToRem(40),
    /** 48px = 3rem */
    xl3: pxToRem(48),
    /** 64px = 4rem */
    xl4: pxToRem(64),
  },
  fontWeight: {
    light: '300',
    normal: '400',
    semibold: '500',
    bold: '700',
  },

  lineHeight: {
    default: 1.5,
    interactive: 1.1, // inputs, button
    // Experimental 🧐
    // On larger fonts, such line height might work better (always adding 0.5rem instead of multiplying by e.g. 1.1
    dynamic: 'calc(1em + 0.5rem)',
  },

  space: modularRemScale,

  radii: {
    small: 6,
    default: 8,
    medium: 10,
    large: 16,
  },

  opacity: {
    disabled: 0.618,
  },

  zIndex: {
    nav: 40, // main navigation
    popover: 50,
  },
} as const;
