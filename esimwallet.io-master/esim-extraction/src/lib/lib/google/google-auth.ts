/**
 * Get Google Service Account API key, to authenticate against Google Cloud services
 * (like ReCaptcha, for instance)
 */
export function getGoogleApiCredentials(): JWTInput {
  const googleApiKey: JWTInput = JSON.parse(
    process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON_API_KEY || '{}',
  );
  if (!googleApiKey || !googleApiKey.private_key || !googleApiKey.project_id) {
    throw Error('Google API key is missing. Did you forget to set up the .env variables?');
  }

  return googleApiKey;
}

export interface JWTInput {
  type: string;
  client_email: string;
  private_key: string;
  private_key_id: string;
  project_id: string;
  client_id: string;
  client_secret: string;
}
