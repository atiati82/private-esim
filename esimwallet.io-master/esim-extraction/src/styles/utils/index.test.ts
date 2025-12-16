import { describe, expect, test } from 'vitest';

import { hslVal } from '@/styles/utils';

describe('css utils', () => {
  test('hslVal()', () => {
    expect(hslVal('')).toBe('');
    expect(hslVal('240, 20%, 98%')).toBe('240, 20%, 98%');
    expect(hslVal('hsl(240, 20%, 98%)')).toBe('240, 20%, 98%');
    expect(hslVal('hsla(240, 20%, 98%, 0.5)')).toBe('240, 20%, 98%');
  });
});
