import type { currencyCode, donationStatus, languageCode, paymentMethod } from './constants'

/**
 * The {@link DonationStatus} type
 * @description Union of valid donation status values
 */
export type DonationStatus = (typeof donationStatus)[keyof typeof donationStatus]

/**
 * The {@link PaymentMethod} type
 * @description Union of supported payment method values
 */
export type PaymentMethod = (typeof paymentMethod)[keyof typeof paymentMethod]

/**
 * The {@link CurrencyCode} type
 * @description Union of supported currency codes
 */
export type CurrencyCode = (typeof currencyCode)[keyof typeof currencyCode]

/**
 * The {@link LanguageCode} type
 * @description Union of supported language codes
 */
export type LanguageCode = (typeof languageCode)[keyof typeof languageCode]
