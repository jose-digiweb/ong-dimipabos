import { NextResponse } from 'next/server'

import { getR2Images } from '@/lib/r2-images'

/**
 * The {@link imagesApiCopy} constant
 * @description Static response messages for the images API
 */
const imagesApiCopy = {
  FETCH_ERROR: 'Failed to fetch images',
} as const

/**
 * The {@link IMAGES_ERROR_STATUS} constant
 * @description HTTP status returned when listing R2 images fails
 */
const IMAGES_ERROR_STATUS = 500

/**
 * The {@link GET} route handler
 * @description Returns the list of R2 images as JSON
 * @returns The JSON response with images or an error payload
 */
export async function GET() {
  try {
    // Fetch the list of images from R2
    const images = await getR2Images()

    // Return the successful payload
    return NextResponse.json({ images })
  } catch {
    // Return a generic 500 when fetching fails
    return NextResponse.json({ error: imagesApiCopy.FETCH_ERROR }, { status: IMAGES_ERROR_STATUS })
  }
}
