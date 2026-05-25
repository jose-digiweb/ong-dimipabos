import { getR2Images } from '@/lib/r2-images'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

export const ImageCarousel = async () => {
  const images = await getR2Images()

  // Render the carousel with the images
  return (
    <Carousel
      opts={{
        align: 'center',
        containScroll: 'keepSnaps',
        axis: 'x',
      }}
      className='relative'
    >
      <CarouselContent className='h-96 gap-4 px-8'>
        {images.map((image, index) => (
          <CarouselItem
            key={image.key}
            className='relative overflow-hidden rounded-md md:basis-1/2 lg:basis-1/3'
          >
            <Image
              fill
              priority={index < 3}
              alt={image.key ?? ''}
              src={image.url}
              sizes='(max-width: 768px) 100vw, 50vw'
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
