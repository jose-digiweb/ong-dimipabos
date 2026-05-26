import type { SQLiteTable } from 'drizzle-orm/sqlite-core'
import { logger } from '../../logger'
import { getDb } from '../index'

export abstract class BaseRepository<T extends SQLiteTable> {
	protected table: T

	constructor(table: T) {
		this.table = table
	}

	protected get db() {
		return getDb()
	}

	protected handleError(error: Error, operation: string): never {
		logger.error(`Database error in ${operation}:`, '', error)

		if (error instanceof Error) {
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

	protected async executeQuery<R>(operation: string, query: () => Promise<R>): Promise<R> {
		try {
			return await query()
		} catch (error) {
			this.handleError(error as Error, operation)
		}
	}
}
