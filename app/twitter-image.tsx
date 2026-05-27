import { renderOgImage } from '@/lib/seo/og-image'

/**
 * The {@link alt} export
 * @description Alt text for the Twitter card image
 */
export const alt =
  'DI MI PA BÔS — Transformando vidas na Guiné-Bissau. Construindo o primeiro centro de tratamento e reabilitação.'

/**
 * The {@link size} export
 * @description Image dimensions used by the Twitter file convention (matches OG)
 */
export const size = {
  width: 1200,
  height: 630,
} as const

/**
 * The {@link contentType} export
 * @description MIME type emitted by the file convention
 */
export const contentType = 'image/png'

/**
 * The default {@link Image} route
 * @description Generates the Twitter social card via {@link renderOgImage}
 * @returns The composed image response
 */
export default function Image() {
  // Delegate to the shared OG renderer with the Twitter dimensions
  return renderOgImage(size)
}
