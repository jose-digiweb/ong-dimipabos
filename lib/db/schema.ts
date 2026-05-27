import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { currencyCode, languageCode } from './constants'

/**
 * The {@link donors} table
 * @description People who have made (or attempted) at least one donation
 */
export const donors = sqliteTable('donors', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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

/**
 * The {@link donations} table
 * @description Individual donation transactions, amounts stored in cents
 */
export const donations = sqliteTable('donations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  donorId: text('donor_id').references(() => donors.id),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default(currencyCode.EUR),
  status: text('status').notNull(),
  paymentMethod: text('payment_method'),
  isRecurring: integer('is_recurring', { mode: 'boolean' }).default(false),
  stripeSubscriptionId: text('stripe_subscription_id'),
  campaignId: text('campaign_id').references(() => campaigns.id),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

/**
 * The {@link projectProgress} table
 * @description Snapshot rows tracking the construction project completion percentage
 */
export const projectProgress = sqliteTable('project_progress', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  targetAmount: integer('target_amount').notNull(),
  currentAmount: integer('current_amount').default(0),
  percentageComplete: integer('percentage_complete').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

/**
 * The {@link campaigns} table
 * @description Donation campaigns referenced by individual donations
 */
export const campaigns = sqliteTable('campaigns', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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

/**
 * The {@link donorPreferences} table
 * @description Per-donor email and locale preferences
 */
export const donorPreferences = sqliteTable('donor_preferences', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  donorId: text('donor_id')
    .references(() => donors.id)
    .notNull(),
  emailUpdates: integer('email_updates', { mode: 'boolean' }).default(true),
  emailNewsletter: integer('email_newsletter', { mode: 'boolean' }).default(false),
  emailReceipts: integer('email_receipts', { mode: 'boolean' }).default(true),
  preferredCurrency: text('preferred_currency').default(currencyCode.EUR),
  preferredLanguage: text('preferred_language').default(languageCode.PT),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

/**
 * The {@link donorsRelations} constant
 * @description Drizzle relation graph for the donors table
 */
export const donorsRelations = relations(donors, ({ many, one }) => ({
  donations: many(donations),
  preferences: one(donorPreferences, {
    fields: [donors.id],
    references: [donorPreferences.donorId],
  }),
}))

/**
 * The {@link donationsRelations} constant
 * @description Drizzle relation graph for the donations table
 */
export const donationsRelations = relations(donations, ({ one }) => ({
  donor: one(donors, { fields: [donations.donorId], references: [donors.id] }),
  campaign: one(campaigns, { fields: [donations.campaignId], references: [campaigns.id] }),
}))

/**
 * The {@link campaignsRelations} constant
 * @description Drizzle relation graph for the campaigns table
 */
export const campaignsRelations = relations(campaigns, ({ many }) => ({
  donations: many(donations),
}))

/**
 * The {@link donorPreferencesRelations} constant
 * @description Drizzle relation graph for the donor_preferences table
 */
export const donorPreferencesRelations = relations(donorPreferences, ({ one }) => ({
  donor: one(donors, { fields: [donorPreferences.donorId], references: [donors.id] }),
}))

/**
 * The {@link Donor} type
 * @description Row shape returned when selecting from {@link donors}
 */
export type Donor = typeof donors.$inferSelect

/**
 * The {@link NewDonor} type
 * @description Insert shape accepted by {@link donors}
 */
export type NewDonor = typeof donors.$inferInsert

/**
 * The {@link Donation} type
 * @description Row shape returned when selecting from {@link donations}
 */
export type Donation = typeof donations.$inferSelect

/**
 * The {@link NewDonation} type
 * @description Insert shape accepted by {@link donations}
 */
export type NewDonation = typeof donations.$inferInsert

/**
 * The {@link Campaign} type
 * @description Row shape returned when selecting from {@link campaigns}
 */
export type Campaign = typeof campaigns.$inferSelect

/**
 * The {@link NewCampaign} type
 * @description Insert shape accepted by {@link campaigns}
 */
export type NewCampaign = typeof campaigns.$inferInsert

/**
 * The {@link ProjectProgress} type
 * @description Row shape returned when selecting from {@link projectProgress}
 */
export type ProjectProgress = typeof projectProgress.$inferSelect

/**
 * The {@link NewProjectProgress} type
 * @description Insert shape accepted by {@link projectProgress}
 */
export type NewProjectProgress = typeof projectProgress.$inferInsert

/**
 * The {@link DonorPreferences} type
 * @description Row shape returned when selecting from {@link donorPreferences}
 */
export type DonorPreferences = typeof donorPreferences.$inferSelect

/**
 * The {@link NewDonorPreferences} type
 * @description Insert shape accepted by {@link donorPreferences}
 */
export type NewDonorPreferences = typeof donorPreferences.$inferInsert
