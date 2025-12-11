import type { FullConfig } from '@playwright/test';

import { ensureCacheDir } from '@/payload/utils/cache';

async function globalSetup(_: FullConfig): Promise<void> {
  ensureCacheDir();
}

export default globalSetup;
