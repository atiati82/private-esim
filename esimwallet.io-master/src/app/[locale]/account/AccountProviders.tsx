'use client';

import React from 'react';
import { ReCaptchaProvider } from 'next-recaptcha-v3';

export function AccountProviders({
  children,
  locale,
}: React.PropsWithChildren<{ locale: string }>): React.ReactNode {
  const reCaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
  if (!reCaptchaSiteKey) {
    console.error('RECAPTCHA_SITE_KEY is missing. Did you forget to set the env variable?');
  }
  return (
    <ReCaptchaProvider reCaptchaKey={reCaptchaSiteKey} language={locale} useEnterprise={true}>
      {children}
    </ReCaptchaProvider>
  );
}
