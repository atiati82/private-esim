import { http, RequestHandler } from 'msw';

export const ignoredPayloadRequests: RequestHandler[] = [
  http.all(/telemetry.payloadcms.com/, () => {}),
];
