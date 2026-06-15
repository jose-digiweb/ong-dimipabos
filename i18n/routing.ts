import { defineRouting } from 'next-intl/routing'

import { defaultLocale, locales } from './config'

/**
 * The {@link routing} constant
 * @description next-intl routing definition. The default locale (`pt`) is served
 * unprefixed (`/`, `/sobre`) while every other locale keeps its prefix (`/en`,
 * `/en/sobre`). Automatic locale detection is disabled so the bare root resolves
 * deterministically to the default locale — better for crawlers and edge caching;
 * users switch explicitly via the language switcher.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
})
