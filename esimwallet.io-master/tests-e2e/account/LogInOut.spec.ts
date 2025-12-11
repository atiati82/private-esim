import { expect, test } from '@playwright/test';

import { urlForAccount } from '@/lib/urls';

import { MyAccountPage } from './MyAccountPage';

test.describe('Login & Logout', () => {
  let po: MyAccountPage;
  test.beforeEach(async ({ page }) => {
    po = new MyAccountPage(page);
  });

  test('navigate from navbar to My Account page', async () => {
    await po.goto('/');

    await po.getHamburgerMenuTrigger().click();
    await po.getHamburgerMenuContent().waitFor();
    await po.getHamburgerMenuItems().filter({ hasText: 'My Account' }).click();
    expect(await po.getMyAccountSection().innerText()).toContain(po.MyAccountPageTitle);
  });

  test('login form elements', async ({ page }) => {
    await po.gotoMyAccountPage('login');
    await expect(page, 'Is on /login page').toHaveURL(/login/);
    await expect(po.getPageForm(), 'Has Login form title').toContainText(po.LoginFormTitle);
    expect(await po.getFormLinks().count(), 'Form has links').toBeGreaterThanOrEqual(2);
    expect(await po.getFormEmailField().isEditable(), 'Has email input').toBe(true);
    expect(await po.getFormPasswordField().isEditable(), 'Has password input').toBe(true);
    expect(await po.getFormSubmitButton().innerText(), 'Has [submit] button').toBe(
      po.LoginFormSubmitText,
    );
  });

  test('login and logout', async ({ page }) => {
    await po.gotoMyAccountPage('login');
    await po.waitForReCaptcha();
    await po.getFormEmailField().fill(po.customerUser.email);
    await po.getFormPasswordField().fill(po.customerUser.password!);
    await po.getFormSubmitButton().click();
    await expect(po.getFormSubmitButton(), po.LoginFormSubmittingText).toContainText(
      po.LoginFormSubmittingText,
    );

    await page.waitForURL(urlForAccount());
    await expect(po.getMyAccountSection().getByText(po.customerUser.email)).toBeVisible();
    await expect(po.getMyAccountSection().getByText(po.MyAccountLogOut)).toBeVisible();

    await po.getMyAccountSection().getByText(po.MyAccountLogOut).click();
    await expect(po.getMyAccountSection().getByText(po.MyAccountPageLoginText)).toBeVisible();
  });

  test('login unsuccessful', async () => {
    await po.gotoMyAccountPage('login');
    await po.waitForReCaptcha();
    await po.getFormEmailField().fill('some-invalid@email.com');
    await po.getFormPasswordField().fill('some-invalid-password');
    await po.getFormSubmitButton().click();
    await expect(po.getFormErrors()).toContainText(po.LoginErrorMsg);
  });
});
