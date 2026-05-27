import type { LogEntry } from './types'

/**
 * The {@link formatTimestamp} helper
 * @description Returns the current time as an ISO-8601 string
 * @returns {string} The formatted timestamp
 */
export function formatTimestamp(): string {
  return new Date().toISOString()
}

/**
 * The {@link formatLogEntry} helper
 * @description Serialises a {@link LogEntry} into a single human-readable string
 * @param {LogEntry} entry - The log entry to format
 * @param {boolean} includeStack - Whether the error stack trace should be appended when available
 * @returns {string} The formatted log line
 */
export function formatLogEntry(entry: LogEntry, includeStack: boolean): string {
  // Destructure the entry into local bindings for readability
  const { timestamp, level, message, context, error, metadata } = entry

  // Start with the timestamp and the uppercased level
  let logMessage = `[${timestamp}] ${level.toUpperCase()}`

  // Append the scope tag when present
  if (context) {
    logMessage += ` [${context}]`
  }

  // Append the primary message
  logMessage += `: ${message}`

  // Append the error details when an Error instance was provided
  if (error) {
    logMessage += `\nError: ${error.message}`

    // Only include the stack trace when explicitly requested and available
    if (includeStack && error.stack) {
      logMessage += `\nStack: ${error.stack}`
    }
  }

  // Append metadata serialised as pretty JSON when present
  if (metadata && Object.keys(metadata).length > 0) {
    logMessage += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`
  }

  // Return the fully assembled log line
  return logMessage
}
