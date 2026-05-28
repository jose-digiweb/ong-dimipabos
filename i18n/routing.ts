import { defineRouting } from 'next-intl/routing'

import { defaultLocale, locales } from './config'

/**
 * The {@link routing} constant
 * @description next-intl routing definition. Every URL is prefixed (`/pt`, `/en`)
 * and the default locale is used only as fallback when Accept-Language detection fails.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
})
