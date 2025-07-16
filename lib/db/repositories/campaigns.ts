import { and, count, desc, eq, sum } from 'drizzle-orm'
import { campaigns, donations, projectProgress } from '../schema'
import type { Campaign, NewCampaign, NewProjectProgress, ProjectProgress } from '../schema'
import { BaseRepository } from './base'

export class CampaignRepository extends BaseRepository<typeof campaigns> {
  constructor() {
    super(campaigns)
  }

  /**
   * Create a new campaign
   */
  create(campaignData: NewCampaign): Promise<Campaign> {
    return this.executeQuery('create campaign', async () => {
      const [campaign] = await this.db.insert(this.table).values(campaignData).returning()

      return campaign
    })
  }

  /**
   * Find campaign by ID
   */
  findById(id: string): Promise<Campaign | null> {
    return this.executeQuery('find campaign by ID', async () => {
      const [campaign] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id))
        .limit(1)

      return campaign || null
    })
  }

  /**
   * Get all active campaigns
   */
  getActiveCampaigns(): Promise<Campaign[]> {
    return this.executeQuery('get active campaigns', async () => {
      return await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.isActive, true))
        .orderBy(desc(this.table.createdAt))
    })
  }

  /**
   * Update campaign
   */
  update(id: string, updates: Partial<NewCampaign>): Promise<Campaign> {
    return this.executeQuery('update campaign', async () => {
      const [campaign] = await this.db
        .update(this.table)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(this.table.id, id))
        .returning()

      if (!campaign) {
        throw new Error('Campaign not found')
      }

      return campaign
    })
  }

  /**
   * Get campaign with donation statistics
   */
  getCampaignWithStats(id: string) {
    return this.executeQuery('get campaign with stats', async () => {
      const campaign = await this.findById(id)
      if (!campaign) {
        return null
      }

      const [stats] = await this.db
        .select({
          totalRaised: sum(donations.amount),
          donationCount: count(donations.id),
        })
        .from(donations)
        .where(and(eq(donations.campaignId, id), eq(donations.status, 'succeeded')))

      const totalRaised = Number(stats.totalRaised) || 0
      const donationCount = Number(stats.donationCount) || 0
      const progressPercentage =
        campaign.targetAmount > 0 ? Math.round((totalRaised / campaign.targetAmount) * 100) : 0

      // Get recent donations for this campaign
      const recentDonations = await this.db
        .select()
        .from(donations)
        .where(and(eq(donations.campaignId, id), eq(donations.status, 'succeeded')))
        .orderBy(desc(donations.createdAt))
        .limit(10)

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
   * Update campaign current amount based on successful donations
   */
  updateCurrentAmount(id: string): Promise<Campaign> {
    return this.executeQuery('update campaign current amount', async () => {
      const [stats] = await this.db
        .select({
          totalAmount: sum(donations.amount),
        })
        .from(donations)
        .where(and(eq(donations.campaignId, id), eq(donations.status, 'succeeded')))

      const currentAmount = Number(stats.totalAmount) || 0

      const [campaign] = await this.db
        .update(this.table)
        .set({
          currentAmount,
          updatedAt: new Date(),
        })
        .where(eq(this.table.id, id))
        .returning()

      if (!campaign) {
        throw new Error('Campaign not found')
      }

      return campaign
    })
  }

  /**
   * Get the main construction campaign (default campaign)
   */
  getMainCampaign(): Promise<Campaign | null> {
    return this.executeQuery('get main campaign', async () => {
      const [campaign] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.isActive, true))
        .orderBy(this.table.createdAt) // Get the first/oldest active campaign
        .limit(1)

      return campaign || null
    })
  }

  /**
   * Create or update project progress
   */
  updateProjectProgress(progressData: NewProjectProgress): Promise<ProjectProgress> {
    return this.executeQuery('update project progress', async () => {
      // Check if there's an existing active progress record
      const [existing] = await this.db
        .select()
        .from(projectProgress)
        .where(eq(projectProgress.isActive, true))
        .limit(1)

      if (existing) {
        const [updated] = await this.db
          .update(projectProgress)
          .set({ ...progressData, updatedAt: new Date() })
          .where(eq(projectProgress.id, existing.id))
          .returning()

        return updated
      }
      const [created] = await this.db.insert(projectProgress).values(progressData).returning()

      return created
    })
  }

  /**
   * Get current project progress
   */
  getCurrentProgress(): Promise<ProjectProgress | null> {
    return this.executeQuery('get current progress', async () => {
      const [progress] = await this.db
        .select()
        .from(projectProgress)
        .where(eq(projectProgress.isActive, true))
        .limit(1)

      return progress || null
    })
  }

  /**
   * Calculate and update project progress based on donations
   */
  calculateProgress(): Promise<ProjectProgress | null> {
    return this.executeQuery('calculate progress', async () => {
      const mainCampaign = await this.getMainCampaign()
      if (!mainCampaign) {
        return null
      }

      const [stats] = await this.db
        .select({
          totalRaised: sum(donations.amount),
        })
        .from(donations)
        .where(eq(donations.status, 'succeeded'))

      const totalRaised = Number(stats.totalRaised) || 0
      const targetAmount = mainCampaign.targetAmount
      const percentageComplete =
        targetAmount > 0 ? Math.min(Math.round((totalRaised / targetAmount) * 100), 100) : 0

      return await this.updateProjectProgress({
        title: 'Centro de Tratamento e Reabilitação',
        description:
          'Construção do primeiro centro especializado em tratamento e reabilitação para pessoas em situação de dependência química na Guiné-Bissau.',
        targetAmount,
        currentAmount: totalRaised,
        percentageComplete,
        isActive: true,
      })
    })
  }

  /**
   * Get campaign performance metrics
   */
  getCampaignMetrics(id: string, days = 30) {
    return this.executeQuery('get campaign metrics', async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const [metrics] = await this.db
        .select({
          totalDonations: count(donations.id),
          totalAmount: sum(donations.amount),
          uniqueDonors: count(donations.donorId), // This is approximate
        })
        .from(donations)
        .where(
          and(
            eq(donations.campaignId, id),
            eq(donations.status, 'succeeded'),
            eq(donations.createdAt, startDate)
          )
        )

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
