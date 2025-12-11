import { expect, test, type Page } from '@playwright/test';

import en from '../src/i18n/en.json';
import es from '../src/i18n/es.json';
import { HomePage } from './HomePage';

test.describe('Default locale: EN', () => {
  let po: HomePage;
  test.beforeEach(async ({ page }) => {
    po = new HomePage(page);
  });

  test('EN: Should detect user language and show EN version w/o redirect', async ({ page }) => {
    await po.goto();
    await page.waitForLoadState();
    await expect(page).toHaveURL('/');
  });

  test('EN: Should show localised version of the page', async () => {
    await po.goto();
    await expect(po.getHeroHeader()).toContainText(en.Index.welcome);
    // await expect(po.getLanguageSwitcher()).toContainText('English');
  });

  test('EN: Should set locale cookie', async ({ page }) => {
    await po.goto();
    await page.waitForLoadState();
    const cookie = await po.getLocaleCookie();
    expect(cookie!.value).toBe('en');
  });

  test('EN: Should serve cached content', async ({ page }) => {
    let response = await po.goto();
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL('/');
    if (po.isProductionTest()) {
      po.expectCachedContent();
    }

    response = await po.goto('/about');
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL('/about');
    if (po.isProductionTest()) {
      po.expectCachedContent();
    }
  });

  test('Change language to ES and remember it in cookie', async ({ page }) => {
    await po.goto('/about');
    await expect(page).toHaveURL('/about');
    let cookie = await po.getLocaleCookie();
    expect(cookie!.value).toBe('en');

    // Change the language to Español
    await po.goto('/es/about');
    // await po.getLanguageSwitcher().click();
    // await po.getLanguageSwitcherOption('Español').click();

    await expect(page).toHaveURL('/es/about');
    // await expect(po.getLanguageSwitcher()).toContainText('Español');
    cookie = await po.getLocaleCookie();
    expect(cookie!.value).toBe('es');
    if (po.isProductionTest()) {
      po.expectCachedContent();
    }

    // re-visit home page - it should redirect to /es
    await po.goto('/');
    await expect(page).toHaveURL('/es');
    await expect(po.getHeroHeader()).toContainText(es.Index.welcome);
    // await expect(po.getLanguageSwitcher()).toContainText('Español');
    if (po.isProductionTest()) {
      po.expectCachedContent();
    }
  });

  test('Should remove default locale prefix, if present', async ({ page }) => {
    await po.goto('/en/about');
    await expect(page).toHaveURL('/about');
  });
});

test.describe('Non-default locale: ES', () => {
  let page: Page;
  let po: HomePage;
  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({ locale: 'es-ES' });
    page = await context.newPage();
    po = new HomePage(page);
  });

  test('ES: Should detect user language and redirect to it', async () => {
    await po.goto();
    await page.waitForLoadState();
    await expect(page).toHaveURL('/es');
  });

  test('ES: Should show localised version of the page', async () => {
    await po.goto();
    await expect(po.getHeroHeader()).toContainText(es.Index.welcome);
    // Skip checking the language switcher since it's disabled for now
    // await expect(po.getLanguageSwitcher()).toContainText('Español');
  });

  test('ES: Should set locale cookie', async () => {
    await po.goto();
    await page.waitForLoadState();
    await expect(page).toHaveURL('/es');
    const cookie = await po.getLocaleCookie();
    expect(cookie!.value).toBe('es');
  });

  test('ES: Should serve cached content', async () => {
    let response = await po.goto();
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL('/es');
    if (po.isProductionTest()) {
      po.expectCachedContent();
    }

    response = await po.goto('/es/about');
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL('/es/about');
    if (po.isProductionTest()) {
      po.expectCachedContent();
    }
  });

  test('Should switch to language from URL prefix', async () => {
    await po.goto('/es');
    await expect(page).toHaveURL('/es');
    // Skip checking the language switcher since it's disabled for now
    // await expect(po.getLanguageSwitcher()).toContainText('Español');
    const cookie = await po.getLocaleCookie();
    expect(cookie!.value).toBe('es');
  });
});
