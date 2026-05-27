import { and, count, desc, eq, sum } from 'drizzle-orm'

import { dbError, donationStatus, mainCampaignSeed } from '../constants'
import {
  type Campaign,
  type NewCampaign,
  type NewProjectProgress,
  type ProjectProgress,
  campaigns,
  donations,
  projectProgress,
} from '../schema'
import { BaseRepository } from './base'

/**
 * The {@link campaignOperation} constant
 * @description Human-readable operation labels for the campaign repository
 */
const campaignOperation = {
  CREATE: 'create campaign',
  FIND_BY_ID: 'find campaign by ID',
  GET_ACTIVE: 'get active campaigns',
  UPDATE: 'update campaign',
  GET_WITH_STATS: 'get campaign with stats',
  UPDATE_CURRENT_AMOUNT: 'update campaign current amount',
  GET_MAIN: 'get main campaign',
  UPDATE_PROGRESS: 'update project progress',
  GET_CURRENT_PROGRESS: 'get current progress',
  CALCULATE_PROGRESS: 'calculate progress',
  GET_METRICS: 'get campaign metrics',
} as const

/**
 * The {@link RECENT_DONATIONS_LIMIT} constant
 * @description How many recent donations to include in {@link CampaignRepository.getCampaignWithStats}
 */
const RECENT_DONATIONS_LIMIT = 10

/**
 * The {@link DEFAULT_METRICS_DAYS} constant
 * @description Default sliding-window in days used by {@link CampaignRepository.getCampaignMetrics}
 */
const DEFAULT_METRICS_DAYS = 30

/**
 * The {@link MAX_PERCENTAGE} constant
 * @description Upper bound applied when computing completion percentages
 */
const MAX_PERCENTAGE = 100

/**
 * The {@link CampaignRepository} class
 * @description Repository exposing CRUD and aggregation queries over the campaigns and project_progress tables
 */
export class CampaignRepository extends BaseRepository<typeof campaigns> {
  /**
   * @description Binds the repository to the campaigns table
   */
  constructor() {
    super(campaigns)
  }

  /**
   * @description Creates a new campaign row
   * @param {NewCampaign} campaignData - The campaign fields to insert
   * @returns {Promise<Campaign>} The created campaign
   */
  create(campaignData: NewCampaign): Promise<Campaign> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.CREATE, async () => {
      // Insert and return the new row
      const [campaign] = await this.db.insert(this.table).values(campaignData).returning()

      // Return the inserted campaign
      return campaign
    })
  }

  /**
   * @description Looks up a campaign by primary key
   * @param {string} id - The campaign id
   * @returns {Promise<Campaign | null>} The campaign or null when none matches
   */
  findById(id: string): Promise<Campaign | null> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.FIND_BY_ID, async () => {
      // Select the first row matching the id
      const [campaign] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id))
        .limit(1)

      // Return the campaign or null when no row was found
      return campaign || null
    })
  }

  /**
   * @description Returns all currently active campaigns, newest first
   * @returns {Promise<Campaign[]>} The active campaigns
   */
  getActiveCampaigns(): Promise<Campaign[]> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.GET_ACTIVE, async () => {
      // Select active campaigns ordered by creation date descending
      return await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.isActive, true))
        .orderBy(desc(this.table.createdAt))
    })
  }

  /**
   * @description Updates an existing campaign row
   * @param {string} id - The campaign id
   * @param {Partial<NewCampaign>} updates - The fields to update
   * @returns {Promise<Campaign>} The updated campaign row
   */
  update(id: string, updates: Partial<NewCampaign>): Promise<Campaign> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.UPDATE, async () => {
      // Update the row and return the new state
      const [campaign] = await this.db
        .update(this.table)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(this.table.id, id))
        .returning()

      // Throw a typed error when no row was updated
      if (!campaign) {
        throw new Error(dbError.CAMPAIGN_NOT_FOUND)
      }

      // Return the updated campaign
      return campaign
    })
  }

  /**
   * @description Returns a campaign together with donation aggregates and recent donations
   * @param {string} id - The campaign id
   * @returns The campaign with stats, or null when the campaign does not exist
   */
  getCampaignWithStats(id: string) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.GET_WITH_STATS, async () => {
      // Resolve the campaign first
      const campaign = await this.findById(id)

      // Bail out when the campaign was not found
      if (!campaign) {
        return null
      }

      // Aggregate the successful donations for the campaign
      const [stats] = await this.db
        .select({
          totalRaised: sum(donations.amount),
          donationCount: count(donations.id),
        })
        .from(donations)
        .where(and(eq(donations.campaignId, id), eq(donations.status, donationStatus.SUCCEEDED)))

      // Normalise the totals as numbers with safe fallbacks
      const totalRaised = Number(stats.totalRaised) || 0
      const donationCount = Number(stats.donationCount) || 0

      // Compute the completion percentage when a target amount is configured
      const progressPercentage =
        campaign.targetAmount > 0
          ? Math.round((totalRaised / campaign.targetAmount) * MAX_PERCENTAGE)
          : 0

      // Load the latest successful donations for the campaign
      const recentDonations = await this.db
        .select()
        .from(donations)
        .where(and(eq(donations.campaignId, id), eq(donations.status, donationStatus.SUCCEEDED)))
        .orderBy(desc(donations.createdAt))
        .limit(RECENT_DONATIONS_LIMIT)

      // Return the aggregated campaign view
      return {
        campaign,
        stats: {
          totalRaised,
          donationCount,
          progressPercentage,
          recentDonations,
        },
      }
    })
  }

  /**
   * @description Recomputes the cached currentAmount on a campaign based on successful donations
   * @param {string} id - The campaign id
   * @returns {Promise<Campaign>} The updated campaign row
   */
  updateCurrentAmount(id: string): Promise<Campaign> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.UPDATE_CURRENT_AMOUNT, async () => {
      // Sum the successful donations for the campaign
      const [stats] = await this.db
        .select({
          totalAmount: sum(donations.amount),
        })
        .from(donations)
        .where(and(eq(donations.campaignId, id), eq(donations.status, donationStatus.SUCCEEDED)))

      // Normalise the total as a number with a safe fallback
      const currentAmount = Number(stats.totalAmount) || 0

      // Persist the new currentAmount on the campaign
      const [campaign] = await this.db
        .update(this.table)
        .set({
          currentAmount,
          updatedAt: new Date(),
        })
        .where(eq(this.table.id, id))
        .returning()

      // Throw a typed error when no row was updated
      if (!campaign) {
        throw new Error(dbError.CAMPAIGN_NOT_FOUND)
      }

      // Return the updated campaign
      return campaign
    })
  }

  /**
   * @description Returns the oldest active campaign, treated as the "main" campaign
   * @returns {Promise<Campaign | null>} The main campaign or null when none exists
   */
  getMainCampaign(): Promise<Campaign | null> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.GET_MAIN, async () => {
      // Select the first active campaign ordered by creation date ascending
      const [campaign] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.isActive, true))
        .orderBy(this.table.createdAt)
        .limit(1)

      // Return the campaign or null when no row was found
      return campaign || null
    })
  }

  /**
   * @description Upserts the active project progress row
   * @param {NewProjectProgress} progressData - The progress fields to persist
   * @returns {Promise<ProjectProgress>} The persisted progress row
   */
  updateProjectProgress(progressData: NewProjectProgress): Promise<ProjectProgress> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.UPDATE_PROGRESS, async () => {
      // Find the current active progress row when present
      const [existing] = await this.db
        .select()
        .from(projectProgress)
        .where(eq(projectProgress.isActive, true))
        .limit(1)

      // Update the existing row when found
      if (existing) {
        const [updated] = await this.db
          .update(projectProgress)
          .set({ ...progressData, updatedAt: new Date() })
          .where(eq(projectProgress.id, existing.id))
          .returning()

        return updated
      }

      // Otherwise insert a fresh progress row
      const [created] = await this.db.insert(projectProgress).values(progressData).returning()

      // Return the newly inserted row
      return created
    })
  }

  /**
   * @description Loads the currently active project progress row
   * @returns {Promise<ProjectProgress | null>} The progress row or null when none exists
   */
  getCurrentProgress(): Promise<ProjectProgress | null> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.GET_CURRENT_PROGRESS, async () => {
      // Select the first active progress row
      const [progress] = await this.db
        .select()
        .from(projectProgress)
        .where(eq(projectProgress.isActive, true))
        .limit(1)

      // Return the progress row or null when none exists
      return progress || null
    })
  }

  /**
   * @description Recomputes and persists project progress based on the main campaign and successful donations
   * @returns {Promise<ProjectProgress | null>} The updated progress row, or null when no main campaign exists
   */
  calculateProgress(): Promise<ProjectProgress | null> {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.CALCULATE_PROGRESS, async () => {
      // Resolve the main campaign first
      const mainCampaign = await this.getMainCampaign()

      // Bail out when there is no main campaign to anchor progress against
      if (!mainCampaign) {
        return null
      }

      // Aggregate all successful donations across the system
      const [stats] = await this.db
        .select({
          totalRaised: sum(donations.amount),
        })
        .from(donations)
        .where(eq(donations.status, donationStatus.SUCCEEDED))

      // Normalise the total raised as a number with a safe fallback
      const totalRaised = Number(stats.totalRaised) || 0

      // Capture the target amount once for clarity
      const targetAmount = mainCampaign.targetAmount

      // Compute the bounded completion percentage
      const percentageComplete =
        targetAmount > 0
          ? Math.min(Math.round((totalRaised / targetAmount) * MAX_PERCENTAGE), MAX_PERCENTAGE)
          : 0

      // Persist the recomputed progress snapshot
      return await this.updateProjectProgress({
        title: mainCampaignSeed.NAME,
        description: mainCampaignSeed.DESCRIPTION,
        targetAmount,
        currentAmount: totalRaised,
        percentageComplete,
        isActive: true,
      })
    })
  }

  /**
   * @description Returns headline donation metrics for a campaign over a sliding window
   * @param {string} id - The campaign id
   * @param {number} [days] - The window size in days
   * @returns The metrics object including derived average donation
   */
  getCampaignMetrics(id: string, days = DEFAULT_METRICS_DAYS) {
    // Defer to executeQuery so any error is normalised
    return this.executeQuery(campaignOperation.GET_METRICS, async () => {
      // Compute the window start date relative to now
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Aggregate metrics for the campaign within the window
      const [metrics] = await this.db
        .select({
          totalDonations: count(donations.id),
          totalAmount: sum(donations.amount),
          uniqueDonors: count(donations.donorId),
        })
        .from(donations)
        .where(
          and(
            eq(donations.campaignId, id),
            eq(donations.status, donationStatus.SUCCEEDED),
            eq(donations.createdAt, startDate),
          ),
        )

      // Normalise the aggregates and derive the average donation
      return {
        totalDonations: Number(metrics.totalDonations) || 0,
        totalAmount: Number(metrics.totalAmount) || 0,
        uniqueDonors: Number(metrics.uniqueDonors) || 0,
        averageDonation:
          metrics.totalDonations > 0
            ? Math.round(Number(metrics.totalAmount) / Number(metrics.totalDonations))
            : 0,
      }
    })
  }
}
