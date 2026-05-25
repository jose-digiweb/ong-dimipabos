import { and, count, desc, eq, gte, lte, sql, sum } from 'drizzle-orm'
import { donations, donors } from '../schema'
import type { Donation, NewDonation } from '../schema'
import { BaseRepository } from './base'

export class DonationRepository extends BaseRepository<typeof donations> {
	constructor() {
		super(donations)
	}

	/**
	 * Create a new donation
	 */
	async create(donationData: NewDonation): Promise<Donation> {
		return await this.executeQuery('create donation', async () => {
			const [donation] = await this.db.insert(this.table).values(donationData).returning()

			return donation
		})
	}

	/**
	 * Find donation by ID
	 */
	async findById(id: string): Promise<Donation | null> {
		return await this.executeQuery('find donation by ID', async () => {
			const [donation] = await this.db.select().from(this.table).where(eq(this.table.id, id)).limit(1)

			return donation || null
		})
	}

	/**
	 * Find donation by Stripe Payment Intent ID
	 */
	findByStripePaymentIntentId(paymentIntentId: string): Promise<Donation | null> {
		return this.executeQuery('find donation by Stripe Payment Intent ID', async () => {
			const [donation] = await this.db
				.select()
				.from(this.table)
				.where(eq(this.table.stripePaymentIntentId, paymentIntentId))
				.limit(1)

			return donation || null
		})
	}

	/**
	 * Update donation status
	 */
	async updateStatus(
		id: string,
		status: string,
		metadata?: Record<string, unknown>,
	): Promise<Donation> {
		return await this.executeQuery('update donation status', async () => {
			const updateData: Partial<NewDonation> = {
				status,
				updatedAt: new Date(),
			}

			if (metadata) {
				updateData.metadata = metadata
			}

			const [donation] = await this.db
				.update(this.table)
				.set(updateData)
				.where(eq(this.table.id, id))
				.returning()

			if (!donation) {
				throw new Error('Donation not found')
			}

			return donation
		})
	}

	/**
	 * Get donations by donor ID
	 */
	getByDonorId(donorId: string, limit = 50, offset = 0): Promise<Donation[]> {
		return this.executeQuery('get donations by donor ID', async () => {
			return await this.db
				.select()
				.from(this.table)
				.where(eq(this.table.donorId, donorId))
				.orderBy(desc(this.table.createdAt))
				.limit(limit)
				.offset(offset)
		})
	}

	/**
	 * Get recent donations with donor information
	 */
	getRecentWithDonors(limit = 20) {
		return this.executeQuery('get recent donations with donors', async () => {
			return await this.db
				.select({
					donation: this.table,
					donor: {
						id: donors.id,
						firstName: donors.firstName,
						lastName: donors.lastName,
						email: donors.email,
					},
				})
				.from(this.table)
				.innerJoin(donors, eq(this.table.donorId, donors.id))
				.where(eq(this.table.status, 'succeeded'))
				.orderBy(desc(this.table.createdAt))
				.limit(limit)
		})
	}

	/**
	 * Get donation statistics for a date range
	 */
	getStatistics(startDate?: Date, endDate?: Date) {
		return this.executeQuery('get donation statistics', async () => {
			const conditions = [eq(this.table.status, 'succeeded')]

			if (startDate && endDate) {
				conditions.push(gte(this.table.createdAt, startDate))
				conditions.push(lte(this.table.createdAt, endDate))
			}

			const query = this.db
				.select({
					totalAmount: sum(this.table.amount),
					totalCount: count(this.table.id),
					avgAmount: sql<number>`AVG(${this.table.amount})`,
				})
				.from(this.table)
				.where(and(...conditions))

			const [stats] = await query

			return {
				totalAmount: Number(stats.totalAmount) || 0,
				totalCount: Number(stats.totalCount) || 0,
				avgAmount: Number(stats.avgAmount) || 0,
			}
		})
	}

	/**
	 * Get monthly donation statistics for the current year
	 */
	getMonthlyStats(year?: number) {
		return this.executeQuery('get monthly donation statistics', async () => {
			const currentYear = year || new Date().getFullYear()
			const startDate = new Date(currentYear, 0, 1)
			const endDate = new Date(currentYear, 11, 31)

			return await this.db
				.select({
					month: sql<number>`EXTRACT(MONTH FROM ${this.table.createdAt})`,
					totalAmount: sum(this.table.amount),
					totalCount: count(this.table.id),
				})
				.from(this.table)
				.where(
					and(
						eq(this.table.status, 'succeeded'),
						gte(this.table.createdAt, startDate),
						lte(this.table.createdAt, endDate),
					),
				)
				.groupBy(sql`EXTRACT(MONTH FROM ${this.table.createdAt})`)
				.orderBy(sql`EXTRACT(MONTH FROM ${this.table.createdAt})`)
		})
	}

	/**
	 * Get donations by campaign
	 */
	getByCampaignId(campaignId: string, limit = 100, offset = 0) {
		return this.executeQuery('get donations by campaign', async () => {
			return await this.db
				.select({
					donation: this.table,
					donor: {
						firstName: donors.firstName,
						lastName: donors.lastName,
						email: donors.email,
					},
				})
				.from(this.table)
				.innerJoin(donors, eq(this.table.donorId, donors.id))
				.where(and(eq(this.table.campaignId, campaignId), eq(this.table.status, 'succeeded')))
				.orderBy(desc(this.table.createdAt))
				.limit(limit)
				.offset(offset)
		})
	}

	/**
	 * Get recurring donations (subscriptions)
	 */
	getRecurringDonations(limit = 50, offset = 0) {
		return this.executeQuery('get recurring donations', async () => {
			return await this.db
				.select({
					donation: this.table,
					donor: {
						id: donors.id,
						firstName: donors.firstName,
						lastName: donors.lastName,
						email: donors.email,
					},
				})
				.from(this.table)
				.innerJoin(donors, eq(this.table.donorId, donors.id))
				.where(and(eq(this.table.isRecurring, true), eq(this.table.status, 'succeeded')))
				.orderBy(desc(this.table.createdAt))
				.limit(limit)
				.offset(offset)
		})
	}

	/**
	 * Get top donors by total donation amount
	 */
	getTopDonors(limit = 10) {
		return this.executeQuery('get top donors', async () => {
			return await this.db
				.select({
					donor: {
						id: donors.id,
						firstName: donors.firstName,
						lastName: donors.lastName,
						email: donors.email,
					},
					totalAmount: sum(this.table.amount),
					donationCount: count(this.table.id),
				})
				.from(this.table)
				.innerJoin(donors, eq(this.table.donorId, donors.id))
				.where(eq(this.table.status, 'succeeded'))
				.groupBy(donors.id, donors.firstName, donors.lastName, donors.email)
				.orderBy(desc(sum(this.table.amount)))
				.limit(limit)
		})
	}

	/**
	 * Search donations by donor name or email
	 */
	searchByDonor(query: string, limit = 20, offset = 0) {
		return this.executeQuery('search donations by donor', async () => {
			const searchTerm = `%${query}%`

			return await this.db
				.select({
					donation: this.table,
					donor: {
						firstName: donors.firstName,
						lastName: donors.lastName,
						email: donors.email,
					},
				})
				.from(this.table)
				.innerJoin(donors, eq(this.table.donorId, donors.id))
				.where(
					and(
						sql`CONCAT(${donors.firstName}, ' ', ${donors.lastName}) ILIKE ${searchTerm}`,
						sql`${donors.email} ILIKE ${searchTerm}`,
					),
				)
				.orderBy(desc(this.table.createdAt))
				.limit(limit)
				.offset(offset)
		})
	}

	/**
	 * Get failed donations for retry processing
	 */
	getFailedDonations(limit = 50) {
		return this.executeQuery('get failed donations', async () => {
			return await this.db
				.select({
					donation: this.table,
					donor: {
						firstName: donors.firstName,
						lastName: donors.lastName,
						email: donors.email,
					},
				})
				.from(this.table)
				.innerJoin(donors, eq(this.table.donorId, donors.id))
				.where(eq(this.table.status, 'failed'))
				.orderBy(desc(this.table.createdAt))
				.limit(limit)
		})
	}
}
