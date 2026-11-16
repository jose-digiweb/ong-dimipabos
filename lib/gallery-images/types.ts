import type { GALLERY_IMAGE_FILES } from './constants'

/**
 * The {@link GalleryImageFile} union
 * @description One of the {@link GALLERY_IMAGE_FILES} file names
 */
export type GalleryImageFile = (typeof GALLERY_IMAGE_FILES)[number]

/**
 * The {@link GalleryImage} type
 * @description A gallery photo as the UI consumes it
 */
export type GalleryImage = {
  key: GalleryImageFile
  url: string
}
