import type { Locator, Response } from '@playwright/test';

import { initUsersToCreate } from '@/config';
import { MyAccountSections, urlForAccount } from '@/lib/urls';
import { UserDto } from '@/payload/app-types';

import { HomePage } from '../HomePage';

export class MyAccountPage extends HomePage {
  public customerUser = initUsersToCreate.find((u) => u.email?.startsWith('customer@')) as UserDto;

  public MyAccountPageTitle = 'My Account';
  public MyAccountPageLoginText = 'Login to your account';
  public MyAccountLogOut = 'Log Out';
  public LoginFormTitle = 'Log in to your Account';
  public LoginFormSubmitText = 'Log In';
  public LoginFormSubmittingText = 'Logging In';
  public LoginErrorMsg = 'The email or password provided is incorrect.';

  gotoMyAccountPage(section: MyAccountSections = ''): Promise<Response> {
    return this.goto(urlForAccount(section));
  }

  async waitForReCaptcha(): Promise<void> {
    await this.page.waitForSelector('.grecaptcha-badge');
  }

  getMyAccountSection(): Locator {
    return this.page.getByTestId('my-account-section');
  }

  getPageForm(): Locator {
    return this.getMyAccountSection().locator('form');
  }

  getFormLinks(): Locator {
    return this.getPageForm().locator('a');
  }
  getFormSubmitButton(): Locator {
    return this.getPageForm().getByRole('button');
  }
  getFormEmailField(): Locator {
    return this.getPageForm().locator('input[name=email]');
  }
  getFormPasswordField(confirmField = false): Locator {
    return this.getPageForm().locator(
      `input[name=${confirmField ? 'passwordConfirm' : 'password'}]`,
    );
  }
  getFormCheckbox(name?: string): Locator {
    return name
      ? this.getPageForm().locator(`id=${name}-form-item`)
      : this.getPageForm().getByRole('checkbox');
  }
  getFormErrors(): Locator {
    return this.getPageForm().locator('p.form-error-message');
  }
}
