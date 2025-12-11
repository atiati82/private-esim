import { expect, test } from '@playwright/test';

import { EsimProductsCollectionId } from '@/payload/collections';

import { BasePayloadPage } from './PayloadBasePage';

test.describe('eSIM Products', () => {
  let po: BasePayloadPage;
  test.beforeEach(async ({ page }) => {
    po = new BasePayloadPage(page);
  });

  test('should have products', async () => {
    await po.loginAndGoToCollectionPage(EsimProductsCollectionId);
    expect(await po.getCollectionItems().count()).toBeGreaterThanOrEqual(10);
  });

  test.skip('should have listed related/compatible products', async ({ page }) => {
    // Search for something which doesn't have too many relationships (otherwise it loads for ages and times out often)
    await po.loginAndGoToCollectionPage(EsimProductsCollectionId, '?search=Mexico');
    await po.expectCollectionPageTitle('eSIM Products');

    await po.getCollectionItems().first().click();
    await page.waitForURL(/esim-products\/.+/);

    const relatedProducts = page.locator(
      '.field-type--related-products .value-container .relationship--multi-value-label',
    );
    await relatedProducts.first().waitFor();
    expect(await relatedProducts.count(), 'Has some related products').toBeGreaterThanOrEqual(1);
  });
});
