import { expect, test } from '@playwright/test';
import { Route } from 'playwright-core';

import * as config from './e2e-config';
import { HomePage } from './HomePage';

const SearchDebounceWait = 300;

test.describe('HomePage Destination Search', () => {
  let po: HomePage;
  test.beforeEach(async ({ page }) => {
    po = new HomePage(page);
  });

  test('has search box', async () => {
    await po.goto('/');
    await expect(po.getDestinationSearchBox()).toHaveAttribute(
      'placeholder',
      /Where Do You Want To Go/,
    );
  });

  test('should search, show search results and navigate to destination', async ({ page }) => {
    await po.goto('/');
    await po.getDestinationSearchBox().click();
    await expect(po.getDestinationSearchBoxOnPopover()).toBeFocused();

    await po.getDestinationSearchBoxOnPopover().fill('Pol');
    await page.waitForTimeout(SearchDebounceWait);
    await po.getDestinationSearchBoxIcon().waitFor(); // wait for loader to disappear

    const res = await po.getDestinationSearchResults().count();
    expect(res).toBeGreaterThanOrEqual(2); // expect at least 2 destinations
    await po.getDestinationSearchResults().getByText('Poland').click();
    await page.waitForURL(/poland/);
    await expect(page).toHaveURL(/poland/);
  });

  test('should search by extra keywords', async ({ page }) => {
    await po.goto('/');
    await po.getDestinationSearchBox().click();
    await expect(po.getDestinationSearchBoxOnPopover()).toBeFocused();

    await po.getDestinationSearchBoxOnPopover().fill('London');
    await page.waitForTimeout(SearchDebounceWait);
    await po.getDestinationSearchBoxIcon().waitFor(); // wait for loader to disappear

    const res = await po.getDestinationSearchResults().count();
    expect(res).toBeGreaterThanOrEqual(1);
    await po.getDestinationSearchResults().getByText('United Kingdom').click();
    await page.waitForURL(/united-kingdom/);
    await expect(page).toHaveURL(/united-kingdom/);
  });

  test('for no results, should show nothing found info', async () => {
    await po.goto('/');
    await po.getDestinationSearchBox().click();

    await po.getDestinationSearchBoxOnPopover().fill('Some Unknown Destination');
    await po.getDestinationSearchResultsTextInfo().waitFor();
    await expect(po.getDestinationSearchResultsTextInfo()).toContainText('Nothing found');
  });

  test('should show loader', async ({ page }) => {
    const ApiDelay = 5000;
    await page.route(config.DestinationsApiUrl, async (route: Route): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, ApiDelay));
      await route.continue(); // Continue with the request after the delay
    });

    await po.goto('/');
    await po.getDestinationSearchBox().click();
    await po.getDestinationSearchBoxOnPopover().fill('Poland');

    await po.getDestinationSearchBoxIcon('loader').waitFor();
    await expect(po.getDestinationSearchResultsTextInfo()).toContainText('Still loading...');
    await po.getDestinationSearchBoxIcon('search').waitFor();

    const res = po.getDestinationSearchResults().getByText('Poland');
    await expect(res).toBeVisible();
  });

  test('should show error', async ({ page }) => {
    await page.route(config.DestinationsApiUrl, async (route: Route): Promise<void> => {
      await route.fulfill({ status: 500 });
    });

    await po.goto('/');
    await po.getDestinationSearchBox().click();
    await expect(po.getDestinationSearchResultsTextInfo()).toContainText(
      'Error while loading search results',
    );
  });
});
