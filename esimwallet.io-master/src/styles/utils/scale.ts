import { rem } from '@/styles/utils';

const ratio = 1.61803398875;

/**
 * Modular/harmonic sizing scale, based on (golden) ratio above
 *
 * @see https://every-layout.dev/rudiments/modular-scale/
 */
const _modularScale = {
  // 1px, 0.09rem
  s5: 1 / ratio / ratio / ratio / ratio / ratio,
  // 2px, 0.146rem
  s4: 1 / ratio / ratio / ratio / ratio,
  // 4px 0.236rem
  s3: 1 / ratio / ratio / ratio,
  // 6px, 0.382rem
  s2: 1 / ratio / ratio,
  // 10px, 0.618rem
  s1: 1 / ratio,
  // 16px, 1rem
  base: 1,
  // 26px 1.618rem
  l1: ratio,
  // 42px, 2.618rem
  l2: ratio * ratio,
  // 68px, 4.236rem
  l3: ratio * ratio * ratio,
  // 110px 6.854rem
  l4: ratio * ratio * ratio * ratio,
  // 177px, 11.09rem
  l5: ratio * ratio * ratio * ratio * ratio,
  // 287px, 17.94rem
  l6: ratio * ratio * ratio * ratio * ratio * ratio,
} as const;

function modularScaleTo(
  base: number,
  formatFn: (val: number) => string,
  prefix = '',
): Record<keyof typeof _modularScale, string> {
  return Object.entries(_modularScale).reduce(
    (acc, [k, v]) => ({ ...acc, [`${prefix}${k}`]: formatFn(v * base) }),
    {} as Record<keyof typeof _modularScale, string>,
  );
}

export const modularRemScale = modularScaleTo(1, rem);
