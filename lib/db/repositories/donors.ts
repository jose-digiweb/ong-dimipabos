import { and, desc, eq, like } from 'drizzle-orm'
import { donations, donorPreferences, donors } from '../schema'
import type { Donor, DonorPreferences, NewDonor, NewDonorPreferences } from '../schema'
import { BaseRepository } from './base'

export class DonorRepository extends BaseRepository<typeof donors> {
	constructor() {
		super(donors)
	}

	/**
	 * Create a new donor
	 */
	create(donorData: NewDonor): Promise<Donor> {
		return this.executeQuery('create donor', async () => {
			const [donor] = await this.db.insert(this.table).values(donorData).returning()

			return donor
		})
	}

	/**
	 * Find donor by ID
	 */
	findById(id: string): Promise<Donor | null> {
		return this.executeQuery('find donor by ID', async () => {
			const [donor] = await this.db.select().from(this.table).where(eq(this.table.id, id)).limit(1)

			return donor || null
		})
	}

	/**
	 * Find donor by email
	 */
	async findByEmail(email: string): Promise<Donor | null> {
		return await this.executeQuery('find donor by email', async () => {
			const [donor] = await this.db
				.select()
				.from(this.table)
				.where(eq(this.table.email, email))
				.limit(1)

			return donor || null
		})
	}

	/**
	 * Find donor by Stripe customer ID
	 */
	findByStripeCustomerId(stripeCustomerId: string): Promise<Donor | null> {
		return this.executeQuery('find donor by Stripe customer ID', async () => {
			const [donor] = await this.db
				.select()
				.from(this.table)
				.where(eq(this.table.stripeCustomerId, stripeCustomerId))
				.limit(1)

			return donor || null
		})
	}

	/**
	 * Update donor information
	 */
	update(id: string, updates: Partial<NewDonor>): Promise<Donor> {
		return this.executeQuery('update donor', async () => {
			const [donor] = await this.db
				.update(this.table)
				.set({ ...updates, updatedAt: new Date() })
				.where(eq(this.table.id, id))
				.returning()

			if (!donor) {
				throw new Error('Donor not found')
			}

			return donor
		})
	}

	/**
	 * Get donor with their donation statistics
	 */
	getDonorWithStats(id: string) {
		return this.executeQuery('get donor with stats', async () => {
			const donor = await this.findById(id)
			if (!donor) {
				return null
			}

			const donorDonations = await this.db
				.select()
				.from(donations)
				.where(and(eq(donations.donorId, id), eq(donations.status, 'succeeded')))
				.orderBy(desc(donations.createdAt))

			const totalDonated = donorDonations.reduce((sum, donation) => sum + donation.amount, 0)
			const donationCount = donorDonations.length
			const lastDonation = donorDonations[0]?.createdAt || null
			const isRecurringDonor = donorDonations.some((d) => d.isRecurring)

			return {
				donor,
				donations: donorDonations,
				stats: {
					totalDonated,
					donationCount,
					lastDonation,
					isRecurringDonor,
				},
			}
		})
	}

	/**
	 * Search donors by name or email
	 */
	search(query: string, limit = 20, offset = 0) {
		return this.executeQuery('search donors', async () => {
			const searchTerm = `%${query}%`

			return await this.db
				.select()
				.from(this.table)
				.where(
					and(
						like(this.table.firstName, searchTerm),
						like(this.table.lastName, searchTerm),
						like(this.table.email, searchTerm),
					),
				)
				.limit(limit)
				.offset(offset)
				.orderBy(desc(this.table.createdAt))
		})
	}

	/**
	 * Get donor preferences
	 */
	getPreferences(donorId: string): Promise<DonorPreferences | null> {
		return this.executeQuery('get donor preferences', async () => {
			const [preferences] = await this.db
				.select()
				.from(donorPreferences)
				.where(eq(donorPreferences.donorId, donorId))
				.limit(1)

			return preferences || null
		})
	}

	/**
	 * Update or create donor preferences
	 */
	updatePreferences(
		donorId: string,
		prefs: Partial<NewDonorPreferences>,
	): Promise<DonorPreferences> {
		return this.executeQuery('update donor preferences', async () => {
			const existing = await this.getPreferences(donorId)

			if (existing) {
				const [updated] = await this.db
					.update(donorPreferences)
					.set({ ...prefs, updatedAt: new Date() })
					.where(eq(donorPreferences.donorId, donorId))
					.returning()

				return updated
			}
			const [created] = await this.db
				.insert(donorPreferences)
				.values({ donorId, ...prefs })
				.returning()

			return created
		})
	}

	/**
	 * Get all donors with email opt-in for newsletters
	 */
	getNewsletterSubscribers() {
		return this.executeQuery('get newsletter subscribers', async () => {
			return await this.db
				.select({
					id: this.table.id,
					email: this.table.email,
					firstName: this.table.firstName,
					lastName: this.table.lastName,
				})
				.from(this.table)
				.innerJoin(donorPreferences, eq(this.table.id, donorPreferences.donorId))
				.where(and(eq(this.table.emailOptIn, true), eq(donorPreferences.emailNewsletter, true)))
		})
	}

	/**
	 * Delete donor and all related data (GDPR compliance)
	 */
	delete(id: string): Promise<void> {
		return this.executeQuery('delete donor', async () => {
			// First delete preferences
			await this.db.delete(donorPreferences).where(eq(donorPreferences.donorId, id))

			// Then delete the donor (donations will be kept for accounting but anonymized)
			await this.db.delete(this.table).where(eq(this.table.id, id))
		})
	}
}
