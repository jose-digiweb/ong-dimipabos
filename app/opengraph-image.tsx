import { renderOgImage } from '@/lib/seo/og-image'

/**
 * The {@link alt} export
 * @description Alt text for the Open Graph image
 */
export const alt =
  'DI MI PA BÔS — Transformando vidas na Guiné-Bissau. Construindo o primeiro centro de tratamento e reabilitação.'

/**
 * The {@link size} export
 * @description Image dimensions used by the Open Graph file convention
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
 * @description Generates the Open Graph social card via {@link renderOgImage}
 * @returns The composed image response
 */
export default function Image() {
  // Delegate to the shared OG renderer with the OG dimensions
  return renderOgImage(size)
}
