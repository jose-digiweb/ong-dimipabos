import type { SQLiteTable } from 'drizzle-orm/sqlite-core'

import { logger } from '../../logger'
import { dbError } from '../constants'
import { getDb } from '../index'

/**
 * The {@link BaseRepository} class
 * @description Shared base class for D1-backed repositories, owns the table reference and error handling
 */
export abstract class BaseRepository<T extends SQLiteTable> {
  protected table: T

  /**
   * @description Captures the table this repository operates on
   * @param {T} table - The Drizzle SQLite table reference
   */
  constructor(table: T) {
    this.table = table
  }

  /**
   * @description Lazily resolves the per-request Drizzle client
   */
  protected get db() {
    return getDb()
  }

  /**
   * @description Translates low-level database errors into user-facing messages and rethrows
   * @param {Error} error - The original error thrown by the underlying driver
   * @param {string} operation - A short human-readable label for the failed operation
   * @returns {never} Always throws; declared as `never` to satisfy the type checker
   */
  protected handleError(error: Error, operation: string): never {
    // Log the original error against the database scope
    logger.error(`Database error in ${operation}:`, '', error)

    // Map well-known driver error messages to dedicated user-facing errors
    if (error instanceof Error) {
      if (error.message.includes(dbError.UNIQUE_CONSTRAINT_MATCH)) {
        throw new Error(dbError.UNIQUE_CONSTRAINT_MESSAGE)
      }
      if (error.message.includes(dbError.FOREIGN_KEY_CONSTRAINT_MATCH)) {
        throw new Error(dbError.FOREIGN_KEY_MESSAGE)
      }
      if (error.message.includes(dbError.NOT_NULL_CONSTRAINT_MATCH)) {
        throw new Error(dbError.NOT_NULL_MESSAGE)
      }
    }

    // Fall back to a generic error mentioning the operation label
    throw new Error(`${dbError.GENERIC_PREFIX} ${operation}${dbError.GENERIC_SUFFIX}`)
  }

  /**
   * @description Runs a query callback and routes any thrown error through {@link handleError}
   * @param {string} operation - A short human-readable label for the operation
   * @param {() => Promise<R>} query - The query callback to execute
   * @returns {Promise<R>} The resolved value of the query callback
   */
  protected async executeQuery<R>(operation: string, query: () => Promise<R>): Promise<R> {
    // Try the query and translate any failure into a typed user-facing error
    try {
      return await query()
    } catch (error) {
      this.handleError(error as Error, operation)
    }
  }
}
