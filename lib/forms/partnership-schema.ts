import * as z from 'zod'

import { locales } from '@/i18n/config'

/**
 * The {@link PARTNERSHIP_LIMITS} constant
 * @description Length bounds for every partnership form field
 */
export const PARTNERSHIP_LIMITS = {
  COMPANY_MIN: 2,
  COMPANY_MAX: 120,
  CONTACT_MIN: 2,
  CONTACT_MAX: 120,
  EMAIL_MAX: 254,
  PHONE_MIN: 8,
  PHONE_MAX: 32,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 2000,
} as const

/**
 * The {@link buildPartnershipSchema} factory
 * @description Builds a zod schema for the partnership form with locale-aware
 * error messages. Pass the resolved next-intl translator; omit for the server
 * route to fall back to terse, locale-neutral fallbacks.
 * @param {(key: string) => string} [t] - Translator returning localized messages
 * @returns The schema validating both client submit and server payload
 */
export const buildPartnershipSchema = (t?: (key: string) => string) => {
  // Resolve translator messages with sensible neutral fallbacks
  const msg = (key: string, fallback: string) => t?.(key) ?? fallback

  return z.object({
    companyName: z
      .string()
      .min(PARTNERSHIP_LIMITS.COMPANY_MIN, {
        message: msg('companyError', 'Invalid company name'),
      })
      .max(PARTNERSHIP_LIMITS.COMPANY_MAX),
    contactName: z
      .string()
      .min(PARTNERSHIP_LIMITS.CONTACT_MIN, {
        message: msg('contactError', 'Invalid contact name'),
      })
      .max(PARTNERSHIP_LIMITS.CONTACT_MAX),
    email: z
      .string()
      .email({ message: msg('emailError', 'Invalid email') })
      .max(PARTNERSHIP_LIMITS.EMAIL_MAX),
    phone: z
      .string()
      .min(PARTNERSHIP_LIMITS.PHONE_MIN, { message: msg('phoneError', 'Invalid phone') })
      .max(PARTNERSHIP_LIMITS.PHONE_MAX),
    message: z
      .string()
      .min(PARTNERSHIP_LIMITS.MESSAGE_MIN, {
        message: msg('messageError', 'Message is too short'),
      })
      .max(PARTNERSHIP_LIMITS.MESSAGE_MAX),
  })
}

/**
 * The {@link PartnershipPayload} type
 * @description Validated partnership form fields (no transport-only extras)
 */
export type PartnershipPayload = z.infer<ReturnType<typeof buildPartnershipSchema>>

/**
 * The {@link partnershipRequestSchema} constant
 * @description Wire-level schema validated by the route handler. Adds the
 * Turnstile token and the active locale alongside the payload.
 */
export const partnershipRequestSchema = buildPartnershipSchema().extend({
  turnstileToken: z.string().min(1),
  locale: z.enum(locales),
})

/**
 * The {@link PartnershipRequest} type
 * @description Wire request body accepted by the partnership route handler
 */
export type PartnershipRequest = z.infer<typeof partnershipRequestSchema>

/**
 * The {@link partnershipErrorCode} constant
 * @description Stable error codes the client maps to localized banners
 */
export const partnershipErrorCode = {
  VALIDATION: 'validation',
  TURNSTILE: 'turnstile',
  RATE_LIMIT: 'rate_limit',
  EMAIL_FAILED: 'email_failed',
  STORAGE_FAILED: 'storage_failed',
  UNKNOWN: 'unknown',
} as const

/**
 * The {@link PartnershipErrorCode} type
 * @description Union of values from {@link partnershipErrorCode}
 */
export type PartnershipErrorCode = (typeof partnershipErrorCode)[keyof typeof partnershipErrorCode]

/**
 * The {@link PartnershipResponse} type
 * @description Discriminated response returned by the partnership route handler
 */
export type PartnershipResponse = { ok: true } | { ok: false; code: PartnershipErrorCode }
