import { TRAILING_SLASH_REGEX, r2ImagesEnv } from './constants'

/**
 * The {@link getPublicBaseUrl} helper
 * @description Reads the R2 public base URL from env and strips any trailing slash
 * @returns {string} The normalized base URL or an empty string when not configured
 */
export function getPublicBaseUrl(): string {
  // Read the configured public URL from process env
  const raw = process.env[r2ImagesEnv.PUBLIC_URL]

  // Return an empty string when the env var is not set
  if (!raw) {
    return ''
  }

  // Strip a trailing slash so callers can safely concatenate with `/key`
  return raw.replace(TRAILING_SLASH_REGEX, '')
}
