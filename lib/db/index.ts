import { getCloudflareContext } from '@opennextjs/cloudflare'
import { drizzle } from 'drizzle-orm/d1'
import { cache } from 'react'

import { CampaignRepository } from './repositories/campaigns'
import { ContactSubmissionRepository } from './repositories/contact-submissions'
import { DonationRepository } from './repositories/donations'
import { DonorRepository } from './repositories/donors'
import { PartnershipSubmissionRepository } from './repositories/partnership-submissions'
import { VolunteerSubmissionRepository } from './repositories/volunteer-submissions'
import * as schema from './schema'

/**
 * The {@link getDb} function
 * @description Returns the Drizzle D1 client for the current request, deduplicated by React `cache`
 * @returns The Drizzle client bound to the request's `DB` binding and the schema graph
 */
export const getDb = cache(() => {
  // Resolve the Cloudflare bindings for the current request context
  const { env } = getCloudflareContext()

  // Construct the Drizzle client bound to the D1 binding and the schema graph
  return drizzle(env.DB, { schema })
})

/**
 * The {@link donorRepository} singleton
 * @description Shared donor repository instance
 */
export const donorRepository = new DonorRepository()

/**
 * The {@link donationRepository} singleton
 * @description Shared donation repository instance
 */
export const donationRepository = new DonationRepository()

/**
 * The {@link campaignRepository} singleton
 * @description Shared campaign repository instance
 */
export const campaignRepository = new CampaignRepository()

/**
 * The {@link contactSubmissionRepository} singleton
 * @description Shared contact submission repository instance
 */
export const contactSubmissionRepository = new ContactSubmissionRepository()

/**
 * The {@link volunteerSubmissionRepository} singleton
 * @description Shared volunteer submission repository instance
 */
export const volunteerSubmissionRepository = new VolunteerSubmissionRepository()

/**
 * The {@link partnershipSubmissionRepository} singleton
 * @description Shared partnership submission repository instance
 */
export const partnershipSubmissionRepository = new PartnershipSubmissionRepository()

export * from './constants'
export * from './schema'
export type * from './types'
