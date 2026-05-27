import type { LOG_CONTEXT, LOG_LEVEL, LOG_LEVEL_NAME } from './constants'

/**
 * The {@link LogLevel} type
 * @description Union of the numeric log level values
 */
export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL]

/**
 * The {@link LogLevelName} type
 * @description Union of the string log level labels
 */
export type LogLevelName = (typeof LOG_LEVEL_NAME)[keyof typeof LOG_LEVEL_NAME]

/**
 * The {@link LogContext} type
 * @description Union of the canonical log scope tags
 */
export type LogContext = (typeof LOG_CONTEXT)[keyof typeof LOG_CONTEXT]

/**
 * The {@link LogMetadata} type
 * @description Arbitrary structured key/value pairs attached to a log entry
 */
export type LogMetadata = Record<string, unknown>

/**
 * The {@link LogEntry} type
 * @description A single structured log line before formatting
 */
export type LogEntry = {
  timestamp: string
  level: LogLevelName
  message: string
  context?: string
  error?: Error
  metadata?: LogMetadata
}
