import type { Metadata } from 'next'

import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_URL } from './constants'

/**
 * The {@link BuildMetadataParams} type
 * @description Inputs for the {@link buildMetadata} helper
 */
export type BuildMetadataParams = {
  title: string
  description?: string
  path: string
  image?: string
  ogType?: 'website' | 'article'
}

/**
 * The {@link buildMetadata} helper
 * @description Builds a per-route {@link Metadata} object with canonical URL plus aligned Open Graph and Twitter cards
 * @param {BuildMetadataParams} params - The metadata inputs
 * @param {string} params.title - The page title (template suffix is applied by the root layout)
 * @param {string} [params.description] - The meta description; falls back to the site default
 * @param {string} params.path - The route path starting with a slash, used as canonical and OG url
 * @param {string} [params.image] - An absolute or root-relative image URL used for OG and Twitter cards
 * @param {'website' | 'article'} [params.ogType] - The Open Graph type; defaults to website
 * @returns {Metadata} The built metadata object
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  ogType,
}: BuildMetadataParams): Metadata {
  // Resolve the absolute canonical URL for this route
  const url = `${SITE_URL}${path}`

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
      canonical: url,
    },
    openGraph: {
      type: resolvedType,
      locale: SITE_LOCALE,
      url,
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
