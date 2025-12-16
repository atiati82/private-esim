import { describe, expect, test } from 'vitest';

import { extractUrlLinks } from '@/lib/html-helpers';

describe('html-helpers', () => {
  describe('extractUrlLinks()', () => {
    test('should extract www link', () => {
      const html = 'some html with https://google.com/link bla bla';
      const res = extractUrlLinks(html);
      expect(res).toEqual(['https://google.com/link']);
    });
    test('should extract localhost link', () => {
      const html01 = 'some html with http://localhost:5690/link/abc bla bla';
      const html02 = 'some html with http://localhost/link/abc bla bla';
      const html03 = 'some html with http://localhost bla bla';
      const html04 =
        'verify your email: <a href="http://localhost:3000/account/create/verify?token=xyz">http://localhost:3000/account/create/verify?token=xyz</a>. After verifying your email...';
      expect(extractUrlLinks(html01)).toEqual(['http://localhost:5690/link/abc']);
      expect(extractUrlLinks(html02)).toEqual(['http://localhost/link/abc']);
      expect(extractUrlLinks(html03)).toEqual(['http://localhost']);
      expect(extractUrlLinks(html04)).toEqual([
        'http://localhost:3000/account/create/verify?token=xyz',
      ]);
    });
  });
});
