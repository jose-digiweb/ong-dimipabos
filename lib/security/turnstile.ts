/**
 * The {@link TURNSTILE_SITEVERIFY_URL} constant
 * @description Cloudflare Turnstile siteverify endpoint
 */
const TURNSTILE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * The {@link TurnstileVerifyInput} type
 * @description Input accepted by {@link verifyTurnstileToken}
 */
export type TurnstileVerifyInput = {
  token: string
  secret: string
  remoteIp?: string | null
}

/**
 * The {@link TurnstileVerifyResponse} type
 * @description Subset of the siteverify response we read
 */
type TurnstileVerifyResponse = {
  success: boolean
  'error-codes'?: string[]
}

/**
 * The {@link verifyTurnstileToken} function
 * @description Validates a Turnstile token against Cloudflare's siteverify
 * endpoint. Returns a discriminated result so callers can branch cleanly.
 * @param {TurnstileVerifyInput} input - The token, secret and optional client IP
 * @returns Either `{ ok: true }` or `{ ok: false, errorCodes }`
 */
export async function verifyTurnstileToken(
  input: TurnstileVerifyInput,
): Promise<{ ok: true } | { ok: false; errorCodes: string[] }> {
  // Build the URL-encoded form body required by the siteverify endpoint
  const body = new URLSearchParams()
  body.set('secret', input.secret)
  body.set('response', input.token)
  if (input.remoteIp) body.set('remoteip', input.remoteIp)

  // POST the verification request
  const res = await fetch(TURNSTILE_SITEVERIFY_URL, {
    method: 'POST',
    body,
  })

  // Network/HTTP-level failure
  if (!res.ok) return { ok: false, errorCodes: [`http_${res.status}`] }

  // Parse and branch on the verification outcome
  const data = (await res.json()) as TurnstileVerifyResponse
  if (data.success) return { ok: true }
  return { ok: false, errorCodes: data['error-codes'] ?? ['unknown'] }
}
