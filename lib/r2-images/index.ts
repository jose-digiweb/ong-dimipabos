import { getCloudflareContext } from '@opennextjs/cloudflare'

import { getPublicBaseUrl } from './helpers'
import type { R2Image } from './types'

export type { R2Image } from './types'

/**
 * The {@link getR2Images} function
 * @description Lists every object in the configured R2 bucket and maps it to a UI-ready shape
 * @returns {Promise<R2Image[]>} The list of R2 images with public URLs
 */
export async function getR2Images(): Promise<R2Image[]> {
  // Resolve the Cloudflare bindings for the current request
  const { env } = getCloudflareContext()

  // Compute the public base URL once before iterating
  const publicBaseUrl = getPublicBaseUrl()

  // List every object in the bucket (no prefix / pagination — small bucket)
  const list = await env.R2_BUCKET.list()

  // Map each R2 object to the UI-facing R2Image shape
  return list.objects.map((object) => ({
    key: object.key,
    size: object.size,
    lastModified: object.uploaded,
    url: `${publicBaseUrl}/${object.key}`,
  }))
}
