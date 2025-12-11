import { assignVars, globalLayer, globalStyle, fontFace } from '@vanilla-extract/css';

import { quantumDarkThemeTokens, vars } from '@/styles/theme.css';
import { globalStyleThemeLayer } from '@/styles/utils';
import { layers } from '@/styles/utils/layers';

globalLayer(layers.base);
globalLayer(layers.theme);
globalLayer(layers.comp);
globalLayer(layers.utils);

// Define Geist font faces with shared family name using fontFace array syntax
const geistFontFamily = fontFace([
  {
    src: "url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.woff2') format('woff2')",
    fontWeight: '400',
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    src: "url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Medium.woff2') format('woff2')",
    fontWeight: '500',
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    src: "url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-SemiBold.woff2') format('woff2')",
    fontWeight: '600',
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    src: "url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.woff2') format('woff2')",
    fontWeight: '700',
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
]);

// Apply Quantum Dark Theme
globalStyleThemeLayer(':root', {
  vars: assignVars(vars, quantumDarkThemeTokens),
});

// Quantum base body styles
globalStyle('body', {
  backgroundColor: 'hsl(0, 0%, 4%)', // neutral-950
  color: 'hsl(0, 0%, 100%)',
  fontFamily: `${geistFontFamily}, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});
