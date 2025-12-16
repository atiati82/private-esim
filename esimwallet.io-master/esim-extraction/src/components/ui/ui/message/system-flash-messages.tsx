import React from 'react';

import { NormalisedError } from '@/lib/responses';

import { textErrorCode } from '@/styles/typography.css';

/**
 * Flash Message (the description part) shown for generic API errors
 */
export function flashMessageForGenericApiError(error: NormalisedError): React.ReactElement {
  return (
    <>
      <span>
        Please reload the page and try again. If the error comes back,{' '}
        <strong>please contact our Customer Support</strong> - we'll be happy to help!
      </span>
      <br />
      <code className={textErrorCode}>
        {error.code} | {error.message}
      </code>
    </>
  );
}
