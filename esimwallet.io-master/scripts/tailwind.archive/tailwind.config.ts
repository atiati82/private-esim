import type { Config } from 'tailwindcss';

import { primary, secondary, successPalette, tertiaryWarningPalette } from '@/styles/utils/colors';

/**
 * Overrides for default Tailwind CSS settings
 * @see https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
 */
const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,css}'],
  experimental: {
    /**
     * Disable the `*` selector with all css --vars in it...
     * Tailwind would like to do that by default, but have issues with some frameworks
     * and backward compatibility. But for new projects this might be a better setup.
     * Note: there's still a `*` selector with a few vars in it... but at least it's less.
     */
    optimizeUniversalDefaults: true,
  },
  prefix: '',
  theme: {
    fontFamily: {
      sans: ['var(--font-satoshi)'],
      serif: ['ui-serif', 'Cambria', '"Times New Roman"', 'serif'],
      mono: ['ui-monospace', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      semibold: '500',
      bold: '700',
    },
    // Tailwind defaults:
    // screens: {
    //   sm: '640px',
    //   md: '768px',
    //   lg: '1024px',
    //   xl: '1280px',
    //   '2xl': '1536px',
    // },
    // Override with Radix-like screen sizes (which seems to be a bit better than Tailwind defaults)
    screens: {
      // => @media (min-width: SIZEpx) { ... }
      // 0 min-width: Phones (very small)
      'xs': '360px', // Phones (portrait) - e.g. iPhone
      'sm': '520px', // Phones (landscape)
      'md': '768px', // Tablets (portrait)
      'lg': '1024px', // Tablets (landscape)
      'xl': '1200px', // Laptops
      '2xl': '1400px', // Desktops
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        'xl': '1170px',
        '2xl': '1370px',
      },
    },
    borderRadius: {
      'none': '0px',
      'sm': '0.125rem',
      'DEFAULT': '8px', // ✅ 🤔 unsure, needs more testing
      'md': '0.375rem',
      'lg': '0.5rem',
      'xl': '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      'full': '9999px',
    },
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      white: colors.white,
      black: secondary[950],

      slate: secondary,
      // gray: secondary,
      red: tertiaryWarningPalette,
      green: successPalette,
      blue: primary,

      primary: primary,
      secondary: secondary,
      tertiary: tertiaryWarningPalette,
    }),

    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--primary-500)', // ✅
        background: 'var(--white)', // ✅ Default background
        foreground: 'var(--black)', // ✅ Default Text
        primary: {
          DEFAULT: 'var(--primary-600)', // ✅ Brand color, link color
          darker: 'var(--primary-800)', // ✅ :hover for text-primary... 🤔 could be a 700 variant?
          dark: 'var(--primary-950)', // ✅ Dark blue, black-ish text
          foreground: 'var(--primary-50)', // ✅
        },
        secondary: {
          DEFAULT: 'var(--secondary-100)', // ✅
          darker: 'var(--secondary-150)', // ✅
          foreground: 'var(--foreground)', // ✅
        },
        destructive: {
          DEFAULT: 'var(--tertiary-600)', // ✅
          foreground: 'var(--tertiary-50)', // ✅
        },
        warning: {
          DEFAULT: 'var(--tertiary-300)', // ✅🤔
          foreground: 'var(--tertiary-950)', // ✅🤔
        },
        muted: {
          DEFAULT: 'var(--secondary)', // 👈 untested, not used? Could be used as a default muted background?
          foreground: 'var(--secondary-700)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--background)', // ✅🤔 could be a different shade of white?
          foreground: 'var(--foreground)', // ✅
        },
        card: {
          DEFAULT: 'var(--background)', // ✅
          foreground: 'var(--foreground)', // ✅
        },
      },
      // borderRadius: {
      //   lg: 'var(--radius)', // 👈
      //   md: 'calc(var(--radius) - 2px)', // 👈
      //   sm: 'calc(var(--radius) - 4px)', // 👈
      // },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-debug-screens')],
} satisfies Config;
