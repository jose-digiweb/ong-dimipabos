import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { SectionDescription, SectionTitle } from '../section'
import { CTAButton } from './CTAButton'
import { ctaRoute } from './constants'
import type { CTASectionProps } from './types'

/**
 * The {@link CTASection} component
 * @description Highlighted section that combines the donation CTA and a volunteer button
 * @param {CTASectionProps} props - The component props
 * @param {string} [props.className] - Optional extra class names for the wrapping section
 * @returns The rendered CTA section
 */
export const CTASection = ({ className }: CTASectionProps) => {
  // Read the locale-aware section translations
  const t = useTranslations('cta')

  // Render the section composed of a badge, headline, copy and dual CTAs
  return (
    <section className={cn('bg-primary py-16 text-primary-foreground', className)}>
      <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
        <div className='mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 font-medium text-sm text-white'>
          <span className='relative mr-2 flex h-3 w-3'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75' />
            <span className='relative inline-flex h-3 w-3 rounded-full bg-secondary' />
          </span>
          {t('badge')}
        </div>

        <SectionTitle className='text-primary-foreground'>{t('title')}</SectionTitle>
        <SectionDescription className='text-primary-foreground'>
          {t('description')}
        </SectionDescription>

        <div className='mt-8 flex justify-center gap-4'>
          <CTAButton />
          <Button
            render={<Link href={ctaRoute.VOLUNTEER} />}
            nativeButton={false}
            size='lg'
            variant='outlineInverse'
          >
            {t('volunteerButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}
