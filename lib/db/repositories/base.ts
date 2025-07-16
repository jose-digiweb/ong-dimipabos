import type { PgTable } from 'drizzle-orm/pg-core'
import { logger } from '../../logger'
import { db } from '../index'

/**
 * Base repository class providing common database operations
 */
export abstract class BaseRepository<T extends PgTable> {
  protected table: T
  protected db = db

  constructor(table: T) {
    this.table = table
  }

  /**
   * Handle database errors with proper logging and user-friendly messages
   */
  protected handleError(error: Error, operation: string): never {
    logger.error(`Database error in ${operation}:`, '', error)

    if (error instanceof Error) {
      // Handle specific database errors
      if (error.message.includes('unique constraint')) {
        throw new Error('A record with this information already exists')
      }
      if (error.message.includes('foreign key constraint')) {
        throw new Error('Referenced record does not exist')
      }
      if (error.message.includes('not null constraint')) {
        throw new Error('Required information is missing')
      }
    }

    throw new Error(`Failed to ${operation}. Please try again.`)
  }

  /**
   * Execute a database operation with error handling
   */
  protected async executeQuery<R>(operation: string, query: () => Promise<R>): Promise<R> {
    try {
      return await query()
    } catch (error) {
      this.handleError(error as Error, operation)
    }
  }
}
