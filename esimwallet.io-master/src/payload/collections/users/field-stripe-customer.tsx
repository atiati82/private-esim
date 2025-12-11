'use client';

import * as React from 'react';
import { CopyToClipboard, useFormFields } from '@payloadcms/ui';
import { TextField } from 'payload';

import { urlForStripeCustomer } from '@/feat-ordering/utils-ordering';

export const FieldStripeCustomer: React.FC<{ field: TextField }> = ({ field }) => {
  const { name = '' } = field;

  const { value } = useFormFields(([fields]) => fields[name]) ?? {};
  const stripeCustomerId = (value as string) || '';

  return (
    <div className="field-type">
      <label className="field-label ">Stripe Customer</label>
      {(stripeCustomerId && (
        <div>
          <a
            href={urlForStripeCustomer(stripeCustomerId)}
            target="_stripeCustomer"
            title="Open in Stripe"
            rel="noreferrer noopener"
            style={{ marginRight: '.25rem' }}
          >
            {stripeCustomerId}
          </a>
          <CopyToClipboard value={stripeCustomerId} />
        </div>
      )) || <>Customer not in Stripe yet.</>}
    </div>
  );
};
