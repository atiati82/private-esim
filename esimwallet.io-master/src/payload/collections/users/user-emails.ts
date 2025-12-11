import { urlForAccount } from '@/lib/urls';

export function accountVerifyEmailSubject(): string {
  return 'Confirm your Private eSIM account';
}

export function accountVerifyHtmlEmail({ token }: { token: string }): string {
  const verifyUrl = urlForAccount('verify') + '/' + token;

  return `Hey!
    <br /><br />
    A new account has just been created for you to access <strong>Private eSIM</strong> account.
    <br /><br />
    Please click on the following link or paste the URL below into your browser to verify your email:
    <a href="${verifyUrl}">${verifyUrl}</a>
    <br /><br />
    After verifying your email, you will be able to log in.
    <br /><br />
    -- <br />
    Yours sincerely,<br />
    Private eSIM team`;
}
