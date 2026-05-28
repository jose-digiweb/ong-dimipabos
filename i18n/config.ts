/**
 * The {@link locales} constant
 * @description Supported locale codes — the source of truth for `Locale` typing
 */
export const locales = ['pt', 'en'] as const

/**
 * The {@link Locale} type
 * @description Union of every value in {@link locales}
 */
export type Locale = (typeof locales)[number]

/**
 * The {@link defaultLocale} constant
 * @description Fallback locale used when Accept-Language detection yields no match
 */
export const defaultLocale: Locale = 'pt'

/**
 * The {@link localeLabels} constant
 * @description Human-readable labels surfaced by the language switcher
 */
export const localeLabels = {
  pt: 'Português',
  en: 'English',
} as const satisfies Record<Locale, string>

/**
 * The {@link localeFlags} constant
 * @description Emoji flag glyphs surfaced by the language switcher
 */
export const localeFlags = {
  pt: '🇵🇹',
  en: '🇬🇧',
} as const satisfies Record<Locale, string>

/**
 * The {@link localeOgCodes} constant
 * @description Open Graph `og:locale` codes mapped from app locales
 */
export const localeOgCodes = {
  pt: 'pt_PT',
  en: 'en_US',
} as const satisfies Record<Locale, string>
