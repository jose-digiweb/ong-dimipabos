'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * The {@link galleryFallback} constant
 * @description Fallback assets and labels for the gallery
 */
const galleryFallback = {
  PLACEHOLDER_SRC: '/placeholder.svg',
  IMAGE_ALT: 'Fotografia da galeria do projeto',
  CLOSE_LABEL: 'Fechar visualização da imagem',
  PREVIOUS_LABEL: 'Imagem anterior',
  NEXT_LABEL: 'Imagem seguinte',
} as const

/**
 * The {@link ImageGalleryProps} type
 * @description Props for the {@link ImageGallery} component
 */
type ImageGalleryProps = {
  images: string[]
  alt?: string
}

/**
 * The {@link ImageGallery} component
 * @description Responsive image grid with a lightbox for full-size viewing
 * @param {ImageGalleryProps} props - The component props
 * @param {string[]} props.images - The list of image URLs to render
 * @param {string} [props.alt] - Descriptive alt text shared by every image in the gallery
 * @returns The rendered gallery
 */
export function ImageGallery({ images, alt }: ImageGalleryProps) {
  // Resolve the alt text used by every image in the gallery
  const imageAlt = alt ?? galleryFallback.IMAGE_ALT
  // Index of the image currently shown in the lightbox
  const [currentImage, setCurrentImage] = useState(0)

  // Whether the lightbox overlay is visible
  const [showLightbox, setShowLightbox] = useState(false)

  // Advance to the next image, wrapping around the end of the list
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  // Go to the previous image, wrapping around the start of the list
  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  // Render the gallery grid and (conditionally) the lightbox overlay
  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {images.map((image, index) => (
          <Card
            key={image}
            className='group relative aspect-4/3 cursor-pointer overflow-hidden'
            onClick={() => {
              setCurrentImage(index)
              setShowLightbox(true)
            }}
          >
            <Image
              src={image || galleryFallback.PLACEHOLDER_SRC}
              alt={imageAlt}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
          </Card>
        ))}
      </div>

      {showLightbox && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'>
          <div className='relative max-h-[90vh] max-w-[90vw]'>
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-4 right-4 text-white hover:bg-white/20'
              onClick={() => setShowLightbox(false)}
              aria-label={galleryFallback.CLOSE_LABEL}
            >
              <X className='h-6 w-6' />
            </Button>
            <div className='relative aspect-4/3 min-h-[300px] w-full min-w-[300px] md:min-h-[500px] md:min-w-[500px]'>
              <Image
                src={images[currentImage] || galleryFallback.PLACEHOLDER_SRC}
                alt={imageAlt}
                fill
                className='object-contain'
              />
            </div>
            <div className='absolute inset-y-0 left-4 flex items-center'>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/20'
                onClick={(e) => {
                  e.stopPropagation()
                  previousImage()
                }}
                aria-label={galleryFallback.PREVIOUS_LABEL}
              >
                <ChevronLeft className='h-8 w-8' />
              </Button>
            </div>
            <div className='absolute inset-y-0 right-4 flex items-center'>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/20'
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                aria-label={galleryFallback.NEXT_LABEL}
              >
                <ChevronRight className='h-8 w-8' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
