import { getCloudflareContext } from '@opennextjs/cloudflare'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'

import { VolunteerSubmissionEmail } from '@/emails/volunteer-submission'
import { volunteerSubmissionRepository } from '@/lib/db'
import {
  type VolunteerArea,
  type VolunteerErrorCode,
  type VolunteerResponse,
  volunteerErrorCode,
  volunteerRequestSchema,
} from '@/lib/forms/volunteer-schema'
import { logger } from '@/lib/logger'
import { verifyTurnstileToken } from '@/lib/security/turnstile'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The {@link MAX_IP_HASH_HEX} constant
 * @description Hex characters of the SHA-256 hash kept for IP fingerprinting
 */
const MAX_IP_HASH_HEX = 32

/**
 * The {@link subjectLine} constant
 * @description Localized email subject prefix for volunteer applications
 */
const subjectLine = {
  pt: 'Nova candidatura de voluntário',
  en: 'New volunteer application',
} as const

/**
 * The {@link failResponse} helper
 * @description Builds a typed error response with a stable code
 */
const failResponse = (code: VolunteerErrorCode, status: number) =>
  NextResponse.json<VolunteerResponse>({ ok: false, code }, { status })

/**
 * The {@link hashIp} helper
 * @description SHA-256 hashes the client IP for low-resolution fingerprinting
 */
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, MAX_IP_HASH_HEX)
}

/**
 * The {@link POST} handler
 * @description Validates the volunteer payload, verifies Turnstile, persists
 * the submission to D1, and dispatches a localized email notification via the
 * Cloudflare Email Sending binding.
 * @param {Request} request - The incoming POST request
 * @returns A JSON response indicating success or a stable error code
 */
export async function POST(request: Request) {
  // Read the Cloudflare bindings and env vars for this request
  const { env } = getCloudflareContext()

  // Parse the JSON body, guarding against malformed payloads
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return failResponse(volunteerErrorCode.VALIDATION, 400)
  }

  // Validate the wire payload with the shared zod schema
  const parsed = volunteerRequestSchema.safeParse(json)
  if (!parsed.success) return failResponse(volunteerErrorCode.VALIDATION, 400)
  const payload = parsed.data

  // Verify the Turnstile token before doing any further work
  const remoteIp = request.headers.get('cf-connecting-ip')
  const secret = env.TURNSTILE_SECRET_KEY
  if (!secret) {
    logger.error('Volunteer form: TURNSTILE_SECRET_KEY is not configured', '')
    return failResponse(volunteerErrorCode.UNKNOWN, 500)
  }
  const turnstile = await verifyTurnstileToken({
    token: payload.turnstileToken,
    secret,
    remoteIp,
  })
  if (!turnstile.ok) {
    logger.warn(`Volunteer form: turnstile failed (${turnstile.errorCodes.join(',')})`, '')
    return failResponse(volunteerErrorCode.TURNSTILE, 400)
  }

  // Persist the submission with status `received`
  const userAgent = request.headers.get('user-agent')
  const ipHash = remoteIp ? await hashIp(remoteIp) : null
  let submissionId: string
  try {
    const row = await volunteerSubmissionRepository.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      area: payload.area,
      availability: payload.availability,
      experience: payload.experience,
      locale: payload.locale,
      ipHash,
      userAgent,
    })
    submissionId = row.id
  } catch (error) {
    logger.error('Volunteer form: failed to persist submission', '', error as Error)
    return failResponse(volunteerErrorCode.STORAGE_FAILED, 500)
  }

  // Render the email body from the React Email template
  const submittedAt = new Date()
  const element = VolunteerSubmissionEmail({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    area: payload.area as VolunteerArea,
    availability: payload.availability,
    experience: payload.experience,
    locale: payload.locale,
    submittedAt,
  })
  const html = await render(element)
  const text = await render(element, { plainText: true })

  // Dispatch via the Cloudflare Email Sending binding
  const fromAddress = env.CONTACT_FROM_ADDRESS
  const fromName = env.CONTACT_FROM_NAME
  const toAddress = env.CONTACT_TO_ADDRESS
  try {
    await env.EMAIL.send({
      to: toAddress,
      from: { email: fromAddress, name: fromName },
      replyTo: payload.email,
      subject: `${subjectLine[payload.locale]} — ${payload.name}`,
      html,
      text,
    })
  } catch (error) {
    // Cloudflare Email errors expose a stable `.code` field
    const code = (error as { code?: string }).code ?? 'unknown'
    logger.error(`Volunteer form: email send failed (${code})`, '', error as Error)
    await volunteerSubmissionRepository.markFailed(submissionId, code).catch(() => undefined)

    if (code === 'E_RATE_LIMIT_EXCEEDED') {
      return failResponse(volunteerErrorCode.RATE_LIMIT, 429)
    }
    return failResponse(volunteerErrorCode.EMAIL_FAILED, 502)
  }

  // Mark the submission as sent — best effort, never blocks the success path
  await volunteerSubmissionRepository.markSent(submissionId).catch((error) => {
    logger.warn('Volunteer form: markSent failed (non-blocking)', '', {
      message: (error as Error).message,
    })
  })

  return NextResponse.json<VolunteerResponse>({ ok: true })
}
