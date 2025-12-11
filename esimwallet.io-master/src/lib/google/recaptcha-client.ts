import { type RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

import { getGoogleApiCredentials } from '@/lib/google/google-auth';

/**
 * Prepare (and cache) ReCaptcha client...
 */
export async function getReCaptchaClient(): Promise<{
  reCaptchaClient: RecaptchaEnterpriseServiceClient;
  projectPath: string;
}> {
  const credentials = getGoogleApiCredentials();

  if (!global._reCaptchaClient) {
    const { RecaptchaEnterpriseServiceClient: ImportedRecaptchaClient } = await import(
      '@google-cloud/recaptcha-enterprise'
    );
    global._reCaptchaClient = new ImportedRecaptchaClient({
      credentials,
      projectId: credentials.project_id,
      clientOptions: {
        projectId: credentials.project_id,
      },
    });
  }

  const projectPath = global._reCaptchaClient.projectPath(credentials.project_id);
  return { reCaptchaClient: global._reCaptchaClient, projectPath };
}

/* eslint-disable no-var */
declare global {
  var _reCaptchaClient: RecaptchaEnterpriseServiceClient | undefined;
}
