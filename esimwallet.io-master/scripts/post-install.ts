import { getCliLogger, LoggerName } from '../src/lib/logging';

const logger = getCliLogger(LoggerName.Scripts);

logger.info(`Preparing .env file...`);
await import('./post-install/prepareEnvFile');

logger.info(`Patch node_modules/google-gax lib...`);
await import('./post-install/patchGoogleGax');
