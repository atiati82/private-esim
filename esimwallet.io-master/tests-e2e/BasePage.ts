import fs from 'fs';
import { expect, type Cookie, type Page, type Response } from '@playwright/test';
import type { SendMailOptions } from 'nodemailer';

import { extractUrlLinks } from '../src/lib/html-helpers';
import { LastEmailSendJsonPath } from './e2e-config';

/**
 * BasePage, to use as a base for other Page Objects
 */
export class BasePage {
  readonly page: Page;
  private lastResponse!: Response;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url = '/'): Promise<Response> {
    this.lastResponse = (await this.page.goto(url)) as Response;
    return this.lastResponse;
  }

  /**
   * Returns TRUE when running against production build/server.
   * Used to run some extra checks, e.g. cache headers etc
   */
  isProductionTest(): boolean {
    return !!process.env.PRODUCTION_TEST;
  }

  getLastRequestHeaders(): Record<string, string> {
    return this.lastResponse.request().headers();
  }
  getLastResponseHeaders(): Record<string, string> {
    return this.lastResponse.headers();
  }

  getCacheControlHeader(): string {
    const headers = this.lastResponse.headers();
    return headers['Cache-Control'] || headers['cache-control'];
  }

  expectCachedContent(): void {
    expect
      .soft(this.getCacheControlHeader(), 'expect Cache-Control to be cached')
      .toContain('s-maxage=31536000');
  }

  async getLocaleCookie(): Promise<Cookie | undefined> {
    const cookies = await this.page.context().cookies();
    return cookies.find((cookie) => cookie.name === 'NEXT_LOCALE');
  }

  cleanLastEmailSent(): void {
    fs.writeFileSync(LastEmailSendJsonPath, '', 'utf-8');
  }
  getLastEmailSent(): (SendMailOptions & { links: string[] }) | undefined {
    let emailData: SendMailOptions | undefined = undefined;
    try {
      emailData = JSON.parse(fs.readFileSync(LastEmailSendJsonPath, 'utf-8'));
    } catch (e) {
      console.warn(
        'Could not parse JSON with the last e-mail sent. Using production email transport, perhaps?',
      );
    }
    if (emailData?.html) {
      return {
        ...emailData,
        links: extractUrlLinks(emailData?.html as string),
      };
    }
    return undefined;
  }
  getLinkFromLastEmail(): string | undefined {
    return this.getLastEmailSent()?.links[0];
  }
}
