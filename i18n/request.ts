import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { defaultLocale } from './config'
import { routing } from './routing'

/**
 * The default {@link getRequestConfig} export
 * @description Resolves the active locale from the URL segment and loads the matching
 * message catalog. Falls back to the default locale when the segment is missing or invalid.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Resolve the requested locale and validate it against the supported set
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : defaultLocale

  // Load the matching message catalog
  const messages = (await import(`../messages/${locale}.json`)).default

  // Return the request-scoped config consumed by next-intl
  return {
    locale,
    messages,
  }
})
