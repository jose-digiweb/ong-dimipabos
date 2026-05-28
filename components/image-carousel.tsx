import Image from 'next/image'

import { cfImage } from '@/lib/img'
import { getR2Images } from '@/lib/r2-images'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

/**
 * The {@link carouselOptions} constant
 * @description Embla options shared by the homepage image carousel
 */
const carouselOptions = {
  align: 'center',
  containScroll: 'keepSnaps',
  axis: 'x',
} as const

/**
 * The {@link CAROUSEL_PRIORITY_COUNT} constant
 * @description Number of leading images to mark with `priority` for LCP — carousel is below the fold, so eager loading is enough
 */
const CAROUSEL_PRIORITY_COUNT = 0

/**
 * The {@link CAROUSEL_IMAGE_SIZES} constant
 * @description `sizes` attribute used by the carousel images — matches `md:basis-1/2` then `lg:basis-1/3`
 */
const CAROUSEL_IMAGE_SIZES = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 34vw'

/**
 * The {@link CAROUSEL_ALT_PREFIX} constant
 * @description Descriptive prefix prepended to the humanized R2 key for accessibility
 */
const CAROUSEL_ALT_PREFIX = 'Momento dos projetos da DI MI PA BÔS na Guiné-Bissau'

/**
 * The {@link humanizeKey} helper
 * @description Turns an R2 object key into a human-readable label for `alt` text
 * @param {string} key - The R2 object key
 * @returns {string} The humanized label
 */
const humanizeKey = (key: string): string => {
  // Strip any folder prefix and the file extension
  const base =
    key
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '') ?? key

  // Replace separators with spaces and collapse whitespace
  return base.replace(/[-_]+/g, ' ').trim()
}

/**
 * The {@link ImageCarousel} component
 * @description Server component that loads R2 images and renders them as a centred carousel
 * @returns The rendered carousel
 */
export const ImageCarousel = async () => {
  // Fetch the list of R2 images at request time
  const images = await getR2Images()

  // Render the carousel with the loaded images
  return (
    <Carousel opts={carouselOptions} className='relative'>
      <CarouselContent className='h-96 gap-4 px-8'>
        {images.map((image, index) => (
          <CarouselItem
            key={image.key}
            className='relative overflow-hidden rounded-md md:basis-1/2 lg:basis-1/3'
          >
            <Image
              fill
              priority={index < CAROUSEL_PRIORITY_COUNT}
              alt={
                image.key
                  ? `${CAROUSEL_ALT_PREFIX} — ${humanizeKey(image.key)}`
                  : CAROUSEL_ALT_PREFIX
              }
              src={cfImage(image.url, { width: 800 })}
              sizes={CAROUSEL_IMAGE_SIZES}
              className='object-cover object-top'
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious variant='default' className='absolute left-4 z-10' />
      <CarouselNext variant='default' className='absolute right-4 z-10' />
    </Carousel>
  )
}
