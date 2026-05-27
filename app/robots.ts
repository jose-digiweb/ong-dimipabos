import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo/constants'

/**
 * The {@link robots} route handler
 * @description Emits the robots.txt content, allowing all user agents except on API routes and linking the sitemap
 * @returns {MetadataRoute.Robots} The robots configuration consumed by Next.js
 */
export default function robots(): MetadataRoute.Robots {
  // Allow indexing of all public routes and disallow internal API endpoints
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
