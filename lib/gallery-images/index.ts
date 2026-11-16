import { GALLERY_IMAGE_FILES } from './constants'
import { getGalleryImageUrl } from './helpers'
import type { GalleryImage } from './types'

export { getGalleryImageUrl } from './helpers'
export type { GalleryImage, GalleryImageFile } from './types'

/**
 * The {@link getGalleryImages} function
 * @description Lists the gallery photos shipped with the site as static assets
 * @returns {GalleryImage[]} The gallery photos with their public URLs
 */
export function getGalleryImages(): GalleryImage[] {
  return GALLERY_IMAGE_FILES.map((file) => ({ key: file, url: getGalleryImageUrl(file) }))
}
