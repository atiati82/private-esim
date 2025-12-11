import fs from 'fs';
import path from 'path';

export const AppCacheDir = './.cache';

export function ensureCacheDir(filenamePath?: string): void {
  let cacheDir = filenamePath ?? AppCacheDir;
  // Ensure the cachePath is treated as a directory if it ends with a slash
  if (filenamePath && !filenamePath.endsWith(path.sep)) {
    cacheDir = path.dirname(filenamePath);
  }

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}
