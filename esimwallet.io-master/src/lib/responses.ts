import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * API response from Redux RTK functions
 */
export type ReduxApiResponse = {
  data?: unknown;
  error?: SerializedError | (FetchBaseQueryError & { error?: string });
};

export type ResponseStatusCode = number | FetchBaseQueryError['status'];
export type FetchErrorBody = { errors: Array<{ message: string; code?: string }> };

export class NormalisedError extends Error {
  code: string;
  message: string;
  public constructor(message: string, code: string) {
    super(message);
    this.name = 'NormalisedError';
    this.message = message;
    this.code = code;
  }
}

const UnknownErrorMsg = 'Unknown Error';
const DisconnectedErrorMsg = `There seem to be some connectivity issues. Are you connected to the Internet?`;
const TimeoutErrorMsg = `Timeout occurred while connecting.`;
const Error40xMsg = `No Access, sorry.`;

/**
 * `fetch()` doesn't throw for erroneous responses.
 * Use this in the 1st `then()` to throw Error, so it can be captured
 *
 * @example
 * ```
 * return fetch(url, {})
 *   .then(throwErrorIfErroneousResponse)
 *   .then((res) => res.json());
 * ```
 */
export function throwErrorIfErroneousResponse(res: Response): Promise<Response> {
  if (isErroneousResponse(res)) {
    return res.json().then((errorBody: FetchErrorBody) => {
      throw getErrorFromApiResponse(res, extract1stErrorFromBody(errorBody, res.statusText));
    });
  }
  return Promise.resolve(res);
}

/**
 * Check if API response is erroneous
 */
export function isErroneousResponse(res: Response): boolean {
  return res.ok === false || res.status > 399;
}

/**
 * Check if API response is erroneous
 */
export function isErroneousReduxResponse(res: ReduxApiResponse): boolean {
  return !!res.error;
}

/**
 * Always get NormalizedError in `catch (err) {}` clause
 */
export function getCatchError(err: unknown): NormalisedError {
  if (err instanceof NormalisedError) {
    return err;
  }
  const e = err as Error;
  return makeNormalizedErr(e.message, e.name);
}

/**
 * Shortcut to respond with error details when returning data (or rather: errors)
 *
 * @example
 * ```
 * return NextResponse.json(
 *    responseWithError('Could not find the user'),
 *    { status: 403 }
 * );
 * ```
 */
export function responseWithError(message: string, code?: string): FetchErrorBody {
  return { errors: [{ message, code }] };
}

/**
 * Get nice, normalized error from standard fetch() API Response
 *
 * @param response
 * @param errMsgOrData Custom/fallback error message or response with error(s), in `FetchErrorBody` shape
 */
export function getErrorFromApiResponse(
  response: Response,
  errMsgOrData?: string | FetchErrorBody,
): NormalisedError | undefined {
  if (isErroneousResponse(response)) {
    // Perhaps response body could be decoded here... instead of supplying it via `errMsgOrData`
    // but that would mean that the function needs to be async...
    const errorMessage =
      errMsgOrData && 'object' === typeof errMsgOrData
        ? extract1stErrorFromBody(errMsgOrData, undefined)
        : errMsgOrData;

    return getErrorFromResponseStatusCode(response.status, errorMessage || response.statusText);
  }

  return undefined;
}

/**
 * Get nice, normalized error from API responses
 */
export function getErrorFromReduxApiResponse(res: ReduxApiResponse): NormalisedError | undefined {
  if (res.error) {
    //
    // handle SerializedError
    //
    const sError = res.error as SerializedError;
    if (sError.message || sError.code) {
      return makeNormalizedErr(sError.message, sError.code);
    }

    //
    // handle FetchBaseQueryError
    //
    const err = res.error as FetchBaseQueryError & { error?: string };
    const errData = err.data as FetchErrorBody | undefined;
    const errMsg = extract1stErrorFromBody(errData, err.error);
    return getErrorFromResponseStatusCode(err.status, errMsg);
  }

  return undefined;
}

function extract1stErrorFromBody(
  errorBody: FetchErrorBody | string | undefined,
  fallbackMsg: string | undefined,
): string | undefined {
  if (errorBody && typeof errorBody === 'object') {
    return errorBody?.errors?.[0].message || fallbackMsg;
  }
  return errorBody || fallbackMsg;
}

function getErrorFromResponseStatusCode(
  statusCode: ResponseStatusCode,
  errMsg: string | undefined,
): NormalisedError {
  switch (statusCode) {
    case 'FETCH_ERROR':
      return makeNormalizedErr(errMsg || DisconnectedErrorMsg, 'FetchError');
    case 'TIMEOUT_ERROR':
      return makeNormalizedErr(errMsg || TimeoutErrorMsg, 'TimeoutError');
    case 401:
      return makeNormalizedErr(errMsg || Error40xMsg, 'Unauthorized');
    case 403:
      return makeNormalizedErr(errMsg || Error40xMsg, 'Forbidden');
    default:
      // TODO: explicitly support more errors here with better messages
      // eslint-disable-next-line no-case-declarations
      const errorCode: string = parseInt(statusCode as string)
        ? `Error ${statusCode}`
        : `${statusCode || 'Error'}`;
      return makeNormalizedErr(errMsg, errorCode);
  }
}

export function makeNormalizedErr(
  message: string | null | undefined,
  code?: string,
): NormalisedError {
  return new NormalisedError(message || UnknownErrorMsg, code || 'Error');
}
