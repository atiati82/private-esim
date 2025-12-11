import { expect, Page, test } from '@playwright/test';

import { BasePayloadPage } from '../admin/PayloadBasePage';
import { HomePage } from '../HomePage';

test.describe('Front end functionality', () => {
  let page: Page;
  let po: BasePayloadPage;

  test.beforeAll('Before testing seed the database', async ({ browser }) => {
    page = await browser.newPage();
    po = new BasePayloadPage(page);
    await po.loginUsingApi();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Should show blog page list', async () => {
    const po = new HomePage(page);
    await po.goto('/blog');
    // Check that the first page shows the correct number of posts
    await expect(page.getByTestId('listing-blog-card')).toHaveCount(8);
  });

  test('Should show blog page listed with pagination', async () => {
    const po = new HomePage(page);
    await po.goto('/blog');
    // Check the first page (newest 8 posts)
    await expect(page.getByTestId('listing-blog-card')).toHaveCount(8);

    // Navigate using pagination
    await page.locator('nav[aria-label="pagination"] >> text=Next').click();
    // Check if pagination leads to the correct number of posts on the next page
    await expect(page.getByTestId('listing-blog-card')).toHaveCount(8);

    // Go back to the previous page
    await page.locator('nav[aria-label="pagination"] >> text=Previous').click();
    // Check the first page again
    await expect(page.getByTestId('listing-blog-card')).toHaveCount(8);
  });

  test('Should render single page post', async () => {
    const po = new HomePage(page);
    // Navigate directly to a specific blog post
    await po.goto('/blog/blog-post-11');
    // Ensure specific content is visible on the post's page
    await expect(
      page.locator('text=The Future of Connectivity: Understanding e-SIM Technology 11'),
    ).toBeVisible();
  });
});
