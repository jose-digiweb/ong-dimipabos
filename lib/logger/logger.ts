import { LOG_CONTEXT, LOG_LEVEL, LOG_LEVEL_NAME, NODE_ENV } from './constants'
import { formatLogEntry, formatTimestamp } from './helpers'
import type { LogContext, LogEntry, LogLevel, LogMetadata } from './types'

/**
 * The {@link Logger} class
 * @description Application logger emitting structured entries with environment-aware verbosity
 */
class Logger {
  private logLevel: LogLevel
  private isDevelopment: boolean

  /**
   * @description Initialises the logger using the current `NODE_ENV` to pick a verbosity floor
   */
  constructor() {
    // Capture whether we are running in development mode
    this.isDevelopment = process.env.NODE_ENV === NODE_ENV.DEVELOPMENT

    // Use a verbose floor in development and a quieter floor in production
    this.logLevel = this.isDevelopment ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO
  }

  /**
   * @description Returns true when the supplied level should be emitted under the current floor
   * @param {LogLevel} level - The candidate level
   * @returns {boolean} Whether the level passes the verbosity gate
   */
  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  /**
   * @description Writes a single entry to the underlying transport
   * @param {LogEntry} entry - The entry to write
   */
  private writeLog(entry: LogEntry): void {
    // Pre-format the entry for downstream transports
    const _formattedMessage = formatLogEntry(entry, this.isDevelopment)

    // In development, fan out to the appropriate console method (no-op transports for now)
    if (this.isDevelopment) {
      switch (entry.level) {
        case LOG_LEVEL_NAME.ERROR:
          break
        case LOG_LEVEL_NAME.WARN:
          break
        case LOG_LEVEL_NAME.INFO:
          break
        case LOG_LEVEL_NAME.DEBUG:
          break
        default:
      }
    }
  }

  /**
   * @description Emits an error-level entry
   * @param {string} message - The primary message
   * @param {string} [context] - Optional scope tag
   * @param {Error} [error] - Optional error instance to include
   * @param {LogMetadata} [metadata] - Optional structured metadata
   */
  error(message: string, context?: string, error?: Error, metadata?: LogMetadata): void {
    // Drop the entry when the level is below the floor
    if (!this.shouldLog(LOG_LEVEL.ERROR)) {
      return
    }

    // Build and dispatch the entry
    this.writeLog({
      timestamp: formatTimestamp(),
      level: LOG_LEVEL_NAME.ERROR,
      message,
      context,
      error,
      metadata,
    })
  }

  /**
   * @description Emits a warn-level entry
   * @param {string} message - The primary message
   * @param {string} [context] - Optional scope tag
   * @param {LogMetadata} [metadata] - Optional structured metadata
   */
  warn(message: string, context?: string, metadata?: LogMetadata): void {
    // Drop the entry when the level is below the floor
    if (!this.shouldLog(LOG_LEVEL.WARN)) {
      return
    }

    // Build and dispatch the entry
    this.writeLog({
      timestamp: formatTimestamp(),
      level: LOG_LEVEL_NAME.WARN,
      message,
      context,
      metadata,
    })
  }

  /**
   * @description Emits an info-level entry
   * @param {string} message - The primary message
   * @param {string} [context] - Optional scope tag
   * @param {LogMetadata} [metadata] - Optional structured metadata
   */
  info(message: string, context?: string, metadata?: LogMetadata): void {
    // Drop the entry when the level is below the floor
    if (!this.shouldLog(LOG_LEVEL.INFO)) {
      return
    }

    // Build and dispatch the entry
    this.writeLog({
      timestamp: formatTimestamp(),
      level: LOG_LEVEL_NAME.INFO,
      message,
      context,
      metadata,
    })
  }

  /**
   * @description Emits a debug-level entry
   * @param {string} message - The primary message
   * @param {string} [context] - Optional scope tag
   * @param {LogMetadata} [metadata] - Optional structured metadata
   */
  debug(message: string, context?: string, metadata?: LogMetadata): void {
    // Drop the entry when the level is below the floor
    if (!this.shouldLog(LOG_LEVEL.DEBUG)) {
      return
    }

    // Build and dispatch the entry
    this.writeLog({
      timestamp: formatTimestamp(),
      level: LOG_LEVEL_NAME.DEBUG,
      message,
      context,
      metadata,
    })
  }

  /**
   * @description Scoped logger for database operations
   */
  database = this.createScopedLogger(LOG_CONTEXT.DATABASE, 'Database operation')

  /**
   * @description Scoped logger for API operations
   */
  api = this.createScopedLogger(LOG_CONTEXT.API, 'API operation')

  /**
   * @description Scoped logger for payment operations
   */
  payment = this.createScopedLogger(LOG_CONTEXT.PAYMENT, 'Payment operation')

  /**
   * @description Builds a scoped helper object that prefixes a context tag onto every entry
   * @param {LogContext} context - The scope tag to apply
   * @param {string} subjectLabel - The label prepended to each message
   * @returns A scoped logger api object
   */
  private createScopedLogger(context: LogContext, subjectLabel: string) {
    // Return the scoped api object; arrow methods preserve the surrounding `this`
    return {
      error: (operation: string, error: Error, metadata?: LogMetadata) => {
        this.error(`${subjectLabel} failed: ${operation}`, context, error, metadata)
      },
      info: (operation: string, metadata?: LogMetadata) => {
        this.info(`${subjectLabel}: ${operation}`, context, metadata)
      },
      debug: (operation: string, metadata?: LogMetadata) => {
        this.debug(`${subjectLabel}: ${operation}`, context, metadata)
      },
    }
  }
}

/**
 * The {@link logger} singleton
 * @description Shared application logger instance
 */
export const logger = new Logger()

export type { LogContext, LogEntry, LogLevel, LogLevelName, LogMetadata } from './types'
