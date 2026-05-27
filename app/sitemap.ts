import type { MetadataRoute } from 'next'

import { projects } from '@/lib/data'
import { SITE_URL } from '@/lib/seo/constants'

/**
 * The {@link staticRoute} constant
 * @description Static, publicly indexable routes plus their crawl hints
 */
const staticRoute = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/sobre', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/projetos', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contato', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/como-ajudar/doar', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/como-ajudar/voluntario', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/como-ajudar/parceiros', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/politica-de-privacidade', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/termos', changeFrequency: 'yearly', priority: 0.3 },
] as const satisfies readonly {
  path: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}[]

/**
 * The {@link sitemap} route handler
 * @description Emits the sitemap.xml entries for static routes plus every project detail page
 * @returns {MetadataRoute.Sitemap} The sitemap entries consumed by Next.js
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Compute a single timestamp so every entry shares the build time
  const lastModified = new Date()

  // Build sitemap entries for the static routes
  const staticEntries: MetadataRoute.Sitemap = staticRoute.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // Build sitemap entries for the dynamic project routes
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projetos/${project.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Return the combined sitemap
  return [...staticEntries, ...projectEntries]
}
