import { relations } from 'drizzle-orm'
import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'

// Donors table
export const donors = pgTable('donors', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	firstName: varchar('first_name', { length: 100 }).notNull(),
	lastName: varchar('last_name', { length: 100 }).notNull(),
	phone: varchar('phone', { length: 20 }),
	addressLine1: varchar('address_line1', { length: 255 }),
	addressLine2: varchar('address_line2', { length: 255 }),
	city: varchar('city', { length: 100 }),
	state: varchar('state', { length: 100 }),
	postalCode: varchar('postal_code', { length: 20 }),
	country: varchar('country', { length: 2 }).notNull(),
	stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
	emailOptIn: boolean('email_opt_in').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

// Donations table
export const donations = pgTable('donations', {
	id: uuid('id').primaryKey().defaultRandom(),
	donorId: uuid('donor_id').references(() => donors.id),
	stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }).unique(),
	amount: integer('amount').notNull(), // Amount in cents
	currency: varchar('currency', { length: 3 }).notNull().default('EUR'),
	status: varchar('status', { length: 20 }).notNull(), // pending, succeeded, failed, canceled
	paymentMethod: varchar('payment_method', { length: 50 }), // card, sepa, bank_transfer
	isRecurring: boolean('is_recurring').default(false),
	stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
	campaignId: uuid('campaign_id').references(() => campaigns.id),
	metadata: jsonb('metadata'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

// Project progress table
export const projectProgress = pgTable('project_progress', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	targetAmount: integer('target_amount').notNull(), // Amount in cents
	currentAmount: integer('current_amount').default(0), // Amount in cents
	percentageComplete: integer('percentage_complete').default(0),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

// Donation campaigns table
export const campaigns = pgTable('campaigns', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	targetAmount: integer('target_amount').notNull(),
	currentAmount: integer('current_amount').default(0),
	startDate: timestamp('start_date'),
	endDate: timestamp('end_date'),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

// Donor preferences table
export const donorPreferences = pgTable('donor_preferences', {
	id: uuid('id').primaryKey().defaultRandom(),
	donorId: uuid('donor_id')
		.references(() => donors.id)
		.notNull(),
	emailUpdates: boolean('email_updates').default(true),
	emailNewsletter: boolean('email_newsletter').default(false),
	emailReceipts: boolean('email_receipts').default(true),
	preferredCurrency: varchar('preferred_currency', { length: 3 }).default('EUR'),
	preferredLanguage: varchar('preferred_language', { length: 2 }).default('pt'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

// Define relations
export const donorsRelations = relations(donors, ({ many, one }) => ({
	donations: many(donations),
	preferences: one(donorPreferences, {
		fields: [donors.id],
		references: [donorPreferences.donorId],
	}),
}))

export const donationsRelations = relations(donations, ({ one }) => ({
	donor: one(donors, {
		fields: [donations.donorId],
		references: [donors.id],
	}),
	campaign: one(campaigns, {
		fields: [donations.campaignId],
		references: [campaigns.id],
	}),
}))

export const campaignsRelations = relations(campaigns, ({ many }) => ({
	donations: many(donations),
}))

export const donorPreferencesRelations = relations(donorPreferences, ({ one }) => ({
	donor: one(donors, {
		fields: [donorPreferences.donorId],
		references: [donors.id],
	}),
}))

// Export types
export type Donor = typeof donors.$inferSelect
export type NewDonor = typeof donors.$inferInsert
export type Donation = typeof donations.$inferSelect
export type NewDonation = typeof donations.$inferInsert
export type Campaign = typeof campaigns.$inferSelect
export type NewCampaign = typeof campaigns.$inferInsert
export type ProjectProgress = typeof projectProgress.$inferSelect
export type NewProjectProgress = typeof projectProgress.$inferInsert
export type DonorPreferences = typeof donorPreferences.$inferSelect
export type NewDonorPreferences = typeof donorPreferences.$inferInsert
