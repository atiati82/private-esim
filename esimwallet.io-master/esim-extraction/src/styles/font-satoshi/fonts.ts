import localFont from 'next/font/local';

export const fontSatoshi = localFont({
  src: [
    {
      path: './Satoshi.woff2',
      style: 'normal',
    },
    {
      path: './Satoshi-Italic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  adjustFontFallback: false,
  fallback: ['system-ui', 'sans-serif'],
  display: 'swap',
});
