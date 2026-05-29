import { Quote } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import testimonialImage from '@/assets/testimonial/testimonial.webp'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { SectionDescription } from './section/SectionDescription'
import { SectionTitle } from './section/SectionTitle'

/**
 * The {@link TestimonialSection} component
 * @description Renders the highlighted beneficiary testimonial card
 * @returns The rendered testimonial section
 */
export function TestimonialSection() {
  // Read the locale-aware testimonial translations
  const t = useTranslations('testimonial')

  // Render the centred title plus the two-column testimonial card
  return (
    <section className='py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <SectionTitle>{t('sectionTitle')}</SectionTitle>
          <SectionDescription>{t('sectionDescription')}</SectionDescription>
        </div>

        <div className='mt-16'>
          <Card className='overflow-hidden'>
            <div className='grid md:grid-cols-2'>
              <div className='relative aspect-square md:aspect-auto'>
                <Image
                  fill
                  src={testimonialImage}
                  alt={t('imageAlt')}
                  className='h-full w-full object-cover'
                />
              </div>

              <CardContent className='flex flex-col justify-center p-8'>
                <Quote className='size-8 text-secondary' />
                <CardHeader className='p-0'>
                  <blockquote className='mt-4 text-lg text-muted-foreground'>
                    {t('quote')}
                  </blockquote>

                  <footer className='mt-4'>
                    <p className='font-semibold text-foreground'>{t('authorName')}</p>
                    <p className='text-muted-foreground text-sm'>{t('authorRole')}</p>
                  </footer>
                </CardHeader>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
