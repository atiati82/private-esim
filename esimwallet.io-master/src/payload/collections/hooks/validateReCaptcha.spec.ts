import { beforeEach, describe, expect, test } from 'vitest';
import { protos } from '@google-cloud/recaptcha-enterprise';
import type { Payload, PayloadRequest } from 'payload';

import { urlForAccount } from '@/lib/urls';
import {
  expectReCaptchaData,
  interpretReCaptchaResults,
  isReCaptchaProtectedRoute,
} from '@/payload/collections/hooks/validateReCaptcha';
import { appGetPayload } from '@/payload/utils/get-payload';

import IAssessment = protos.google.cloud.recaptchaenterprise.v1.IAssessment;

describe('validateReCaptcha hook', () => {
  describe('isReCaptchaProtectedRoute()', () => {
    let payload: Payload;
    beforeEach(async () => {
      payload = await appGetPayload();
    });
    const mockReqWithHeaders = (headers: Headers): PayloadRequest => {
      return { payload, headers } as PayloadRequest;
    };

    test('isReCaptchaProtectedRoute() should proceed for /account routes', () => {
      const headers = new Headers({ referer: urlForAccount('create') });
      const req = mockReqWithHeaders(headers);
      expect(isReCaptchaProtectedRoute(req)).toBe(true);
    });
    test('isReCaptchaProtectedRoute() should NOT proceed for non-protected routes', () => {
      const headers = new Headers({ referer: 'http://some.host' });
      const req = mockReqWithHeaders(headers);
      expect(isReCaptchaProtectedRoute(req)).toBe(false);
    });
  });

  describe('expectReCaptchaData()', () => {
    test('should throw error if ReCaptcha token is missing', () => {
      expect(() => expectReCaptchaData({ reCaptchaToken: 'some.recaptcha.token' })).not.toThrow();
      expect(() => expectReCaptchaData({})).toThrow(/Invalid ReCaptcha token received/);
    });
  });

  test('should pass when score >= 0.5', () => {
    const assessmentRes: IAssessment = {
      riskAnalysis: { score: 0.5 },
      tokenProperties: { valid: true },
    };
    expect(() => interpretReCaptchaResults(assessmentRes)).not.toThrow();
    expect(interpretReCaptchaResults(assessmentRes)).toBe(0.5);
  });

  test('should NOT pass when score less than 0.5', () => {
    const assessmentRes: IAssessment = {
      riskAnalysis: {
        score: 0.49,
      },
      tokenProperties: { valid: true },
    };
    expect(() => interpretReCaptchaResults(assessmentRes)).toThrowError(
      /this action as suspicious/,
    );
    expect(() => interpretReCaptchaResults(assessmentRes)).toThrowError(/reason: Unknown Reason/);
  });

  test('should NOT pass when score less than 0.5 and give reason', () => {
    const assessmentRes: IAssessment = {
      riskAnalysis: {
        extendedVerdictReasons: ['AUTOMATION'],
        score: 0.123,
      },
      tokenProperties: { valid: true },
    };
    expect(() => interpretReCaptchaResults(assessmentRes)).toThrowError(
      /this action as suspicious/,
    );
    expect(() => interpretReCaptchaResults(assessmentRes)).toThrowError(/reason: AUTOMATION/);
  });

  test('should throw for invalid ReCaptcha token', () => {
    const assessmentRes: IAssessment = {
      tokenProperties: {
        valid: false,
        invalidReason: 'EXPIRED',
      },
    };
    expect(() => interpretReCaptchaResults(assessmentRes)).toThrowError(
      /could not confirm you're human/,
    );
    expect(() => interpretReCaptchaResults(assessmentRes)).toThrowError(/reason: EXPIRED/);
  });
});
