import type { Response } from '@playwright/test';

import * as localeMessages from '@/i18n/en.json';
import { urlForAccount } from '@/lib/urls';

import { MyAccountPage } from './MyAccountPage';

export class AccountSignUpPage extends MyAccountPage {
  public ValidPassword = 'Tralala.567';

  public ErrorEmailRequired = 'Valid e-mail is required.';
  public ErrorPasswordRequired = 'Password is required.';
  public ErrorTCsRequired = 'You must agree to Terms and Conditions.';
  public AccountCreatedSuccessTitle = 'Account Created Successfully';
  public AccountVerifySuccessMessage = localeMessages.Account.Verify.verifySuccessMessage;
  public AccountVerifyAlreadyVerifiedMessage = localeMessages.Account.Verify.tokenNotFound;
  public AccountVerifyTokenNotFoundMessage = localeMessages.Account.Verify.tokenNotFound;
  public AccountVerifyTokenInvalid = localeMessages.Account.Verify.invalidToken;

  gotoSignUpPage(): Promise<Response> {
    return this.goto(urlForAccount('create'));
  }
}
