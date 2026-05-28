import * as z from 'zod'

import { locales } from '@/i18n/config'

/**
 * The {@link volunteerArea} constant
 * @description Canonical values stored for `volunteer_submissions.area`
 */
export const volunteerArea = {
  CONSTRUCTION: 'construction',
  EDUCATION: 'education',
  HEALTH: 'health',
  SOCIAL: 'social',
  ADMIN: 'admin',
} as const

/**
 * The {@link VolunteerArea} type
 * @description Union of values from {@link volunteerArea}
 */
export type VolunteerArea = (typeof volunteerArea)[keyof typeof volunteerArea]

/**
 * The {@link volunteerAreaKeys} constant
 * @description Ordered list of area keys used by the schema enum and UI selects
 */
export const volunteerAreaKeys = [
  volunteerArea.CONSTRUCTION,
  volunteerArea.EDUCATION,
  volunteerArea.HEALTH,
  volunteerArea.SOCIAL,
  volunteerArea.ADMIN,
] as const

/**
 * The {@link VOLUNTEER_LIMITS} constant
 * @description Length bounds for every volunteer form field
 */
export const VOLUNTEER_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 120,
  EMAIL_MAX: 254,
  PHONE_MIN: 8,
  PHONE_MAX: 32,
  AVAILABILITY_MIN: 2,
  AVAILABILITY_MAX: 500,
  EXPERIENCE_MAX: 1500,
} as const

/**
 * The {@link buildVolunteerSchema} factory
 * @description Builds a zod schema for the volunteer form with locale-aware
 * error messages. Pass the resolved next-intl translator; omit for the server
 * route to fall back to terse, locale-neutral fallbacks.
 * @param {(key: string) => string} [t] - Translator returning localized messages
 * @returns The schema validating both client submit and server payload
 */
export const buildVolunteerSchema = (t?: (key: string) => string) => {
  // Resolve translator messages with sensible neutral fallbacks
  const msg = (key: string, fallback: string) => t?.(key) ?? fallback

  return z.object({
    name: z
      .string()
      .min(VOLUNTEER_LIMITS.NAME_MIN, { message: msg('nameError', 'Invalid name') })
      .max(VOLUNTEER_LIMITS.NAME_MAX),
    email: z
      .string()
      .email({ message: msg('emailError', 'Invalid email') })
      .max(VOLUNTEER_LIMITS.EMAIL_MAX),
    phone: z
      .string()
      .min(VOLUNTEER_LIMITS.PHONE_MIN, { message: msg('phoneError', 'Invalid phone') })
      .max(VOLUNTEER_LIMITS.PHONE_MAX),
    area: z.string().refine((value) => (volunteerAreaKeys as readonly string[]).includes(value), {
      message: msg('areaError', 'Invalid area'),
    }),
    availability: z
      .string()
      .min(VOLUNTEER_LIMITS.AVAILABILITY_MIN, {
        message: msg('availabilityError', 'Invalid availability'),
      })
      .max(VOLUNTEER_LIMITS.AVAILABILITY_MAX),
    experience: z.string().max(VOLUNTEER_LIMITS.EXPERIENCE_MAX),
    terms: z
      .boolean()
      .refine((val) => val === true, { message: msg('termsError', 'Terms required') }),
  })
}

/**
 * The {@link VolunteerPayload} type
 * @description Validated volunteer form fields (no transport-only extras)
 */
export type VolunteerPayload = z.infer<ReturnType<typeof buildVolunteerSchema>>

/**
 * The {@link volunteerRequestSchema} constant
 * @description Wire-level schema validated by the route handler. Adds the
 * Turnstile token and the active locale alongside the payload.
 */
export const volunteerRequestSchema = buildVolunteerSchema().extend({
  turnstileToken: z.string().min(1),
  locale: z.enum(locales),
})

/**
 * The {@link VolunteerRequest} type
 * @description Wire request body accepted by the volunteer route handler
 */
export type VolunteerRequest = z.infer<typeof volunteerRequestSchema>

/**
 * The {@link volunteerErrorCode} constant
 * @description Stable error codes the client maps to localized banners
 */
export const volunteerErrorCode = {
  VALIDATION: 'validation',
  TURNSTILE: 'turnstile',
  RATE_LIMIT: 'rate_limit',
  EMAIL_FAILED: 'email_failed',
  STORAGE_FAILED: 'storage_failed',
  UNKNOWN: 'unknown',
} as const

/**
 * The {@link VolunteerErrorCode} type
 * @description Union of values from {@link volunteerErrorCode}
 */
export type VolunteerErrorCode = (typeof volunteerErrorCode)[keyof typeof volunteerErrorCode]

/**
 * The {@link VolunteerResponse} type
 * @description Discriminated response returned by the volunteer route handler
 */
export type VolunteerResponse = { ok: true } | { ok: false; code: VolunteerErrorCode }
