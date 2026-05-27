/**
 * The {@link LOG_LEVEL} constant
 * @description Numeric severity rankings, lowest value is highest priority
 */
export const LOG_LEVEL = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
} as const

/**
 * The {@link LOG_LEVEL_NAME} constant
 * @description Lowercase string labels used when serialising log entries
 */
export const LOG_LEVEL_NAME = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const

/**
 * The {@link LOG_CONTEXT} constant
 * @description Canonical scope tags attached to scoped log entries
 */
export const LOG_CONTEXT = {
  DATABASE: 'DATABASE',
  API: 'API',
  PAYMENT: 'PAYMENT',
} as const

/**
 * The {@link NODE_ENV} constant
 * @description Recognised Node.js environment values consulted by the logger
 */
export const NODE_ENV = {
  DEVELOPMENT: 'development',
} as const
