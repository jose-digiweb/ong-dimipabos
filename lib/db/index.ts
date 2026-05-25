import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { CampaignRepository } from './repositories/campaigns'
import { DonationRepository } from './repositories/donations'
import { DonorRepository } from './repositories/donors'
import * as schema from './schema'

// Create the connection
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DATABASE_URL environment variable is required')
}

// Create postgres client
const client = postgres(connectionString, {
	max: 1,
	idle_timeout: 20,
	connect_timeout: 10,
})

// Create drizzle instance
export const db = drizzle(client, { schema })

// Export schema for use in other files
export * from './schema'

// Export repository instances
export const donorRepository = new DonorRepository()
export const donationRepository = new DonationRepository()
export const campaignRepository = new CampaignRepository()

// Utility function to close the connection (useful for serverless)
export const closeConnection = async () => {
	await client.end()
}
