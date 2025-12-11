import React, { use } from 'react';
import { useTranslations } from 'next-intl';

import { urlForAccount } from '@/lib/urls';
import { Link } from '@/navigation';

import {
  getUserByVerifyToken,
  isValidToken,
  verifyAccountFromToken,
} from '@/app/[locale]/account/verify/[token]/token-utils';
import { Message } from '@/components/ui/message/message';
import { Textual } from '@/components/ui/textual';

type AccountVerifyProps = { token: string };

export const AccountVerifyRes: React.FC<AccountVerifyProps> = ({ token }) => {
  const t = useTranslations();

  // Technically incorrect token (invalid characters, invalid length)
  if (!isValidToken(token)) {
    return (
      <Message
        title={t('Account.Verify.verifyErrorTitle')}
        error={t('Account.Verify.invalidToken')}
      />
    );
  }

  const accountFound = use(getUserByVerifyToken(token));
  if (accountFound) {
    const verifySuccess = use(verifyAccountFromToken(accountFound.id, token));
    if (verifySuccess) {
      return (
        <Message
          title={t('Account.Verify.verifyTitle')}
          success={
            <>
              <Textual>{t('Account.Verify.verifySuccessMessage')}</Textual>
              <Textual>
                <Link href={urlForAccount('login')} className="font-semibold">
                  {t('Account.Verify.logInHere')}
                </Link>
                .
              </Textual>
            </>
          }
        />
      );
    } else {
      // This error should never happen - it's simply marking account as verified in the DB
      // But just in case... we show user the error if anything went wrong with that.
      return (
        <Message
          title={t('Account.Verify.verifyErrorTitle')}
          error={t('Account.Verify.verifyErrorUnknown')}
        />
      );
    }
  }

  // Token technically correct, but wasn't found in DB
  // Might have been already verified, or it's made up.
  return (
    <Message
      title={t('Account.Verify.verifyErrorTitle')}
      warning={
        <>
          <Textual>{t('Account.Verify.tokenNotFound')}</Textual>
          <Textual>{t('Account.Verify.tokenNotFound2')}</Textual>
          <Textual>
            <Link href={urlForAccount('login')} className="font-semibold">
              {t('Account.Verify.logInHere')}
            </Link>
            .
          </Textual>
        </>
      }
    />
  );
};
