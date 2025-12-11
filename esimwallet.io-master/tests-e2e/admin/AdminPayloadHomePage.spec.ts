import { test } from '@playwright/test';

import { BasePayloadPage } from './PayloadBasePage';

test.describe('Payload Admin: smoke test', () => {
  let po: BasePayloadPage;
  test.beforeEach(async ({ page }) => {
    po = new BasePayloadPage(page);
  });

  test('should load Payload Dashboard', async () => {
    await po.loginAndGoToAdminPage();
  });
});
