import { clsx, type ClassValue } from 'clsx';
import kebabCase from 'lodash/kebabCase';

/**
 * Matcher for date/time strings, like 2024-10-31T16:22:09.503Z
 */
export const DateTimeRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export function isTruthy(val: unknown): boolean {
  if (val) {
    if (typeof val === 'string' && _falsyStrings.includes(val)) {
      return false;
    }
    return true;
  }
  return false;
}
const _falsyStrings = ['0', 'null', 'NULL', 'false', 'FALSE'];

export function cn(...classes: ClassValue[]): string {
  return clsx(classes);
}

export function debugVariantInfo(
  variants: Record<string, string | number | boolean | null | undefined>,
): {
  'debug-variant'?: string;
} {
  const debugInfo: string[] = Object.entries(variants).reduce((acc: string[], [k, v]): string[] => {
    return isTruthy(v) ? [...acc, `${k}:${v}`] : acc;
  }, []);

  return debugInfo.length ? { 'debug-variant': debugInfo.join(',') } : {};
}

/**
 * Generate URL slug from given string
 */
export function slug(input?: string | null): string {
  return kebabCase(input ?? '');
}

/**
 * From nested object or array of objects, get an item by a value of one of its keys
 *
 * @example
 * ```
 * const arr = [ { key: 'a', val: 1 }, { key: 'b', val: 2 } ];
 * getItemByKeyVal(arr, 'val', 2);
 * // result: `{ key: 'b', val: 2 }`
 * ```
 */
export function getItemByKeyVal<T extends { [key: string]: unknown }>(
  items: T[] | { [key: string]: T } | undefined | null,
  key: keyof T,
  value: unknown,
): T | undefined {
  return items ? Object.values(items).find((item) => item[key] === value) : undefined;
}

/**
 * Interpolate text with placeholders
 *
 * ```ts
 * interpolate(`Hello {name}!`, { name: 'Marcin' });
 * // Hello Marcin!
 * ```
 */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (match, key: string): string => {
    return typeof vars[key] !== 'undefined' ? `${vars[key]}` : match;
  });
}

export function pluralize(count: number, word: string, wordPlural?: string): string {
  const word2 = wordPlural ?? `${word}s`;
  return count === 1 ? word : word2;
}
/**
 * Generates an array of page numbers for pagination, including ellipses if needed.
 *
 * ```ts
 * Example when currentPage is 5, totalPages is 20, and pageRange is 5:
 * generatePageNumbers(5, 20, 5);
 * // result: [1, '...', 3, 4, 5, 6, 7, '...', 20]
 *
 * Example when currentPage is 1, totalPages is 3, and pageRange is 5:
 * generatePageNumbers(1, 3, 5);
 * // result: [1, 2, 3]
 * ```
 */
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  pageRange: number,
): (number | string)[] => {
  const pages: (number | string)[] = [];

  const shouldShowEllipsis = (current: number, total: number): boolean => {
    return total > pageRange + 2 && (current > pageRange || current < total - pageRange + 1);
  };

  if (totalPages <= pageRange) {
    // Show all pages if total pages are fewer than or equal to the range
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const start = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const end = Math.min(totalPages, currentPage + Math.floor(pageRange / 2));

    if (currentPage > pageRange - 1) {
      pages.push(1); // Always show the first page
      if (shouldShowEllipsis(1, totalPages)) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - (pageRange - 1)) {
      if (shouldShowEllipsis(end, totalPages)) {
        pages.push('...');
      }
      pages.push(totalPages); // Always show the last page
    }
  }

  return pages;
};

/**
 * randomizes the order of elements in the array. The original array is modified and returned (Fisher-Yates).
 *
 * @example
 * ```ts
 * // Example with an array of posts
 * const posts = [
 *   { id: 1, title: 'First Post' },
 *   { id: 2, title: 'Second Post' },
 *   { id: 3, title: 'Third Post' }
 * ];
 *
 * const shuffledPosts = shuffleArray(posts);
 * // shuffledPosts might be: [ { id: 2, title: 'Second Post' }, { id: 1, title: 'First Post' }, { id: 3, title: 'Third Post' } ]
 *```
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  let currentIndex = array.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

/**
 * Read content of the Stream to string
 */
export async function streamToString(stream: ReadableStream | null | undefined): Promise<string> {
  if (!stream) {
    return '';
  }

  let result = '';
  const reader = stream.getReader();
  const textDecoder = new TextDecoder();

  async function read(): Promise<string> {
    const { done, value } = await reader.read();
    if (done) {
      return result;
    }
    result += textDecoder.decode(value, { stream: true });
    return read();
  }
  return read();
}

export function stringToStream(str: string): ReadableStream {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);

  return new ReadableStream({
    start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    },
  });
}

/**
 * Safe `JSON.parse()` which returns error instead of throwing it
 */
export function safeJsonParse<T extends object>(
  data: string | null | undefined,
): [T | undefined, SyntaxError?] {
  let res: T | undefined = undefined;
  try {
    res = data ? JSON.parse(data) : undefined;
  } catch (err) {
    return [res, err as SyntaxError];
  }
  return [res];
}
