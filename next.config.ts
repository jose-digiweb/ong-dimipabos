import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

initOpenNextCloudflareForDev()

/**
 * The {@link withNextIntl} plugin
 * @description Loads the request-scoped i18n config from `./i18n/request.ts`
 */
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/**
 * The {@link IMMUTABLE_CACHE_CONTROL} constant
 * @description Long-lived cache header applied to hashed/static assets
 */
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ongdimipabos.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.ongdimipabos.org',
        pathname: '/**',
      },
      // R2 public bucket URL — kept for fallback access when public bucket is used directly
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    // Long-cache the static file-convention icons and OG images (Next already handles `/_next/static/`)
    return [
      {
        source:
          '/:file(icon\\.png|apple-icon\\.png|opengraph-image\\.jpg|twitter-image\\.jpg|favicon\\.ico)',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE_CACHE_CONTROL }],
      },
    ]
  },
  async redirects() {
    // Permanently strip the redundant default-locale (`pt`) prefix from legacy URLs.
    // Before the `localePrefix: 'as-needed'` migration the Portuguese pages lived at
    // `/pt/*`; next-intl still normalises those to the unprefixed canonical, but only
    // with a *temporary* 307. Config redirects are evaluated ahead of the middleware,
    // so a `permanent: true` (308) redirect here overrides that 307 — telling Google
    // the move is permanent so it consolidates signals onto the canonical URL and
    // retires the old `/pt/*` entries instead of endlessly re-crawling them.
    return [
      { source: '/pt', destination: '/', permanent: true },
      { source: '/pt/:path*', destination: '/:path*', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
