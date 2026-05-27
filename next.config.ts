import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

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
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // R2 public bucket URL — update once you enable public access on the bucket
      // Format: pub-<hash>.r2.dev — add the specific hostname once known
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
}

export default nextConfig
