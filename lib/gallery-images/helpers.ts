import { SITE_URL } from '@/lib/seo/constants'

import { GALLERY_IMAGES_PATH } from './constants'
import type { GalleryImageFile } from './types'

/**
 * The {@link getGalleryImageUrl} helper
 * @description Builds the absolute URL of a gallery photo, so Cloudflare Image Transformations can resize it
 * @param {GalleryImageFile} file - The photo's file name
 * @returns {string} The absolute URL on the site origin
 */
export function getGalleryImageUrl(file: GalleryImageFile): string {
  return `${SITE_URL}${GALLERY_IMAGES_PATH}/${file}`
}
