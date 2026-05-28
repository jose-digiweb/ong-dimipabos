import * as z from 'zod'

import { locales } from '@/i18n/config'

/**
 * The {@link CONTACT_LIMITS} constant
 * @description Length bounds for every contact form field. Mirrored in the
 * client component for input `maxLength` attributes.
 */
export const CONTACT_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 120,
  EMAIL_MAX: 254,
  SUBJECT_MIN: 2,
  SUBJECT_MAX: 120,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 2000,
} as const

/**
 * The {@link buildContactSchema} factory
 * @description Builds a zod schema for the contact form with locale-aware error
 * messages. Pass the resolved next-intl translator for the `contactForm`
 * namespace; pass `undefined` for the server route to fall back to terse,
 * locale-neutral messages.
 * @param {(key: string) => string} [t] - Translator returning localized messages
 * @returns The schema validating both client submit and server payload
 */
export const buildContactSchema = (t?: (key: string) => string) => {
  // Resolve translator messages with sensible neutral fallbacks
  const msg = (key: string, fallback: string) => t?.(key) ?? fallback

  return z.object({
    name: z
      .string()
      .min(CONTACT_LIMITS.NAME_MIN, { message: msg('nameError', 'Invalid name') })
      .max(CONTACT_LIMITS.NAME_MAX),
    email: z
      .string()
      .email({ message: msg('emailError', 'Invalid email') })
      .max(CONTACT_LIMITS.EMAIL_MAX),
    subject: z
      .string()
      .min(CONTACT_LIMITS.SUBJECT_MIN, { message: msg('subjectError', 'Invalid subject') })
      .max(CONTACT_LIMITS.SUBJECT_MAX),
    message: z
      .string()
      .min(CONTACT_LIMITS.MESSAGE_MIN, { message: msg('messageError', 'Invalid message') })
      .max(CONTACT_LIMITS.MESSAGE_MAX),
    consent: z
      .boolean()
      .refine((val) => val === true, { message: msg('consentError', 'Consent required') }),
  })
}

/**
 * The {@link ContactPayload} type
 * @description Validated contact form fields (no transport-only extras)
 */
export type ContactPayload = z.infer<ReturnType<typeof buildContactSchema>>

/**
 * The {@link contactRequestSchema} constant
 * @description Wire-level schema validated by the route handler. Adds the
 * Turnstile token and the active locale alongside the contact payload.
 */
export const contactRequestSchema = buildContactSchema().extend({
  turnstileToken: z.string().min(1),
  locale: z.enum(locales),
})

/**
 * The {@link ContactRequest} type
 * @description Wire request body accepted by the contact route handler
 */
export type ContactRequest = z.infer<typeof contactRequestSchema>

/**
 * The {@link contactErrorCode} constant
 * @description Stable error codes the client maps to localized banners
 */
export const contactErrorCode = {
  VALIDATION: 'validation',
  TURNSTILE: 'turnstile',
  RATE_LIMIT: 'rate_limit',
  EMAIL_FAILED: 'email_failed',
  STORAGE_FAILED: 'storage_failed',
  UNKNOWN: 'unknown',
} as const

/**
 * The {@link ContactErrorCode} type
 * @description Union of values from {@link contactErrorCode}
 */
export type ContactErrorCode = (typeof contactErrorCode)[keyof typeof contactErrorCode]

/**
 * The {@link ContactResponse} type
 * @description Discriminated response returned by the contact route handler
 */
export type ContactResponse = { ok: true } | { ok: false; code: ContactErrorCode }
