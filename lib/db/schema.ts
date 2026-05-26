import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Donors table
export const donors = sqliteTable('donors', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	email: text('email').unique().notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	phone: text('phone'),
	addressLine1: text('address_line1'),
	addressLine2: text('address_line2'),
	city: text('city'),
	state: text('state'),
	postalCode: text('postal_code'),
	country: text('country').notNull(),
	stripeCustomerId: text('stripe_customer_id').unique(),
	emailOptIn: integer('email_opt_in', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Donations table
export const donations = sqliteTable('donations', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	donorId: text('donor_id').references(() => donors.id),
	stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
	amount: integer('amount').notNull(), // Amount in cents
	currency: text('currency').notNull().default('EUR'),
	status: text('status').notNull(), // pending, succeeded, failed, canceled
	paymentMethod: text('payment_method'), // card, sepa, bank_transfer
	isRecurring: integer('is_recurring', { mode: 'boolean' }).default(false),
	stripeSubscriptionId: text('stripe_subscription_id'),
	campaignId: text('campaign_id').references(() => campaigns.id),
	metadata: text('metadata', { mode: 'json' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Project progress table
export const projectProgress = sqliteTable('project_progress', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	description: text('description'),
	targetAmount: integer('target_amount').notNull(),
	currentAmount: integer('current_amount').default(0),
	percentageComplete: integer('percentage_complete').default(0),
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Donation campaigns table
export const campaigns = sqliteTable('campaigns', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	description: text('description'),
	targetAmount: integer('target_amount').notNull(),
	currentAmount: integer('current_amount').default(0),
	startDate: integer('start_date', { mode: 'timestamp' }),
	endDate: integer('end_date', { mode: 'timestamp' }),
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Donor preferences table
export const donorPreferences = sqliteTable('donor_preferences', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	donorId: text('donor_id').references(() => donors.id).notNull(),
	emailUpdates: integer('email_updates', { mode: 'boolean' }).default(true),
	emailNewsletter: integer('email_newsletter', { mode: 'boolean' }).default(false),
	emailReceipts: integer('email_receipts', { mode: 'boolean' }).default(true),
	preferredCurrency: text('preferred_currency').default('EUR'),
	preferredLanguage: text('preferred_language').default('pt'),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Relations
export const donorsRelations = relations(donors, ({ many, one }) => ({
	donations: many(donations),
	preferences: one(donorPreferences, {
		fields: [donors.id],
		references: [donorPreferences.donorId],
	}),
}))

export const donationsRelations = relations(donations, ({ one }) => ({
	donor: one(donors, { fields: [donations.donorId], references: [donors.id] }),
	campaign: one(campaigns, { fields: [donations.campaignId], references: [campaigns.id] }),
}))

export const campaignsRelations = relations(campaigns, ({ many }) => ({
	donations: many(donations),
}))

export const donorPreferencesRelations = relations(donorPreferences, ({ one }) => ({
	donor: one(donors, { fields: [donorPreferences.donorId], references: [donors.id] }),
}))

// Exported types
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
