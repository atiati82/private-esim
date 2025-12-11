import { expect, test } from '@playwright/test';

import en from '../src/i18n/en.json';
import { HomePage } from './HomePage';

test.describe('HomePage', () => {
  let po: HomePage;
  test.beforeEach(async ({ page }) => {
    po = new HomePage(page);
  });

  test('has title', async () => {
    await po.goto('/');
    await expect(po.getHeroHeader()).toContainText(en.Index.welcome);
  });
});
