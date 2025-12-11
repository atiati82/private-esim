import { globalStyle, GlobalStyleRule, StyleRule } from '@vanilla-extract/css';

import { layers } from '@/styles/utils/layers';

export function globalStyleBaseLayer(selector: string, rules: GlobalStyleRule): void {
  globalStyle(selector, { '@layer': { [layers.base]: rules } });
}
export function globalStyleThemeLayer(selector: string, rules: GlobalStyleRule): void {
  globalStyle(selector, { '@layer': { [layers.theme]: rules } });
}
export function globalStyleCompLayer(selector: string, rules: GlobalStyleRule): void {
  globalStyle(selector, { '@layer': { [layers.comp]: rules } });
}
export function globalStyleUtilsLayer(selector: string, rules: GlobalStyleRule): void {
  globalStyle(selector, { '@layer': { [layers.utils]: rules } });
}

export const forBaseLayer = (rules: StyleRule): StyleRule => ({
  '@layer': { [layers.base]: rules },
});
export const forThemeLayer = (rules: StyleRule): StyleRule => ({
  '@layer': { [layers.theme]: rules },
});
export const forCompLayer = (rules: StyleRule): StyleRule => ({
  '@layer': { [layers.comp]: rules },
});
export const forUtilsLayer = (rules: StyleRule): StyleRule => ({
  '@layer': { [layers.utils]: rules },
});

/**
 * Format value to be CSS `rem` value
 */
export function rem(val: number): string {
  return `${Math.round(val * 1000) / 1000}rem`;
}

/**
 * Format value to be CSS `px` value
 */
export function px(val: number): string {
  return val === 0 ? `0` : `${Math.round(val)}px`;
}

export function pxToRem(px: number | string, remBase = 16): string {
  return rem(parseInt(`${px}`) / remBase);
}

/**
 * Extract just hsl values from value wrapped in `hsl(x,y,z)` function
 */
export function hslVal(hslString: string): string {
  const parts = hslString.match(_hslStrRe);
  if (parts) {
    return `${parts[1]}, ${parts[2]}, ${parts[3]}`;
  }
  return hslString;
}
const _hslStrRe = /hsla?\((\d+?),\s?(\d+?%),\s?(\d+%)/;
