/**
 * Satoshi font definition.
 *
 * I couldn't make the import from {@link satoshiFont}
 * using `next/font/local` work, so I'm re-creating it here.
 *
 * Requires below `staticDirs` in the main config:
 * ```
 * staticDirs: [
 *     ...
 *     {
 *       from: '../src/app/styles/font-satoshi',
 *       to: 'styles/font-satoshi',
 *     },
 *   ],
 * ```
 */
export const satoshiFontStyles: string = `
  @font-face {
    font-family: 'Satoshi';
    src: url(/styles/font-satoshi/Satoshi.woff2) format('woff2');
    font-display: swap;
    font-style: normal;
  }
  @font-face {
    font-family: 'Satoshi';
    src: url(/styles/font-satoshi/Satoshi-Italic.woff2) format('woff2');
    font-display: swap;
    font-style: italic;
  }

  :root {
    --font-satoshi: Satoshi, system-ui, sans-serif;
  }
`;
