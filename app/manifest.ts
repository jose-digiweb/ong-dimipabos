import type { MetadataRoute } from 'next'

import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/seo/constants'

/**
 * The {@link manifest} route
 * @description Web app manifest for installability and PWA-style mobile metadata
 * @returns {MetadataRoute.Manifest} The manifest definition
 */
export default function manifest(): MetadataRoute.Manifest {
  // Return the manifest definition
  return {
    name: SITE_TITLE,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
