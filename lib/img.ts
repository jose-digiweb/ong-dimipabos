import { SITE_URL } from './seo/constants'

/**
 * The {@link CDN_CGI_IMAGE_PREFIX} constant
 * @description Cloudflare Image Transformations same-origin URL prefix
 */
const CDN_CGI_IMAGE_PREFIX = '/cdn-cgi/image/'

/**
 * The {@link DEFAULT_FORMAT} constant
 * @description Default output format — `auto` lets Cloudflare pick AVIF/WebP/JPEG per UA
 */
const DEFAULT_FORMAT = 'auto'

/**
 * The {@link DEFAULT_QUALITY} constant
 * @description Default encoding quality — `auto` lets Cloudflare adapt to UA save-data hints
 */
const DEFAULT_QUALITY = 'auto'

/**
 * The {@link DEFAULT_FIT} constant
 * @description Default resize behaviour when callers don't specify one
 */
const DEFAULT_FIT = 'cover'

/**
 * The {@link cfImageFit} enum
 * @description Supported `fit` values mirrored from the Cloudflare Image Transformations API
 */
export const cfImageFit = {
  COVER: 'cover',
  CONTAIN: 'contain',
  CROP: 'crop',
  SCALE_DOWN: 'scale-down',
} as const

/**
 * The {@link CfImageFit} union
 * @description The value type for the {@link cfImageFit} enum
 */
export type CfImageFit = (typeof cfImageFit)[keyof typeof cfImageFit]

/**
 * The {@link CfImageOptions} type
 * @description Options accepted by the {@link cfImage} helper
 */
export type CfImageOptions = {
  width?: number
  height?: number
  fit?: CfImageFit
  quality?: number | 'auto'
}

/**
 * The {@link cfImage} helper
 * @description Wraps a source URL in a Cloudflare Image Transformations URL on the site zone
 * @param {string} src - The absolute http(s) source URL (typically R2)
 * @param {CfImageOptions} [options] - Optional width, height, fit, quality
 * @returns {string} The transformed CDN URL, or the original src for non-http sources
 *
 * @example
 * cfImage('https://storage.ongdimipabos.org/org/29.jpeg', { width: 1200, fit: 'cover' })
 * // → https://ongdimipabos.org/cdn-cgi/image/format=auto,quality=auto,fit=cover,width=1200/https://storage.ongdimipabos.org/org/29.jpeg
 */
export const cfImage = (src: string, options: CfImageOptions = {}): string => {
  // Pass through non-http sources (e.g. static imports, data URIs, local paths)
  if (!src.startsWith('http')) {
    return src
  }

  // Build the comma-joined transform spec with sensible defaults
  const parts: string[] = [
    `format=${DEFAULT_FORMAT}`,
    `quality=${options.quality ?? DEFAULT_QUALITY}`,
    `fit=${options.fit ?? DEFAULT_FIT}`,
  ]

  // Append width when provided
  if (options.width) {
    parts.push(`width=${options.width}`)
  }

  // Append height when provided
  if (options.height) {
    parts.push(`height=${options.height}`)
  }

  // Compose the final same-origin transformation URL
  return `${SITE_URL}${CDN_CGI_IMAGE_PREFIX}${parts.join(',')}/${src}`
}
