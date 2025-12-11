import { protos } from '@google-cloud/recaptcha-enterprise';
import type { CollectionBeforeChangeHook, PayloadRequest } from 'payload';

import { getReCaptchaClient } from '@/lib/google/recaptcha-client';
import { ReCaptchaFormData } from '@/lib/google/recaptcha-types';
import { urlForAccount } from '@/lib/urls';
import { UserDto } from '@/payload/app-types';

import ReCaptchaEvent = protos.google.cloud.recaptchaenterprise.v1.IEvent;
import IAssessment = protos.google.cloud.recaptchaenterprise.v1.IAssessment;

type ReCaptchaHook = CollectionBeforeChangeHook<UserDto & ReCaptchaFormData>;

export const validateReCaptchaHook: ReCaptchaHook = async ({
  data,
  req,
  operation,
}): Promise<UserDto> => {
  if (!(operation === 'create' && isReCaptchaProtectedRoute(req))) {
    return data as UserDto;
  }
  const logger = req.payload.logger;

  expectReCaptchaData(data);
  const { reCaptchaClient, projectPath } = await getReCaptchaClient();
  const event: ReCaptchaEvent = {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',
    token: data.reCaptchaToken,
    expectedAction: data.reCaptchaAction,
    userAgent: req.headers.get('user-agent'),
    userIpAddress: req.headers.get('x-forwarded-for'),
    requestedUri: req.headers.get('referer'),
  };
  const [assessmentResult] = await reCaptchaClient.createAssessment({
    parent: projectPath,
    assessment: { event, accountVerification: { username: data.email } },
  });
  logger.info(`ReCaptcha ${data.reCaptchaAction} for ${data.email}`);
  logger.info(
    `\ttokenValid:${assessmentResult.tokenProperties?.valid} score:${assessmentResult.riskAnalysis?.score}`,
  );
  interpretReCaptchaResults(assessmentResult);

  // Remove the reCAPTCHA props from the data
  delete data.reCaptchaAction;
  delete data.reCaptchaToken;
  return data as UserDto;
};

export function isReCaptchaProtectedRoute(req: PayloadRequest): boolean {
  const logger = req.payload.logger;
  const requestFrom = req.headers.get('referer');
  if (requestFrom?.includes(urlForAccount())) {
    logger.info('ReCaptcha: PROCEED, request originating from ' + requestFrom);
    return true;
  }
  logger.info('ReCaptcha: SKIP, request originating from non-protected route.');
  return false;
}

export function expectReCaptchaData(formData: Partial<ReCaptchaFormData>): void {
  if (!formData.reCaptchaToken) {
    throw new Error(`Invalid ReCaptcha token received. Reload the page and try again.`);
  }
}

export function interpretReCaptchaResults(assessmentRes: IAssessment): number {
  if (assessmentRes?.tokenProperties?.valid) {
    const score = assessmentRes.riskAnalysis?.score ?? 0;
    if (score >= 0.5) {
      return score;
    } else {
      const reasons = [...(assessmentRes.riskAnalysis?.extendedVerdictReasons ?? [])];
      const reasonStr = reasons.length ? reasons.join(', ') : 'Unknown Reason';
      throw new Error(
        `Our ReCaptcha flagged this action as suspicious (reason: ${reasonStr}). If you believe this is a mistake, reload the page and try again.`,
      );
    }
  } else {
    throw new Error(
      `Our ReCaptcha could not confirm you're human (reason: ${assessmentRes.tokenProperties?.invalidReason}). If this is a mistake, reload the page and try again.`,
    );
  }
}
