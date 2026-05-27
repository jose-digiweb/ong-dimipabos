import { getCloudflareContext } from '@opennextjs/cloudflare'
import { drizzle } from 'drizzle-orm/d1'
import { cache } from 'react'

import { CampaignRepository } from './repositories/campaigns'
import { DonationRepository } from './repositories/donations'
import { DonorRepository } from './repositories/donors'
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

export * from './constants'
export * from './schema'
export type * from './types'
