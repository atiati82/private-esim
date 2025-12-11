'use client';

import * as React from 'react';
import { CopyToClipboard, useFormFields } from '@payloadcms/ui';
import { TextField } from 'payload';

import { urlForStripePayment } from '../../utils-ordering';

export const FieldStripePaymentId: React.FC<{ field: TextField }> = ({ field }) => {
  const { name } = field;

  const { value } = useFormFields(([fields]) => fields[name]) ?? {};
  const stripePaymentIntentId = (value as string) || '';

  return (
    <div className="field-type">
      <label className="field-label ">{'Stripe Payment'}</label>
      {(stripePaymentIntentId && (
        <div>
          <a
            href={urlForStripePayment(stripePaymentIntentId)}
            target="_stripePayment"
            title="Manage in Stripe"
            rel="noreferrer noopener"
            style={{ marginRight: '.25rem' }}
          >
            {stripePaymentIntentId}
          </a>
          <CopyToClipboard value={stripePaymentIntentId} />
        </div>
      )) || <>N/A</>}
    </div>
  );
};
