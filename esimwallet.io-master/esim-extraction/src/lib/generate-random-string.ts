import { randomBytes } from 'crypto';

/**
 * Generate random string, using *crypto* system library
 */
export function generateRandomString(length: number): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

/**
 * Current date string, in the format YMMDD (one digit for year, 2 for MM, 2 for DD)
 */
export function currentDateStrForUid(): string {
  const now = new Date();
  const lastYearDigit = now.getFullYear().toString().slice(-1);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${lastYearDigit}${month}${day}`;
}
