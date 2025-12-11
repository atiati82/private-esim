import { BaseLogger, Level, pino, TransportTargetOptions } from 'pino';
import { PrettyOptions } from 'pino-pretty';

import { isProduction, isTestingEnv } from '@/env-helpers';

/**
 * Application logger areas, to use in `getCliLogger(name)`
 */
export enum LoggerName {
  App = 'APP',
  DestinationsImport = 'DESTINATIONS',
  MobiMatterProvidersImport = 'MM PROVIDERS',
  MobiMatterProductsImport = 'MM PRODUCTS',
  Scripts = 'SCRIPTS',
  DataImport = 'DATA IMPORT',
}

/**
 * Configure logging levels for loggers
 */
export const AppLogLevels: Record<LoggerName, Level> = {
  [LoggerName.App]: isTestingEnv ? 'fatal' : 'info',
  [LoggerName.DestinationsImport]: isTestingEnv ? 'fatal' : 'info',
  [LoggerName.MobiMatterProvidersImport]: isTestingEnv ? 'fatal' : 'info',
  [LoggerName.MobiMatterProductsImport]: isTestingEnv ? 'fatal' : 'info',
  [LoggerName.Scripts]: isTestingEnv ? 'fatal' : 'info',
  [LoggerName.DataImport]: isTestingEnv ? 'fatal' : 'info',
};

/**
 * Handy logger to use in CLI, with pretty formatter
 */
export function getCliLogger(name: LoggerName = LoggerName.App): BaseLogger {
  const level = AppLogLevels[name] ?? AppLogLevels[LoggerName.App];
  const transport: TransportTargetOptions | undefined = isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: <PrettyOptions>{ colorize: true, sync: true },
      };

  if (!_loggers.has(name)) {
    _loggers.set(name, pino({ name, level, transport }));
  }
  return _loggers.get(name)!;
}
const _loggers = new Map<LoggerName, BaseLogger>();
