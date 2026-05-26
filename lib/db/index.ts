import { getCloudflareContext } from '@opennextjs/cloudflare'
import { drizzle } from 'drizzle-orm/d1'
import { cache } from 'react'
import { CampaignRepository } from './repositories/campaigns'
import { DonationRepository } from './repositories/donations'
import { DonorRepository } from './repositories/donors'
import * as schema from './schema'

export const getDb = cache(() => {
	const { env } = getCloudflareContext()
	return drizzle(env.DB, { schema })
})

// Export schema for use in other files
export * from './schema'

// Export repository instances
export const donorRepository = new DonorRepository()
export const donationRepository = new DonationRepository()
export const campaignRepository = new CampaignRepository()
