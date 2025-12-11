import { expect, test } from '@playwright/test';

import { urlForAccount } from '../../src/lib/urls';
import { AccountSignUpPage } from './AccountSignUp';

test.describe('Account Sign Up & Verify', () => {
  const mockVerifyToken = 'a9b6a3f58179931230c65a2e8e52e854cd89a666';

  let po: AccountSignUpPage;
  test.beforeEach(async ({ page }) => {
    po = new AccountSignUpPage(page);
    po.cleanLastEmailSent();
    await po.gotoSignUpPage();
  });

  test('form errors for empty fields', async () => {
    await po.getFormSubmitButton().click();
    const formErrors = po.getFormErrors();
    await expect(formErrors.getByText(po.ErrorEmailRequired)).toBeVisible();
    await expect(formErrors.getByText(po.ErrorPasswordRequired)).toBeVisible();
    await expect(formErrors.getByText(po.ErrorTCsRequired)).toBeVisible();
  });

  test('form errors from server', async ({ page }) => {
    await po.waitForReCaptcha();
    await po.getFormEmailField().fill(po.customerUser.email);
    await po.getFormPasswordField().fill(po.ValidPassword);
    await po.getFormPasswordField(true).fill(po.ValidPassword);
    await po.getFormCheckbox('legalAgreement').click();
    await po.getFormSubmitButton().click();

    await page.waitForSelector('p.form-error-message');
    const formErrors = po.getFormErrors();

    expect(await formErrors.innerText(), 'Shows server error').toMatch(
      /already registered|ReCaptcha flagged this action as suspicious/i,
    );
  });

  test('sign up flow', async ({ page }) => {
    const email = 'test+' + Math.random() + '@example.com';
    await po.waitForReCaptcha();
    await po.getFormEmailField().fill(email);
    await po.getFormPasswordField().fill(po.ValidPassword);
    await po.getFormPasswordField(true).fill(po.ValidPassword);
    await po.getFormCheckbox('legalAgreement').click();
    await po.getFormSubmitButton().click();

    const expectedSuccessText = 'text=' + po.AccountCreatedSuccessTitle;
    await page.waitForSelector(expectedSuccessText);
    await expect(
      page.locator(expectedSuccessText),
      'OK: Account created successfully',
    ).toBeVisible();

    const lastEmailSent = po.getLastEmailSent();
    if (!lastEmailSent) {
      test.skip(true, 'SKIPPING - NO JSON WITH LAST EMAIL SENT.');
    }
    const verificationLink = po.getLinkFromLastEmail() as string;
    expect(verificationLink, 'E-mail verification link found').toContain('account/verify');

    await page.goto(verificationLink);
    await page.waitForLoadState();
    const expectedVerifySuccessText = 'text=' + po.AccountVerifySuccessMessage;
    await page.waitForSelector(expectedVerifySuccessText);
    await expect(page.locator(expectedVerifySuccessText), 'OK: Account verified').toBeVisible();

    await page.reload();
    await page.waitForLoadState();
    const expectedAlreadyVerifiedText = 'text=' + po.AccountVerifyAlreadyVerifiedMessage;
    await page.waitForSelector(expectedAlreadyVerifiedText);
    await expect(
      page.locator(expectedAlreadyVerifiedText),
      'OK: Account already verified',
    ).toBeVisible();
  });

  test('verify: missing token', async ({ page }) => {
    const verificationLink = urlForAccount('verify') + '/' + mockVerifyToken;
    await page.goto(verificationLink);
    await page.waitForLoadState();
    const expectedText = 'text=' + po.AccountVerifyTokenNotFoundMessage;
    await page.waitForSelector(expectedText);
    await expect(page.locator(expectedText), 'Token not found').toBeVisible();
  });

  test('verify: invalid token', async ({ page }) => {
    const verificationLink = urlForAccount('verify') + '/invalid.token';
    await page.goto(verificationLink);
    await page.waitForLoadState();
    const expectedText = 'text=' + po.AccountVerifyTokenInvalid;
    await page.waitForSelector(expectedText);
    await expect(page.locator(expectedText), 'Token invalid').toBeVisible();
  });
});
