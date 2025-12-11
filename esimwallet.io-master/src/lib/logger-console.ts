/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Get simple console logging, suitable for NextJS server-side and for browser
 */
export const getConsoleLogger = (prefixLabel: string, opts: Partial<AppConsoleLoggerOpts> = {}) => {
  const label = `[${prefixLabel}]`;
  const on = opts.enableLogging ?? true;
  const sep = opts.separator ?? ' ';
  return {
    log: (msg: string, ...extras: any[]) => on && console.log(`${label}:${sep}${msg}`, ...extras),
    info: (msg: string, ...extras: any[]) => on && console.info(`${label}:${sep}${msg}`, ...extras),
    warn: (msg: string, ...extras: any[]) =>
      on && console.warn(`${label} WARN:${sep}${msg}`, ...extras),
    error: (msg: string, ...extras: any[]) =>
      on && console.error(`${label} ERROR:${sep}${msg}`, ...extras),
  };
};

export type AppConsoleLogger = ReturnType<typeof getConsoleLogger>;

export type AppConsoleLoggerOpts = {
  /**
   * Enable or completely disable logger (e.g. in TESTING environment)
   */
  enableLogging?: boolean;

  /**
   * Prefix vs log content separator.
   * Can be a space (default) or e.g. new line (\n).
   */
  separator: string;
};
