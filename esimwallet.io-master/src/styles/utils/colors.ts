/**
 * Royal Blue color
 *
 * DEFAULT: 600, generated from `#3166e3`
 */
const primaryRoyalBluePalette = {
  '50': 'hsl(214, 88%, 96.6%)',
  '100': 'hsl(216, 89%, 93%)', // light blue bg (like: under the logo)
  '200': 'hsl(215, 88%, 87%)',
  '300': 'hsl(213, 87%, 78%)',
  '400': 'hsl(214, 85%, 68%)',
  '500': 'hsl(218, 83%, 60%)',
  '600': 'hsl(222, 76%, 54%)', // ✅ DEFAULT
  '700': 'hsl(225, 70%, 48%)',
  '800': 'hsl(227, 65%, 40%)',
  '900': 'hsl(226, 58%, 33%)',
  '950': 'hsl(228, 51%, 21%)', // dark blue text or icon fill
};
export { primaryRoyalBluePalette as primary };

/**
 * Modified Slate palette
 */
const secondarySlatePalette = {
  // '50': 'hsl(240, 20%, 98%)', // ✅ 🤔slightly gray page backgrounds
  '50': 'hsl(240, 22%, 97%)', // ✅ 🤔a bit stronger bg... the above is not visible during the day?
  '100': 'hsl(244, 22%, 95%)', // ✅ DEFAULT: secondary button
  '150': 'hsl(220, 17%, 93%)', // extra...
  '200': 'hsl(228, 15%, 87%)',
  '300': 'hsl(233, 16%, 78%)',
  '400': 'hsl(237, 14%, 68%)',
  '500': 'hsl(244, 14%, 60%)',
  '600': 'hsl(248, 13%, 53%)',
  '700': 'hsl(261, 10%, 40%)',
  '800': 'hsl(260, 9%, 33%)',
  '900': 'hsl(267, 8%, 21%)',
  '950': 'hsl(230, 9%, 13%)', // ✅ black text color
};
export { secondarySlatePalette as secondary };

export const tertiaryWarningPalette = {
  '50': 'hsl(53, 80%, 98%)',
  '100': 'hsl(40, 92%, 95%)',
  '200': 'hsl(31, 96%, 90%)',
  '300': 'hsl(20, 93%, 83%)',
  '400': 'hsl(41,100%,44%)',
  '500': 'hsl(0, 84%, 59%)',
  '600': 'hsl(350, 71%, 50%)',
  '700': 'hsl(340, 74%, 41%)',
  '800': 'hsl(330, 70%, 34%)',
  '900': 'hsl(320, 63%, 30%)',
  '950': 'hsl(309, 75%, 14%)',
};
export { tertiaryWarningPalette as tertiary };

/**
 * Château Green color
 */
export const successPalette = {
  '50': 'hsl(138, 76%, 97%)',
  '100': 'hsl(142, 84%, 93%)',
  '200': 'hsl(143, 82%, 85%)',
  '300': 'hsl(144, 78%, 73%)',
  '400': 'hsl(144, 71%, 58%)',
  '500': 'hsl(144, 72%, 45%)',
  '600': 'hsl(144, 78%, 39%)',
  '700': 'hsl(144, 73%, 29%)',
  '800': 'hsl(145, 66%, 24%)',
  '900': 'hsl(146, 63%, 20%)',
  '950': 'hsl(146, 80%, 10%)',
};

/**
 * Convert #hex to hsl() color
 *
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  // Convert to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
} /**/

// const hslPalette: Record<string, string> = {};
// for (const [shade, hex] of Object.entries(primaryRoyalBluePalette)) {
//   const { h, s, l } = hexToHSL(hex);
//   hslPalette[shade] = `hsl(${h}, ${s}%, ${l}%)`;
// }
// console.log(hexToHSL('#3166E3'));
// console.log(hslPalette);
