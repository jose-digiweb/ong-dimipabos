import { and, desc, eq, like } from 'drizzle-orm'

import { dbError, donationStatus } from '../constants'
import {
  type Donor,
  type DonorPreferences,
  type NewDonor,
  type NewDonorPreferences,
  donations,
  donorPreferences,
  donors,
} from '../schema'
import { BaseRepository } from './base'

/**
 * The {@link donorOperation} constant
 * @description Human-readable operation labels for the donor repository
 */
const donorOperation = {
  CREATE: 'create donor',
  FIND_BY_ID: 'find donor by ID',
  FIND_BY_EMAIL: 'find donor by email',
  FIND_BY_STRIPE_ID: 'find donor by Stripe customer ID',
  UPDATE: 'update donor',
  GET_WITH_STATS: 'get donor with stats',
  SEARCH: 'search donors',
  GET_PREFERENCES: 'get donor preferences',
  UPDATE_PREFERENCES: 'update donor preferences',
  GET_NEWSLETTER_SUBSCRIBERS: 'get newsletter subscribers',
  DELETE: 'delete donor',
} as const

/**
 * The {@link DonorRepository} class
 * @description Repository exposing CRUD and aggregation queries over the donors table
 */
export class DonorRepository extends BaseRepository<typeof donors> {
  /**
   * @description Binds the repository to the donors table
   */
  constructor() {
    super(donors)
  }

  /**
   * @description Creates a new donor row
   * @param {NewDonor} donorData - The donor fields to insert
   * @returns {Promise<Donor>} The created donor
   */
  create(donorData: NewDonor): Promise<Donor> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.CREATE, async () => {
      // Insert and return the new row
      const [donor] = await this.db.insert(this.table).values(donorData).returning()

      // Return the inserted donor
      return donor
    })
  }

  /**
   * @description Looks up a donor by primary key
   * @param {string} id - The donor id
   * @returns {Promise<Donor | null>} The donor or null when none matches
   */
  findById(id: string): Promise<Donor | null> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.FIND_BY_ID, async () => {
      // Select the first row matching the id
      const [donor] = await this.db.select().from(this.table).where(eq(this.table.id, id)).limit(1)

      // Return the donor or null when no row was found
      return donor || null
    })
  }

  /**
   * @description Looks up a donor by email address
   * @param {string} email - The donor email
   * @returns {Promise<Donor | null>} The donor or null when none matches
   */
  async findByEmail(email: string): Promise<Donor | null> {
    // Defer to executeQuery so any error is normalised
    return await this.executeQuery(donorOperation.FIND_BY_EMAIL, async () => {
      // Select the first row matching the email
      const [donor] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.email, email))
        .limit(1)

      // Return the donor or null when no row was found
      return donor || null
    })
  }

  /**
   * @description Looks up a donor by their Stripe customer id
   * @param {string} stripeCustomerId - The Stripe customer id
   * @returns {Promise<Donor | null>} The donor or null when none matches
   */
  findByStripeCustomerId(stripeCustomerId: string): Promise<Donor | null> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.FIND_BY_STRIPE_ID, async () => {
      // Select the first row matching the Stripe customer id
      const [donor] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.stripeCustomerId, stripeCustomerId))
        .limit(1)

      // Return the donor or null when no row was found
      return donor || null
    })
  }

  /**
   * @description Updates an existing donor row
   * @param {string} id - The donor id
   * @param {Partial<NewDonor>} updates - The fields to update
   * @returns {Promise<Donor>} The updated donor row
   */
  update(id: string, updates: Partial<NewDonor>): Promise<Donor> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.UPDATE, async () => {
      // Update the row and return the new state
      const [donor] = await this.db
        .update(this.table)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(this.table.id, id))
        .returning()

      // Throw a typed error when no row was updated
      if (!donor) {
        throw new Error(dbError.DONOR_NOT_FOUND)
      }

      // Return the updated donor
      return donor
    })
  }

  /**
   * @description Returns a donor together with their successful donations and aggregate stats
   * @param {string} id - The donor id
   * @returns The donor with stats, or null when the donor does not exist
   */
  getDonorWithStats(id: string) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.GET_WITH_STATS, async () => {
      // Resolve the donor first
      const donor = await this.findById(id)

      // Bail out when the donor was not found
      if (!donor) {
        return null
      }

      // Load all successful donations for the donor, newest first
      const donorDonations = await this.db
        .select()
        .from(donations)
        .where(and(eq(donations.donorId, id), eq(donations.status, donationStatus.SUCCEEDED)))
        .orderBy(desc(donations.createdAt))

      // Compute total donated amount across all successful donations
      const totalDonated = donorDonations.reduce((sum, donation) => sum + donation.amount, 0)

      // Count successful donations
      const donationCount = donorDonations.length

      // Capture the date of the most recent successful donation when present
      const lastDonation = donorDonations[0]?.createdAt || null

      // Mark as recurring donor when any donation has the isRecurring flag set
      const isRecurringDonor = donorDonations.some((d) => d.isRecurring)

      // Return the aggregated donor view
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
   * @description Performs a paged donor search by name or email
   * @param {string} query - The free-text query
   * @param {number} [limit] - Maximum number of rows to return
   * @param {number} [offset] - Number of rows to skip
   * @returns The matching donor rows
   */
  search(query: string, limit = 20, offset = 0) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.SEARCH, async () => {
      // Build the wildcard search term once
      const searchTerm = `%${query}%`

      // Run the paged search query
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
   * @description Loads stored preferences for a donor
   * @param {string} donorId - The donor id
   * @returns {Promise<DonorPreferences | null>} The preferences or null when none are stored
   */
  getPreferences(donorId: string): Promise<DonorPreferences | null> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.GET_PREFERENCES, async () => {
      // Select the first preferences row for the donor
      const [preferences] = await this.db
        .select()
        .from(donorPreferences)
        .where(eq(donorPreferences.donorId, donorId))
        .limit(1)

      // Return the preferences or null when none exist
      return preferences || null
    })
  }

  /**
   * @description Upserts donor preferences
   * @param {string} donorId - The donor id
   * @param {Partial<NewDonorPreferences>} prefs - The preference fields to apply
   * @returns {Promise<DonorPreferences>} The persisted preferences row
   */
  updatePreferences(
    donorId: string,
    prefs: Partial<NewDonorPreferences>,
  ): Promise<DonorPreferences> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.UPDATE_PREFERENCES, async () => {
      // Check whether a preferences row already exists
      const existing = await this.getPreferences(donorId)

      // Update the existing row when present
      if (existing) {
        const [updated] = await this.db
          .update(donorPreferences)
          .set({ ...prefs, updatedAt: new Date() })
          .where(eq(donorPreferences.donorId, donorId))
          .returning()

        return updated
      }

      // Otherwise insert a fresh preferences row
      const [created] = await this.db
        .insert(donorPreferences)
        .values({ donorId, ...prefs })
        .returning()

      // Return the newly inserted row
      return created
    })
  }

  /**
   * @description Returns donors opted into newsletter emails along with their preferences
   * @returns The list of newsletter subscribers
   */
  getNewsletterSubscribers() {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.GET_NEWSLETTER_SUBSCRIBERS, async () => {
      // Join donors with their preferences and filter by opt-in flags
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
   * @description Deletes a donor and their preferences (donations are retained for accounting)
   * @param {string} id - The donor id
   * @returns {Promise<void>} Resolves once both deletes have run
   */
  delete(id: string): Promise<void> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(donorOperation.DELETE, async () => {
      // First delete the linked preferences row
      await this.db.delete(donorPreferences).where(eq(donorPreferences.donorId, id))

      // Then delete the donor record itself
      await this.db.delete(this.table).where(eq(this.table.id, id))
    })
  }
}
