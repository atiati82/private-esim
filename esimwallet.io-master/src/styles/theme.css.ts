import { createThemeContract } from '@vanilla-extract/css';

import { hslVal } from '@/styles/utils';
import { primary, secondary, successPalette, tertiary } from '@/styles/utils/colors';

const baseColors = {
  white: 'hsl(0, 0%, 100%)',
  /**
   * Default background
   */
  background: 'hsl(0, 0%, 100%)',

  black: secondary[950],
  /**
   * Default text a.k.a. foreground
   */
  foreground: secondary[950],
  foregroundHsl: hslVal(secondary[950]),
  foregroundAccent: primary[900],

  border: secondary[150],
};

export const lightThemeTokens = {
  color: {
    ...baseColors,

    primary: {
      /**
       * Primary: default brand color, blue
       */
      default: primary['600'], // ✅ Brand color, link color
      darker: primary['800'], // ✅ :hover for text-primary... 🤔 could be a 700 variant?
      lighter: primary['500'],
      foreground: primary['50'], // ✅ Text on primary color
    },

    secondary: {
      /**
       * Secondary: gray/slate color
       * To be used in buttons, tabs etc
       */
      default: secondary['100'], // ✅
      darker: secondary['150'], // ✅
      foreground: baseColors.foreground, // ✅
    },

    muted: {
      /**
       * Muted color, to be used in light backgrounds
       */
      default: secondary['50'], // 🤔👈 untested, not used? Could be used as a default muted background?
      /**
       * Muted text color
       */
      foreground: secondary['800'], // 🤔
      lighter: secondary['700'],
    },

    /**
     * Note: these should be perhaps variants of our `primary` color
     */
    accent: {
      /**
       * Light blue`ish used e.g. for input border
       */
      default: primary['100'],
      /**
       * Light blue`ish used e.g. for icon background, input border)
       */
      lighter: primary['50'],
      foreground: baseColors.foregroundAccent, // 🤔 unused/untested
    },
    destructive: {
      /**
       * Tertiary, destructive (red) color
       */
      default: tertiary['500'], // ✅
      darker: tertiary['600'], // ✅  untested
      lighter: tertiary['400'], // ✅ untested
      foreground: baseColors.white, // ✅
    },
    warning: {
      default: tertiary['300'], // ✅🤔
      foreground: tertiary['400'], // ✅🤔
    },
    success: {
      default: successPalette['100'], // 🤔 unused/untested
      foreground: successPalette['600'], // 🤔 unused/untested
    },
  },

  shadow: {
    /**
     * Wide-spread gentle shadow.
     * Used e.g. for product card
     */
    card: `2px 2px 26px 1px hsla(${hslVal(baseColors.black)}, .1)`,

    /**
     * Compact / small shadow. Used e.g. in popover content
     */
    compact: `1px 1px 10px 1px hsla(${hslVal(baseColors.black)}, .15)`,
  },
} as const;

/**
 * Main obj with all theme vars.
 * To be referenced from other .css files when doing theming
 *
 * TODO: rename this file to without .css suffix
 *  - it should NOT yield any CSS, just vars to be imported/used elsewhere
 */
export const vars = createThemeContract(lightThemeTokens);
