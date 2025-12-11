import { describe, expect, test } from 'vitest';

import {
  paramsToUrlSearchParams,
  urlForAccount,
  urlForProduct,
  urlForProductsList,
} from '@/lib/urls';

describe('urls', () => {
  test('urlForProductsList()', () => {
    expect(urlForProductsList('europe')).toBe('/regional-esim/europe');
    expect(urlForProductsList('poland')).toBe('/esim/poland');
    expect(urlForProductsList(undefined)).toBe('/global-esim');
  });
  test('urlForProductsList()', () => {
    expect(urlForProduct('europe', 'xxxx')).toBe('/regional-esim/europe/xxxx');
    expect(urlForProduct('poland', 'yyyy')).toBe('/esim/poland/yyyy');
    expect(urlForProduct(undefined, 'zzzz')).toBe('/global-esim/zzzz');
  });

  describe('urlForAccount()', () => {
    test('should return an absolute url', () => {
      expect(urlForAccount()).toMatch(/http.+\/account/);
    });
    test('should return url for subsection', () => {
      expect(urlForAccount('login')).toContain('/account/login');
    });
    test('should incl. search params', () => {
      expect(urlForAccount('', { redirect: 'abc' })).toContain('/account?redirect=abc');
    });
  });

  describe('paramsToUrlSearchParams()', () => {
    test('should work', () => {
      expect(paramsToUrlSearchParams({ token: 'xyz' })).toBe('?token=xyz');
    });
    test('should work with nullish values', () => {
      expect(paramsToUrlSearchParams(null)).toBe('');
    });
  });
});
