import type { Metadata } from 'next'

import { defaultLocale, type Locale, localeOgCodes, locales } from '@/i18n/config'

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './constants'

/**
 * The {@link BuildMetadataParams} type
 * @description Inputs for the {@link buildMetadata} helper
 */
export type BuildMetadataParams = {
  title: string
  description?: string
  path: string
  locale: Locale
  image?: string
  ogType?: 'website' | 'article'
}

/**
 * The {@link buildLocalizedUrl} helper
 * @description Builds the absolute URL for a given locale and route path
 * @param {Locale} locale - The locale code to prefix
 * @param {string} path - The route path starting with a slash
 * @returns {string} The absolute, locale-prefixed URL
 */
const buildLocalizedUrl = (locale: Locale, path: string): string => {
  // Normalise the trailing slash on the path
  const normalisedPath = path === '/' ? '' : path

  // Return the absolute, locale-prefixed URL
  return `${SITE_URL}/${locale}${normalisedPath}`
}

/**
 * The {@link buildMetadata} helper
 * @description Builds a per-route {@link Metadata} object with locale-aware canonical URL, hreflang alternates plus aligned Open Graph and Twitter cards
 * @param {BuildMetadataParams} params - The metadata inputs
 * @param {string} params.title - The page title (template suffix is applied by the root layout)
 * @param {string} [params.description] - The meta description; falls back to the site default
 * @param {string} params.path - The locale-independent route path starting with a slash
 * @param {Locale} params.locale - The active locale, used for canonical and OG locale
 * @param {string} [params.image] - An absolute or root-relative image URL used for OG and Twitter cards
 * @param {'website' | 'article'} [params.ogType] - The Open Graph type; defaults to website
 * @returns {Metadata} The built metadata object
 */
export function buildMetadata({
  title,
  description,
  path,
  locale,
  image,
  ogType,
}: BuildMetadataParams): Metadata {
  // Resolve the absolute canonical URL for the active locale
  const canonicalUrl = buildLocalizedUrl(locale, path)

  // Build the hreflang alternates map (one entry per locale plus x-default)
  const languages = Object.fromEntries(
    locales.map((entry) => [entry, buildLocalizedUrl(entry, path)] as const),
  ) as Record<Locale, string>

  // Fall back to the site description when the page does not supply one
  const resolvedDescription = description ?? SITE_DESCRIPTION

  // Resolve the OG type with a website default
  const resolvedType = ogType ?? 'website'

  // Build the OG images array only when an image is provided so the file convention default still applies
  const ogImages = image ? [{ url: image }] : undefined

  // Return the merged metadata object
  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languages,
        'x-default': buildLocalizedUrl(defaultLocale, path),
      },
    },
    openGraph: {
      type: resolvedType,
      locale: localeOgCodes[locale],
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description: resolvedDescription,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resolvedDescription,
      images: ogImages ? [image as string] : undefined,
    },
  }
}
