import type { OptionObject } from 'payload';

/**
 * Check if passed value is object-like (excl. NULLs)
 */
export function isObject<T>(val: T | string | null | undefined): val is T {
  return val ? typeof val === 'object' : false;
}

/**
 * For a CMS collections, for relationship fields (which might a full related object or just its ID)
 * get the relationship id value.
 *
 * Useful when you have relationship data, and you don't want to always check
 * if it's an object inside or just its ID (string) value.
 *
 * @usage
 * const destination = { name: 'UK', region: 'europe' }
 * getRelationId(destination.region); // will return 'europe'
 *
 * const destination = { name: 'UK', region: { id: 'europe', name: 'Europe' } }
 * getRelationId(destination.region); // will return 'europe'
 */
export function getRelationIdVal<T extends object>(
  objOrValue: T | string | null | undefined,
): string | undefined {
  if (isObject(objOrValue)) {
    return objOrValue['id' as keyof T] as string;
  }
  return objOrValue ?? undefined;
}

/**
 * Experimental:
 *
 * To simplify code and accessing data on nested objects, we often assume that
 * the full data from relation field is present. But, depending on the `depth` value
 * or when reaching max depth, this is not the case (we get string value instead).
 * This is usually not a problem, probably no one digs into that data that deep,
 * but naturally it causes problems when assembling the objects (and we expect obj,
 * but string is received).
 *
 * In such case we create dummy/fake object, with ID field in it.
 */
export function makeMinimalRelationObj<T extends object>(
  objOrValue: T | string | null | undefined,
): T {
  if (isObject(objOrValue)) {
    return objOrValue;
  }
  return { id: objOrValue } as T;
}

/**
 * Gets option label (for display), based on current value
 */
export function getOptionLabel(options: OptionObject[], value: string): string {
  const item = options.find((ol) => ol.value === value);
  return item ? (item.label as string) : 'n/a';
}

/**
 * @deprecated TODO: move to `feat-blog`
 */
export function calculatePostMetrics({
  shares,
  views,
}: {
  shares?: number;
  views?: number;
}): number {
  const POINT_PER_VIEW = 0.1;
  const POINT_PER_SHARE = 0.5;

  const viewScore = views || 0 * POINT_PER_VIEW;
  const shareScore = shares || 0 * POINT_PER_SHARE;

  return viewScore + shareScore;
}
