/**
 * The {@link CLOUDINARY_HOST} constant
 * @description Hostname used to detect Cloudinary delivery URLs
 */
const CLOUDINARY_HOST = 'res.cloudinary.com'

/**
 * The {@link CLOUDINARY_UPLOAD_SEGMENT} constant
 * @description Path segment after which Cloudinary transformations are injected
 */
const CLOUDINARY_UPLOAD_SEGMENT = '/upload/'

/**
 * The {@link DEFAULT_CLOUDINARY_TRANSFORMS} constant
 * @description Transformations always applied: auto format + auto quality
 */
const DEFAULT_CLOUDINARY_TRANSFORMS = ['f_auto', 'q_auto'] as const

/**
 * The {@link CloudinaryImageOptions} type
 * @description Options for the {@link cloudinaryImage} helper
 */
export type CloudinaryImageOptions = {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'scale'
}

/**
 * The {@link cloudinaryImage} helper
 * @description Injects responsive `f_auto,q_auto` (and optional `w_`/`h_`/`c_`) transforms into a Cloudinary URL
 * @param {string} url - The original Cloudinary delivery URL
 * @param {CloudinaryImageOptions} [options] - Optional width, height and crop mode
 * @returns {string} The transformed URL, or the original URL when not a Cloudinary asset
 */
export const cloudinaryImage = (url: string, options?: CloudinaryImageOptions): string => {
  // Bail out fast for non-Cloudinary or malformed URLs
  if (!url.includes(CLOUDINARY_HOST) || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return url
  }

  // Build the transform segment
  const parts: string[] = [...DEFAULT_CLOUDINARY_TRANSFORMS]

  // Append width when provided
  if (options?.width) {
    parts.push(`w_${options.width}`)
  }

  // Append height when provided
  if (options?.height) {
    parts.push(`h_${options.height}`)
  }

  // Append crop mode when provided
  if (options?.crop) {
    parts.push(`c_${options.crop}`)
  }

  // Inject the transforms right after `/upload/`
  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${parts.join(',')}/`)
}
