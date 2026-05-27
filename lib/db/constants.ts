/**
 * The {@link donationStatus} constant
 * @description Canonical values stored in `donations.status`
 */
export const donationStatus = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
} as const

/**
 * The {@link paymentMethod} constant
 * @description Canonical values stored in `donations.payment_method`
 */
export const paymentMethod = {
  CARD: 'card',
  SEPA: 'sepa',
  BANK_TRANSFER: 'bank_transfer',
} as const

/**
 * The {@link currencyCode} constant
 * @description Supported ISO-4217 currency codes
 */
export const currencyCode = {
  EUR: 'EUR',
  USD: 'USD',
  GBP: 'GBP',
} as const

/**
 * The {@link languageCode} constant
 * @description Supported language preference codes
 */
export const languageCode = {
  PT: 'pt',
  EN: 'en',
} as const

/**
 * The {@link mainCampaignSeed} constant
 * @description The seed values used to bootstrap the construction campaign
 */
export const mainCampaignSeed = {
  NAME: 'Centro de Tratamento e Reabilitação',
  DESCRIPTION:
    'Construção do primeiro centro especializado em tratamento e reabilitação para pessoas em situação de dependência química na Guiné-Bissau.',
  TARGET_AMOUNT_CENTS: 50000000,
  INITIAL_PERCENTAGE_COMPLETE: 10,
} as const

/**
 * The {@link dbError} constant
 * @description User-facing error messages produced by the repository layer
 */
export const dbError = {
  UNIQUE_CONSTRAINT_MATCH: 'unique constraint',
  FOREIGN_KEY_CONSTRAINT_MATCH: 'foreign key constraint',
  NOT_NULL_CONSTRAINT_MATCH: 'not null constraint',
  UNIQUE_CONSTRAINT_MESSAGE: 'A record with this information already exists',
  FOREIGN_KEY_MESSAGE: 'Referenced record does not exist',
  NOT_NULL_MESSAGE: 'Required information is missing',
  GENERIC_PREFIX: 'Failed to',
  GENERIC_SUFFIX: '. Please try again.',
  DONOR_NOT_FOUND: 'Donor not found',
  CAMPAIGN_NOT_FOUND: 'Campaign not found',
  DONATION_NOT_FOUND: 'Donation not found',
} as const
