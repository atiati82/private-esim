import { expect, Locator, type Page, type Response } from '@playwright/test';

import { initDevPassword, initDevUser } from '@/config';

import * as adminConfig from '../e2e-config';

/**
 * Base PayloadCMS page, with handy utilities (e.g. to login, to get collections etc)
 */
export class BasePayloadPage {
  public baseUrl = adminConfig.PayloadBaseUrl;
  public apiUrl = adminConfig.PayloadApiUrl;

  readonly page: Page;
  private lastResponse!: Response;

  public authenticatedUserId?: string;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url = '/'): Promise<Response> {
    this.lastResponse = (await this.page.goto(this.baseUrl + url)) as Response;
    return this.lastResponse;
  }

  async loginUsingApi(): Promise<void> {
    const loginRes = await this.page.request.post(`${this.apiUrl}/users/login`, {
      data: {
        email: initDevUser,
        password: initDevPassword,
      },
    });
    expect(loginRes.ok(), 'Login response: OK').toBe(true);
    const responseJson = await loginRes.json();
    expect(responseJson.user, 'Logged in successfully').toMatchObject({ email: initDevUser });
    this.authenticatedUserId = responseJson.user.id;
  }

  async loginAndGoToAdminPage(): Promise<void> {
    await this.loginUsingApi();
    await this.goto();
    await expect(
      this.page.locator('.dashboard .dashboard__label').first(),
      'Dashboard loaded',
    ).toHaveText('Collections');
  }

  async loginAndGoToCollectionPage(collectionId: string, extraUrl: string = ''): Promise<void> {
    await this.loginUsingApi();
    const url = `/collections/${collectionId}${extraUrl}`;
    await this.goto(url);
    await expect(this.page, `Collection page ${collectionId} loaded`).toHaveURL(
      new RegExp(this.baseUrl + url),
    );
  }
  /**
   * Fetches all documents from a specified collection with pagination.
   * @param collection The name of the collection.
   * @param limit The number of documents to fetch per page. Default is 100.
   * @returns An object containing an array of documents and the total number of documents.
   */
  async fetchDocumentFromAPI<T>(
    collection: string,
    limit: number = 100,
  ): Promise<{ docs: T[]; totalDocs: number }> {
    const allDocs: T[] = [];
    let totalDocs = 0;

    for (let pageNum = 1; ; pageNum++) {
      const response = await this.page.request.get(`${this.apiUrl}/${collection}`, {
        params: { limit: limit, page: pageNum },
      });
      expect(response.ok(), `Fetch ${collection} documents response: OK`).toBe(true);

      const result = (await response.json()) as { docs: T[]; totalDocs?: number };

      // Append the fetched documents to allDocs
      allDocs.push(...result.docs);

      // Set totalDocs on the first page fetch
      if (pageNum === 1 && result.totalDocs !== undefined) {
        totalDocs = result.totalDocs;
      }

      // Break the loop if fewer documents than the limit are returned
      if (result.docs.length < limit) {
        break;
      }
    }

    return { docs: allDocs, totalDocs };
  }

  /**
   * Creates a document in a specified collection.
   * @param collection The name of the collection.
   * @param data The data for the new document.
   * @returns The response JSON of the created document.
   */
  async createDocumentFromAPI<T extends Document>(collection: string, data: T): Promise<T> {
    const createRes = await this.page.request.post(`${this.apiUrl}/${collection}`, {
      data: data,
    });
    expect(createRes.ok(), `Create ${collection} document response: OK`).toBe(true);
    const responseJson = await createRes.json();
    return responseJson;
  }

  async expectCollectionPageTitle(title: string): Promise<void> {
    await expect(
      this.page.locator('header.collection-list__header').first(),
      'Collection page has header title',
    ).toContainText(title);
  }

  getCollectionPageSearchField(): Locator {
    return this.page.locator('.collection-list .list-controls input.search-filter__input');
  }

  /**
   * Get all collection table items, from the 1st (clickable) column
   */
  getCollectionItems(clickableName = 'name'): Locator {
    return this.page.locator(`.collection-list table>tbody tr>td.cell-${clickableName} a`);
  }

  /**
   * Returns TRUE when running against production build/server.
   * Used to run some extra checks, e.g. cache headers etc
   */
  isProductionTest(): boolean {
    return !!process.env.PRODUCTION_TEST;
  }
}
