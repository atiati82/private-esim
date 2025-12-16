import { createThemeContract } from '@vanilla-extract/css';

import { hslVal } from '@/styles/utils';
import {
  primary,
  quantumBlue,
  quantumNeutral,
  quantumSlate,
  secondary,
  successPalette,
  tertiary,
} from '@/styles/utils/colors';

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

/**
 * Quantum Dark Theme base colors
 */
const quantumBaseColors = {
  white: 'hsl(0, 0%, 100%)',
  /**
   * Quantum dark background - neutral-950
   */
  background: quantumNeutral[950],

  black: quantumNeutral[950],
  /**
   * Quantum text - white
   */
  foreground: 'hsl(0, 0%, 100%)',
  foregroundHsl: '0, 0%, 100%',
  foregroundAccent: quantumBlue[400],

  border: 'hsla(0, 0%, 100%, 0.1)', // white/10
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
 * Quantum Dark Theme Tokens
 * Based on the Quantum Animation Builder design system
 */
export const quantumDarkThemeTokens = {
  color: {
    ...quantumBaseColors,

    primary: {
      /**
       * Primary: Quantum blue-600 accent
       */
      default: quantumBlue['600'], // #2563eb
      darker: quantumBlue['700'],
      lighter: quantumBlue['500'], // #3b82f6
      foreground: 'hsl(0, 0%, 100%)', // white text on blue
    },

    secondary: {
      /**
       * Secondary: subtle white/5 background
       */
      default: 'hsla(0, 0%, 100%, 0.05)', // white/5
      darker: 'hsla(0, 0%, 100%, 0.1)', // white/10
      foreground: 'hsl(0, 0%, 100%)',
    },

    muted: {
      /**
       * Muted backgrounds and text for dark theme
       */
      default: quantumNeutral['900'],
      foreground: quantumSlate['300'], // #cbd5e1
      lighter: quantumSlate['400'], // #94a3b8
    },

    accent: {
      /**
       * Accent colors - blue tints
       */
      default: 'hsla(221, 83%, 53%, 0.15)', // blue-600/15
      lighter: 'hsla(221, 83%, 53%, 0.1)', // blue-600/10
      foreground: quantumBlue['400'],
    },

    destructive: {
      default: 'hsl(0, 84%, 60%)', // red-500
      darker: 'hsl(0, 72%, 51%)', // red-600
      lighter: 'hsl(0, 91%, 71%)', // red-400
      foreground: 'hsl(0, 0%, 100%)',
    },

    warning: {
      default: 'hsl(45, 93%, 47%)', // amber-500
      foreground: 'hsl(38, 92%, 50%)', // amber-500
    },

    success: {
      default: 'hsla(142, 76%, 36%, 0.2)', // green-600/20
      foreground: 'hsl(142, 71%, 45%)', // green-500
    },
  },

  shadow: {
    /**
     * Quantum shadow - more dramatic for dark theme
     */
    card: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    compact: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
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
