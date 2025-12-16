import { describe, expect, test } from 'vitest';

import {
  cn,
  debugVariantInfo,
  getItemByKeyVal,
  interpolate,
  isTruthy,
  safeJsonParse,
  streamToString,
  stringToStream,
} from './utils';

describe('Utils', function () {
  test('isTruthy()', () => {
    expect(isTruthy(true)).toBe(true);
    expect(isTruthy('1')).toBe(true);
    expect(isTruthy([1])).toBe(true);
    expect(isTruthy(0)).toBe(false);
    expect(isTruthy(NaN)).toBe(false);
    expect(isTruthy(false)).toBe(false);
    expect(isTruthy(null)).toBe(false);
    expect(isTruthy(undefined)).toBe(false);
    expect(isTruthy('')).toBe(false);
    expect(isTruthy('0')).toBe(false);
    expect(isTruthy('false')).toBe(false);
    expect(isTruthy('FALSE')).toBe(false);
    expect(isTruthy('null')).toBe(false);
    expect(isTruthy('NULL')).toBe(false);
  });

  test('cn(): should merge classes', () => {
    expect(cn('a', null, 0, ['b', 'c'])).toBe('a b c');
  });

  test('debugElementVariant()', () => {
    expect(debugVariantInfo({ as: 'h1' })).toEqual({ 'debug-variant': 'as:h1' });
    expect(debugVariantInfo({ as: 'h1', variant: 0 })).toEqual({ 'debug-variant': 'as:h1' });
    expect(debugVariantInfo({ as: 'h1', variant: null })).toEqual({ 'debug-variant': 'as:h1' });
    expect(debugVariantInfo({ as: 'h1', variant: 'lead' })).toEqual({
      'debug-variant': 'as:h1,variant:lead',
    });
    expect(debugVariantInfo({})).toEqual({});
    expect(debugVariantInfo({ foo: '' })).toEqual({});
    expect(debugVariantInfo({ bar: 'null' })).toEqual({});
  });

  test('getValueByKey()', () => {
    const mockArr = [
      { key: 'a', val: 1 },
      { key: 'b', val: 2 },
    ];
    const mockObj = {
      item1: { key: 'a', val: 1 },
      item2: { key: 'b', val: 2 },
    };
    expect(getItemByKeyVal(mockArr, 'key', 'b')).toEqual({ key: 'b', val: 2 });
    expect(getItemByKeyVal(mockArr, 'val', 1)).toEqual({ key: 'a', val: 1 });
    expect(getItemByKeyVal(mockObj, 'val', 2)).toEqual({ key: 'b', val: 2 });
  });

  test('interpolate()', () => {
    expect(interpolate(`Hello {name}!`, { name: 'Marcin' })).toBe('Hello Marcin!');
    expect(interpolate(`Hello {FIRST_NAME}!`, { FIRST_NAME: 'Marcin' })).toBe('Hello Marcin!');
    expect(interpolate(`Hello {FIRST_NAME} {SECOND_NAME}!`, { FIRST_NAME: 'Marcin' })).toBe(
      'Hello Marcin {SECOND_NAME}!',
    );
    expect(
      interpolate(`Hello {FIRST_NAME} {SECOND_NAME}!`, {
        FIRST_NAME: 'Marcin',
        SECOND_NAME: 'R',
      }),
    ).toBe('Hello Marcin R!');
  });

  test('streams', async () => {
    const testStr = 'Testing Streams and back';
    const stream = stringToStream(testStr);
    const result = await streamToString(stream);
    expect(result).toEqual(testStr);
  });

  describe('safeJsonParse', () => {
    test('should parse data', () => {
      const data = { foo: 'bar' };
      const [res, err] = safeJsonParse(JSON.stringify(data));
      expect.soft(res).toEqual(data);
      expect.soft(err).toBe(undefined);
    });
    test('should handle error for mis-formatted JSON', () => {
      const data = { foo: 'bar' };
      const [res, err] = safeJsonParse(JSON.stringify(data).substring(3));
      expect.soft(res).toBe(undefined);
      expect.soft(err).toBeInstanceOf(SyntaxError);
    });
    test('should simply return undefined for null/undefined values', () => {
      const [res, err] = safeJsonParse(null);
      expect.soft(res).toBe(undefined);
      expect.soft(err).toBe(undefined);
    });
  });
});
