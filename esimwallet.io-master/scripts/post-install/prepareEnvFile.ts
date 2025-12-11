import * as fs from 'fs';
import { execa } from 'execa';

import { getCliLogger, LoggerName } from '../../src/lib/logging';

const logger = getCliLogger(LoggerName.Scripts);

//
// Prepare .env file, copy it from .env.example
//
const envFileExists = fs.existsSync('.env');
if (envFileExists) {
  logger.info(`\t.env file already exists, all good.`);
} else {
  await execa`cp -n .env.example .env`;
  logger.info(`\t.env file prepared. Remember to edit env variables according to your needs.`);
}
