import { describe, expect, test } from 'vitest';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import {
  FetchErrorBody,
  getErrorFromApiResponse,
  getErrorFromReduxApiResponse,
  isErroneousReduxResponse,
  isErroneousResponse,
} from '@/lib/responses';

describe('API responses', function () {
  test('isErroneousResponse()', () => {
    expect(isErroneousResponse({} as Response)).toBe(false);
    expect(isErroneousResponse({ ok: true } as Response)).toBe(false);
    expect(isErroneousResponse({ status: 201 } as Response)).toBe(false);
    expect(isErroneousResponse({ ok: false } as Response)).toBe(true);
    expect(isErroneousResponse({ status: 400 } as Response)).toBe(true);
  });

  test('isErroneousReduxResponse()', () => {
    expect(isErroneousReduxResponse({})).toBe(false);
    expect(isErroneousReduxResponse({ data: {} })).toBe(false);
    expect(isErroneousReduxResponse({ error: {} })).toBe(true);
  });

  describe('getErrorFromApiResponse()', () => {
    test('no error for OK responses', () => {
      const response = new Response('', { status: 200 });
      const error = getErrorFromApiResponse(response);
      expect(error).toBe(undefined);
    });
    test('error: when empty error details', () => {
      const response = new Response('', { status: 400 });
      const error = getErrorFromApiResponse(response);
      expect(error?.code).toBe('Error 400');
      expect(error?.message).toBe('Unknown Error');
    });
    test('error: when error details as string', () => {
      const response = new Response('', { status: 400 });
      const error = getErrorFromApiResponse(response, 'Some Special Error');
      expect(error?.code).toBe('Error 400');
      expect(error?.message).toBe('Some Special Error');
    });
    test('error: when error details as FetchErrorBody', () => {
      const decodedBodyWithErrors: FetchErrorBody = {
        errors: [{ message: 'Error XYZ' }],
      };
      const response = new Response(null, { status: 400 });
      const error = getErrorFromApiResponse(response, decodedBodyWithErrors);
      expect(error?.code).toBe('Error 400');
      expect(error?.message).toBe('Error XYZ');
    });
  });

  describe('getErrorFromReduxApiResponse()', () => {
    test('no error data when not erroneous response', () => {
      expect(getErrorFromReduxApiResponse({})).toBe(undefined);
    });

    test('get unknown error if error is present but empty', () => {
      const err = getErrorFromReduxApiResponse({ error: {} });
      expect(err?.message).toBe('Unknown Error');
      expect(err?.code).toBe('Error');
    });

    describe('SerializedError', () => {
      let error: SerializedError;

      test('get error msg from SerializedError obj', () => {
        error = {
          message: 'Some Error Msg',
          code: 'TaDa',
        };
        const resError = getErrorFromReduxApiResponse({ error });
        expect(resError?.code).toBe('TaDa');
        expect(resError?.message).toBe('Some Error Msg');
      });
    });

    describe('FetchBaseQueryError', () => {
      let error: FetchBaseQueryError & { error?: string };

      test('401 Unauthorized', () => {
        error = {
          status: 401,
          data: { errors: [{ message: 'The email or password provided is incorrect.' }] },
        };
        const resError = getErrorFromReduxApiResponse({ error });
        expect(resError?.code).toBe('Unauthorized');
        expect(resError?.message).toBe('The email or password provided is incorrect.');
      });

      test('get error from FETCH_ERROR', () => {
        error = {
          status: 'FETCH_ERROR',
          error: 'Fetch Error Occurred',
        };
        const resError = getErrorFromReduxApiResponse({ error });
        expect(resError?.code).toBe('FetchError');
        expect(resError?.message).toContain('Fetch Error Occurred');
      });

      test('get error from FETCH_ERROR when disconnected', () => {
        error = {
          status: 'FETCH_ERROR',
          error: '',
        };
        const resError = getErrorFromReduxApiResponse({ error });
        expect(resError?.code).toBe('FetchError');
        expect(resError?.message).toContain('connectivity issues');
      });

      test('error from CUSTOM_ERROR', () => {
        error = {
          error: 'Some Top-Level Error',
          status: 'CUSTOM_ERROR',
        };
        const resError = getErrorFromReduxApiResponse({ error });
        expect(resError?.code).toEqual('CUSTOM_ERROR');
        expect(resError?.message).toEqual('Some Top-Level Error');
      });
    });
  });
});
