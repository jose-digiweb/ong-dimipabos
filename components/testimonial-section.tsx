import { Quote } from 'lucide-react'
import Image from 'next/image'

import testimonialImage from '@/assets/testimonial/testimonial.jpg'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { SectionDescription } from './section/SectionDescription'
import { SectionTitle } from './section/SectionTitle'

/**
 * The {@link testimonialCopy} constant
 * @description Static Portuguese copy for the testimonial section
 */
const testimonialCopy = {
  SECTION_TITLE: 'Histórias de Impacto',
  SECTION_DESCRIPTION:
    'Conheça algumas das vidas que foram transformadas através do nosso trabalho.',
  IMAGE_ALT: 'Maria em sua nova casa',
  QUOTE:
    'Hoje, tenho um lugar para chamar de lar. A DI MI PA BÔS não apenas me deu uma casa, mas me devolveu a dignidade e a esperança em um futuro melhor.',
  AUTHOR_NAME: 'Maria',
  AUTHOR_ROLE: 'Beneficiária do Projeto Habitação Digna',
} as const

/**
 * The {@link TestimonialSection} component
 * @description Renders the highlighted beneficiary testimonial card
 * @returns The rendered testimonial section
 */
export function TestimonialSection() {
  // Render the centred title plus the two-column testimonial card
  return (
    <section className='py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <SectionTitle>{testimonialCopy.SECTION_TITLE}</SectionTitle>
          <SectionDescription>{testimonialCopy.SECTION_DESCRIPTION}</SectionDescription>
        </div>

        <div className='mt-16'>
          <Card className='overflow-hidden'>
            <div className='grid md:grid-cols-2'>
              <div className='relative aspect-square md:aspect-auto'>
                <Image
                  fill
                  src={testimonialImage}
                  alt={testimonialCopy.IMAGE_ALT}
                  className='h-full w-full object-cover'
                />
              </div>

              <CardContent className='flex flex-col justify-center p-8'>
                <Quote className='size-8 text-secondary' />
                <CardHeader className='p-0'>
                  <blockquote className='mt-4 text-lg text-muted-foreground'>
                    {testimonialCopy.QUOTE}
                  </blockquote>

                  <footer className='mt-4'>
                    <p className='font-semibold text-foreground'>{testimonialCopy.AUTHOR_NAME}</p>
                    <p className='text-muted-foreground text-sm'>{testimonialCopy.AUTHOR_ROLE}</p>
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
