import type { MetadataRoute } from 'next'

import { defaultLocale, locales } from '@/i18n/config'
import { projects } from '@/lib/data'
import { buildLocalizedUrl } from '@/lib/seo/metadata'

/**
 * The {@link staticRoute} constant
 * @description Static, publicly indexable routes plus their crawl hints. Paths
 * are locale-less here and combined with each supported locale at build time.
 */
const staticRoute = [
  { path: '', changeFrequency: 'monthly', priority: 1 },
  { path: '/sobre', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/projetos', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contato', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/como-ajudar/doar', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/como-ajudar/voluntario', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/como-ajudar/parceiros', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/politica-de-privacidade', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/termos', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
] as const satisfies readonly {
  path: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}[]

/**
 * The {@link buildAlternates} helper
 * @description Produces the `alternates.languages` map for a given locale-less path
 * @param {string} path - The locale-less path (may be empty for the homepage)
 * @returns {Record<string, string>} The map of locale codes to absolute URLs
 */
const buildAlternates = (path: string): Record<string, string> => {
  // Build one entry per supported locale (default locale is served unprefixed)
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, buildLocalizedUrl(locale, path)]),
  )

  // Include an x-default pointing at the unprefixed default-locale URL
  return { ...languages, 'x-default': buildLocalizedUrl(defaultLocale, path) }
}

/**
 * The {@link sitemap} route handler
 * @description Emits sitemap.xml entries for every static route in every locale,
 * plus every project detail page in every locale, with `alternates.languages`
 * hreflang links between them.
 * @returns {MetadataRoute.Sitemap} The sitemap entries consumed by Next.js
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Compute a single timestamp so every entry shares the build time
  const lastModified = new Date()

  // Build sitemap entries for the static routes across every locale
  const staticEntries: MetadataRoute.Sitemap = staticRoute.flatMap((route) =>
    locales.map((locale) => ({
      url: buildLocalizedUrl(locale, route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: buildAlternates(route.path) },
    })),
  )

  // Build sitemap entries for the dynamic project routes across every locale
  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((project) =>
    locales.map((locale) => ({
      url: buildLocalizedUrl(locale, `/projetos/${project.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages: buildAlternates(`/projetos/${project.slug}`) },
    })),
  )

  // Return the combined sitemap
  return [...staticEntries, ...projectEntries]
}
