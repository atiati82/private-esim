import { vi } from 'vitest';

// For now, there seem to be a bug in 'server-only' package.
// Even when in node environment, 'use server' on top of the file would always throw an error.
vi.mock('server-only', () => {
  return {};
});

// 1x1 png image
const base64Image =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wAAAggBAwL9gIEAAAAASUVORK5CYII=';
export const mockImageData: Buffer = Buffer.from(base64Image, 'base64');
