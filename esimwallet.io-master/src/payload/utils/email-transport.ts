import fs from 'fs';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { resendAdapter } from '@payloadcms/email-resend';
import type { SendMailOptions, Transporter } from 'nodemailer';
import type { EmailAdapter } from 'payload';

import { emailFromAddress, emailFromName } from '@/config';
import { isTestingEnv } from '@/env-helpers';
import { AppCacheDir, ensureCacheDir } from '@/payload/utils/cache';

/**
 * Should real/production email transport be used?
 */
const USE_PRODUCTION_EMAIL_TRANSPORT = process.env.USE_PRODUCTION_EMAIL_TRANSPORT === 'true';

/**
 * When using test email transport, it can log all emails to console
 */
const LOG_SEND_EMAIL = !isTestingEnv;

export const LAST_EMAIL_JSON = `${AppCacheDir}/last-email-sent.json`;

export async function getEmailAdapter(): Promise<EmailAdapter> {
  if (USE_PRODUCTION_EMAIL_TRANSPORT) {
    return resendAdapter({
      defaultFromAddress: emailFromAddress,
      defaultFromName: emailFromName,
      apiKey: process.env.RESEND_API_KEY || '',
    });
  } else {
    return nodemailerAdapter({
      defaultFromAddress: emailFromAddress,
      defaultFromName: emailFromName,
      transport: testEmailTransport,
    });
  }
}

export const testEmailTransport = {
  sendMail: (emailOptions: SendMailOptions) => {
    ensureCacheDir(LAST_EMAIL_JSON);
    const jsonContent = JSON.stringify(
      {
        sentAt: new Date(),
        ...emailOptions,
      },
      null,
      2,
    );
    if (LOG_SEND_EMAIL) {
      console.info(`Sending e-mail '${emailOptions.subject}' to ${emailOptions.to}`);
      console.debug(emailOptions);
    }
    fs.writeFileSync(LAST_EMAIL_JSON, jsonContent, 'utf8');
  },
  verify: () => {},
} as Transporter;
