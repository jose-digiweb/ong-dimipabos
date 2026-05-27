import { and, count, desc, eq, gte, lte, sql, sum } from 'drizzle-orm'

import { dbError, donationStatus } from '../constants'
import { type Donation, type NewDonation, donations, donors } from '../schema'
import { BaseRepository } from './base'

/**
 * The {@link donationOperation} constant
 * @description Human-readable operation labels for the donation repository
 */
const donationOperation = {
  CREATE: 'create donation',
  FIND_BY_ID: 'find donation by ID',
  FIND_BY_PAYMENT_INTENT: 'find donation by Stripe Payment Intent ID',
  UPDATE_STATUS: 'update donation status',
  GET_BY_DONOR: 'get donations by donor ID',
  GET_RECENT_WITH_DONORS: 'get recent donations with donors',
  GET_STATISTICS: 'get donation statistics',
  GET_MONTHLY_STATS: 'get monthly donation statistics',
  GET_BY_CAMPAIGN: 'get donations by campaign',
  GET_RECURRING: 'get recurring donations',
  GET_TOP_DONORS: 'get top donors',
  SEARCH_BY_DONOR: 'search donations by donor',
  GET_FAILED: 'get failed donations',
} as const

/**
 * The {@link DEFAULT_RECENT_LIMIT} constant
 * @description Default page size for the recent-donations listing
 */
const DEFAULT_RECENT_LIMIT = 20

/**
 * The {@link DEFAULT_PAGE_LIMIT} constant
 * @description Default page size for generic donation listings
 */
const DEFAULT_PAGE_LIMIT = 50

/**
 * The {@link DEFAULT_CAMPAIGN_LIMIT} constant
 * @description Default page size for campaign-scoped donation listings
 */
const DEFAULT_CAMPAIGN_LIMIT = 100

/**
 * The {@link DEFAULT_TOP_DONORS_LIMIT} constant
 * @description Default page size for top-donor leaderboards
 */
const DEFAULT_TOP_DONORS_LIMIT = 10

/**
 * The {@link MONTH_OF_YEAR_RANGE} constant
 * @description Calendar boundaries used by {@link DonationRepository.getMonthlyStats}
 */
const MONTH_OF_YEAR_RANGE = {
  FIRST_MONTH_INDEX: 0,
  LAST_MONTH_INDEX: 11,
  FIRST_DAY_OF_MONTH: 1,
  LAST_DAY_OF_DECEMBER: 31,
} as const

/**
 * The {@link DonationRepository} class
 * @description Repository exposing CRUD and aggregation queries over the donations table
 */
export class DonationRepository extends BaseRepository<typeof donations> {
  /**
   * @description Binds the repository to the donations table
   */
  constructor() {
    super(donations)
  }

  /**
   * @description Creates a new donation row
   * @param {NewDonation} donationData - The donation fields to insert
   * @returns {Promise<Donation>} The created donation
   */
  async create(donationData: NewDonation): Promise<Donation> {
    // Defer to executeQuery so any error is normalised
    return await this.executeQuery(donationOperation.CREATE, async () => {
      // Insert and return the new row
      const [donation] = await this.db.insert(this.table).values(donationData).returning()

      // Return the inserted donation
      return donation
    })
  }

  /**
   * @description Looks up a donation by primary key
   * @param {string} id - The donation id
   * @returns {Promise<Donation | null>} The donation or null when none matches
   */
  async findById(id: string): Promise<Donation | null> {
    // Defer to executeQuery so any error is normalised
    return await this.executeQuery(donationOperation.FIND_BY_ID, async () => {
      // Select the first row matching the id
      const [donation] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id))
        .limit(1)

      // Return the donation or null when no row was found
      return donation || null
    })
  }

  /**
   * @description Looks up a donation by Stripe Payment Intent id
   * @param {string} paymentIntentId - The Stripe Payment Intent id
   * @returns {Promise<Donation | null>} The donation or null when none matches
   */
  findByStripePaymentIntentId(paymentIntentId: string): Promise<Donation | null> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.FIND_BY_PAYMENT_INTENT, async () => {
      // Select the first row matching the payment intent id
      const [donation] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.stripePaymentIntentId, paymentIntentId))
        .limit(1)

      // Return the donation or null when no row was found
      return donation || null
    })
  }

  /**
   * @description Updates the status of a donation, optionally merging metadata
   * @param {string} id - The donation id
   * @param {string} status - The new status value
   * @param {Record<string, unknown>} [metadata] - Optional metadata to attach
   * @returns {Promise<Donation>} The updated donation row
   */
  async updateStatus(
    id: string,
    status: string,
    metadata?: Record<string, unknown>,
  ): Promise<Donation> {
    // Defer to executeQuery so any error is normalised
    return await this.executeQuery(donationOperation.UPDATE_STATUS, async () => {
      // Build the update payload with the new status and timestamp
      const updateData: Partial<NewDonation> = {
        status,
        updatedAt: new Date(),
      }

      // Merge metadata when supplied
      if (metadata) {
        updateData.metadata = metadata
      }

      // Apply the update and return the new state
      const [donation] = await this.db
        .update(this.table)
        .set(updateData)
        .where(eq(this.table.id, id))
        .returning()

      // Throw a typed error when no row was updated
      if (!donation) {
        throw new Error(dbError.DONATION_NOT_FOUND)
      }

      // Return the updated donation
      return donation
    })
  }

  /**
   * @description Returns a paged list of donations for a given donor, newest first
   * @param {string} donorId - The donor id
   * @param {number} [limit] - Maximum number of rows to return
   * @param {number} [offset] - Number of rows to skip
   * @returns {Promise<Donation[]>} The matching donations
   */
  getByDonorId(donorId: string, limit = DEFAULT_PAGE_LIMIT, offset = 0): Promise<Donation[]> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.GET_BY_DONOR, async () => {
      // Run the paged query for the donor
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
   * @description Returns the latest successful donations together with donor name and email
   * @param {number} [limit] - Maximum number of rows to return
   * @returns The donations with donor information
   */
  getRecentWithDonors(limit = DEFAULT_RECENT_LIMIT) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.GET_RECENT_WITH_DONORS, async () => {
      // Join donations with donor data and filter to successful entries
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
        .where(eq(this.table.status, donationStatus.SUCCEEDED))
        .orderBy(desc(this.table.createdAt))
        .limit(limit)
    })
  }

  /**
   * @description Returns aggregate donation statistics, optionally scoped to a date range
   * @param {Date} [startDate] - Inclusive lower bound for `createdAt`
   * @param {Date} [endDate] - Inclusive upper bound for `createdAt`
   * @returns The aggregate statistics
   */
  getStatistics(startDate?: Date, endDate?: Date) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.GET_STATISTICS, async () => {
      // Always filter by successful status
      const conditions = [eq(this.table.status, donationStatus.SUCCEEDED)]

      // Add the date range filter when both bounds are supplied
      if (startDate && endDate) {
        conditions.push(gte(this.table.createdAt, startDate))
        conditions.push(lte(this.table.createdAt, endDate))
      }

      // Build the aggregation query
      const query = this.db
        .select({
          totalAmount: sum(this.table.amount),
          totalCount: count(this.table.id),
          avgAmount: sql<number>`AVG(${this.table.amount})`,
        })
        .from(this.table)
        .where(and(...conditions))

      // Execute and grab the single aggregated row
      const [stats] = await query

      // Normalise the aggregates as numbers with safe fallbacks
      return {
        totalAmount: Number(stats.totalAmount) || 0,
        totalCount: Number(stats.totalCount) || 0,
        avgAmount: Number(stats.avgAmount) || 0,
      }
    })
  }

  /**
   * @description Returns per-month donation totals for a given calendar year
   * @param {number} [year] - The calendar year (defaults to the current year)
   * @returns The monthly aggregates for the year
   */
  getMonthlyStats(year?: number) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.GET_MONTHLY_STATS, async () => {
      // Default to the current calendar year
      const currentYear = year || new Date().getFullYear()

      // Compute the inclusive date range for the requested year
      const startDate = new Date(
        currentYear,
        MONTH_OF_YEAR_RANGE.FIRST_MONTH_INDEX,
        MONTH_OF_YEAR_RANGE.FIRST_DAY_OF_MONTH,
      )
      const endDate = new Date(
        currentYear,
        MONTH_OF_YEAR_RANGE.LAST_MONTH_INDEX,
        MONTH_OF_YEAR_RANGE.LAST_DAY_OF_DECEMBER,
      )

      // Aggregate donations per calendar month within the year
      return await this.db
        .select({
          month: sql<number>`EXTRACT(MONTH FROM ${this.table.createdAt})`,
          totalAmount: sum(this.table.amount),
          totalCount: count(this.table.id),
        })
        .from(this.table)
        .where(
          and(
            eq(this.table.status, donationStatus.SUCCEEDED),
            gte(this.table.createdAt, startDate),
            lte(this.table.createdAt, endDate),
          ),
        )
        .groupBy(sql`EXTRACT(MONTH FROM ${this.table.createdAt})`)
        .orderBy(sql`EXTRACT(MONTH FROM ${this.table.createdAt})`)
    })
  }

  /**
   * @description Returns donations for a given campaign together with donor info
   * @param {string} campaignId - The campaign id
   * @param {number} [limit] - Maximum number of rows to return
   * @param {number} [offset] - Number of rows to skip
   * @returns The donations joined with donor information
   */
  getByCampaignId(campaignId: string, limit = DEFAULT_CAMPAIGN_LIMIT, offset = 0) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.GET_BY_CAMPAIGN, async () => {
      // Join donations with donor data and filter to successful entries for the campaign
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
            eq(this.table.campaignId, campaignId),
            eq(this.table.status, donationStatus.SUCCEEDED),
          ),
        )
        .orderBy(desc(this.table.createdAt))
        .limit(limit)
        .offset(offset)
    })
  }

  /**
   * @description Returns currently active recurring donations
   * @param {number} [limit] - Maximum number of rows to return
   * @param {number} [offset] - Number of rows to skip
   * @returns The recurring donations joined with donor information
   */
  getRecurringDonations(limit = DEFAULT_PAGE_LIMIT, offset = 0) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.GET_RECURRING, async () => {
      // Join recurring successful donations with donor data
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
        .where(
          and(eq(this.table.isRecurring, true), eq(this.table.status, donationStatus.SUCCEEDED)),
        )
        .orderBy(desc(this.table.createdAt))
        .limit(limit)
        .offset(offset)
    })
  }

  /**
   * @description Returns the donors with the highest total successful donation amount
   * @param {number} [limit] - Maximum number of donors to return
   * @returns The top donors with totals and counts
   */
  getTopDonors(limit = DEFAULT_TOP_DONORS_LIMIT) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.GET_TOP_DONORS, async () => {
      // Aggregate successful donations per donor
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
        .where(eq(this.table.status, donationStatus.SUCCEEDED))
        .groupBy(donors.id, donors.firstName, donors.lastName, donors.email)
        .orderBy(desc(sum(this.table.amount)))
        .limit(limit)
    })
  }

  /**
   * @description Searches donations by donor name or email
   * @param {string} query - The free-text query
   * @param {number} [limit] - Maximum number of rows to return
   * @param {number} [offset] - Number of rows to skip
   * @returns The matching donations joined with donor information
   */
  searchByDonor(query: string, limit = DEFAULT_RECENT_LIMIT, offset = 0) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.SEARCH_BY_DONOR, async () => {
      // Build the wildcard search term once
      const searchTerm = `%${query}%`

      // Run the join with case-insensitive comparisons via the raw SQL ILIKE operator
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
   * @description Returns failed donations awaiting retry, with donor info attached
   * @param {number} [limit] - Maximum number of rows to return
   * @returns The failed donations joined with donor information
   */
  getFailedDonations(limit = DEFAULT_PAGE_LIMIT) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donationOperation.GET_FAILED, async () => {
      // Join failed donations with donor data ordered by most recent failures first
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
        .where(eq(this.table.status, donationStatus.FAILED))
        .orderBy(desc(this.table.createdAt))
        .limit(limit)
    })
  }
}
