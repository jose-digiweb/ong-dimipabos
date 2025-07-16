/**
 * Application logging utility
 * Provides structured logging with different levels and proper formatting
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string
  level: string
  message: string
  context?: string
  error?: Error
  metadata?: Record<string, unknown>
}

class Logger {
  private logLevel: LogLevel
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
  }

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, error, metadata } = entry

    let logMessage = `[${timestamp}] ${level.toUpperCase()}`

    if (context) {
      logMessage += ` [${context}]`
    }

    logMessage += `: ${message}`

    if (error) {
      logMessage += `\nError: ${error.message}`
      if (this.isDevelopment && error.stack) {
        logMessage += `\nStack: ${error.stack}`
      }
    }

    if (metadata && Object.keys(metadata).length > 0) {
      logMessage += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`
    }

    return logMessage
  }

  private writeLog(entry: LogEntry): void {
    const formattedMessage = this.formatLogEntry(entry)

    // In development, use console for immediate feedback
    if (this.isDevelopment) {
      switch (entry.level) {
        case 'error':
          console.error(formattedMessage)
          break
        case 'warn':
          console.warn(formattedMessage)
          break
        case 'info':
          console.info(formattedMessage)
          break
        case 'debug':
          console.debug(formattedMessage)
          break
        default:
          console.log(formattedMessage)
      }
    } else {
      // In production, you might want to send logs to a service like:
      // - Winston with file transport
      // - Datadog
      // - CloudWatch
      // - Sentry
      // For now, we'll use console but this can be replaced
      console.log(formattedMessage)
    }
  }

  error(
    message: string,
    context?: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(LogLevel.ERROR)) return

    this.writeLog({
      timestamp: this.formatTimestamp(),
      level: 'error',
      message,
      context,
      error,
      metadata,
    })
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return

    this.writeLog({
      timestamp: this.formatTimestamp(),
      level: 'warn',
      message,
      context,
      metadata,
    })
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return

    this.writeLog({
      timestamp: this.formatTimestamp(),
      level: 'info',
      message,
      context,
      metadata,
    })
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return

    this.writeLog({
      timestamp: this.formatTimestamp(),
      level: 'debug',
      message,
      context,
      metadata,
    })
  }

  /**
   * Database-specific logging methods
   */
  database = {
    error: (operation: string, error: Error, metadata?: Record<string, unknown>) => {
      this.error(`Database operation failed: ${operation}`, 'DATABASE', error, metadata)
    },

    info: (operation: string, metadata?: Record<string, unknown>) => {
      this.info(`Database operation: ${operation}`, 'DATABASE', metadata)
    },

    debug: (operation: string, metadata?: Record<string, unknown>) => {
      this.debug(`Database operation: ${operation}`, 'DATABASE', metadata)
    },
  }

  /**
   * API-specific logging methods
   */
  api = {
    error: (endpoint: string, error: Error, metadata?: Record<string, unknown>) => {
      this.error(`API error: ${endpoint}`, 'API', error, metadata)
    },

    info: (endpoint: string, method: string, metadata?: Record<string, unknown>) => {
      this.info(`${method} ${endpoint}`, 'API', metadata)
    },

    debug: (endpoint: string, method: string, metadata?: Record<string, unknown>) => {
      this.debug(`${method} ${endpoint}`, 'API', metadata)
    },
  }

  /**
   * Payment-specific logging methods
   */
  payment = {
    error: (operation: string, error: Error, metadata?: Record<string, unknown>) => {
      this.error(`Payment error: ${operation}`, 'PAYMENT', error, metadata)
    },

    info: (operation: string, metadata?: Record<string, unknown>) => {
      this.info(`Payment operation: ${operation}`, 'PAYMENT', metadata)
    },

    debug: (operation: string, metadata?: Record<string, unknown>) => {
      this.debug(`Payment operation: ${operation}`, 'PAYMENT', metadata)
    },
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types for external use
export type { LogEntry }
