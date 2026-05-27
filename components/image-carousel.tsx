import Image from 'next/image'

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
 * @description Number of leading images to mark with `priority` for LCP
 */
const CAROUSEL_PRIORITY_COUNT = 3

/**
 * The {@link CAROUSEL_IMAGE_SIZES} constant
 * @description `sizes` attribute used by the carousel images
 */
const CAROUSEL_IMAGE_SIZES = '(max-width: 768px) 100vw, 50vw'

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
              alt={image.key ?? ''}
              src={image.url}
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
