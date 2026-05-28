import { getCloudflareContext } from '@opennextjs/cloudflare'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'

import { ContactSubmissionEmail } from '@/emails/contact-submission'
import { contactSubmissionRepository } from '@/lib/db'
import {
  type ContactErrorCode,
  type ContactResponse,
  contactErrorCode,
  contactRequestSchema,
} from '@/lib/forms/contact-schema'
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
 * The {@link failResponse} helper
 * @description Builds a typed error response with a stable code
 */
const failResponse = (code: ContactErrorCode, status: number) =>
  NextResponse.json<ContactResponse>({ ok: false, code }, { status })

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
 * @description Validates the payload, verifies the Turnstile token, persists
 * the submission to D1, and dispatches an email notification via the Cloudflare
 * Email Sending binding. Returns a discriminated `{ok}` response.
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
    return failResponse(contactErrorCode.VALIDATION, 400)
  }

  // Validate the wire payload with the shared zod schema
  const parsed = contactRequestSchema.safeParse(json)
  if (!parsed.success) return failResponse(contactErrorCode.VALIDATION, 400)
  const payload = parsed.data

  // Verify the Turnstile token before doing any further work
  const remoteIp = request.headers.get('cf-connecting-ip')
  const secret = env.TURNSTILE_SECRET_KEY
  if (!secret) {
    logger.error('Contact form: TURNSTILE_SECRET_KEY is not configured', '')
    return failResponse(contactErrorCode.UNKNOWN, 500)
  }
  const turnstile = await verifyTurnstileToken({
    token: payload.turnstileToken,
    secret,
    remoteIp,
  })
  if (!turnstile.ok) {
    logger.warn(`Contact form: turnstile failed (${turnstile.errorCodes.join(',')})`, '')
    return failResponse(contactErrorCode.TURNSTILE, 400)
  }

  // Persist the submission with status `received`
  const userAgent = request.headers.get('user-agent')
  const ipHash = remoteIp ? await hashIp(remoteIp) : null
  let submissionId: string
  try {
    const row = await contactSubmissionRepository.create({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      locale: payload.locale,
      ipHash,
      userAgent,
    })
    submissionId = row.id
  } catch (error) {
    logger.error('Contact form: failed to persist submission', '', error as Error)
    return failResponse(contactErrorCode.STORAGE_FAILED, 500)
  }

  // Render the email body from the React Email template
  const submittedAt = new Date()
  const element = ContactSubmissionEmail({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
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
      subject: `${fromName} — ${payload.subject}`,
      html,
      text,
    })
  } catch (error) {
    // Cloudflare Email errors expose a stable `.code` field
    const code = (error as { code?: string }).code ?? 'unknown'
    logger.error(`Contact form: email send failed (${code})`, '', error as Error)
    await contactSubmissionRepository.markFailed(submissionId, code).catch(() => undefined)

    // Surface rate-limit and validation errors distinctly when present
    if (code === 'E_RATE_LIMIT_EXCEEDED') {
      return failResponse(contactErrorCode.RATE_LIMIT, 429)
    }
    return failResponse(contactErrorCode.EMAIL_FAILED, 502)
  }

  // Mark the submission as sent — best effort, never blocks the success path
  await contactSubmissionRepository.markSent(submissionId).catch((error) => {
    logger.warn('Contact form: markSent failed (non-blocking)', '', {
      message: (error as Error).message,
    })
  })

  return NextResponse.json<ContactResponse>({ ok: true })
}
