import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Suspense } from 'react'

import cardImage from '@/assets/dimipabos_logo_2.webp'
import heroImage from '@/assets/heroSection/hero_image.webp'
import { CTAButton, CTASection } from '@/components/cta'
import type { Locale } from '@/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import {
  HeroCard,
  HeroCardSection,
  HeroDescription,
  HeroStats,
  HeroSubtitle,
  HeroTitle,
  HeroTopText,
  HeroWrapper,
} from '@/components/heroSection'
import { HomeProjectCard } from '@/components/HomeProjectCard'
import { ImageCarousel } from '@/components/image-carousel'
import { SectionDescription, SectionTitle } from '@/components/section'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

/**
 * The revalidate export
 * @description ISR cadence in seconds. The homepage carousel reads R2 once per
 * week, and Cloudflare Workers deploys reset the ISR cache automatically, so
 * the practical refresh interval is `min(1 week, next deploy)`.
 */
export const revalidate = 604800

/**
 * The {@link homeRoute} constant
 * @description Internal links surfaced from the homepage
 */
const homeRoute = {
  PROJECTS: '/projetos',
} as const

/**
 * The {@link VOLUNTEERS_COUNT} constant
 * @description Active volunteers shown on the homepage hero
 */
const VOLUNTEERS_COUNT = 5

/**
 * The {@link CAROUSEL_SKELETON_SLOTS} constant
 * @description Placeholder slots rendered while the carousel is loading
 */
const CAROUSEL_SKELETON_SLOTS = [1, 2, 3] as const

/**
 * The {@link homeProjectIcons} constant
 * @description Maps the project namespace keys to their illustrative icons
 */
const homeProjectIcons = [
  { key: 'shelter', icon: 'home' },
  { key: 'rehab', icon: 'reab' },
  { key: 'reintegration', icon: 'edu' },
] as const

/**
 * The {@link PageProps} type
 * @description Props for the homepage server component
 */
type PageProps = {
  params: Promise<{ locale: Locale }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the homepage
 * @param {PageProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the active locale
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  // Build the metadata with the localised title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/',
    locale,
  })
}

/**
 * The {@link Page} component
 * @description Renders the public homepage in the active locale
 * @param {PageProps} props - The route props
 * @param {Promise} props.params - The dynamic route params containing the locale
 * @returns The rendered homepage
 */
export default async function Page({ params }: PageProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware homepage translations
  const t = await getTranslations('home')

  // Render the full homepage layout
  return (
    <div className='flex min-h-screen flex-col'>
      <HeroWrapper>
        <div className='relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-xl md:hidden'>
          <Image
            src={heroImage}
            alt={t('heroImageAlt')}
            fill
            priority
            sizes='100vw'
            className='object-cover'
          />
          <div className='absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary/60 to-transparent' />
        </div>

        <div className='flex flex-col justify-center'>
          <HeroTopText>{t('heroTop')}</HeroTopText>

          <HeroTitle>{t('heroTitle')}</HeroTitle>
          <HeroSubtitle>{t('heroSubtitle')}</HeroSubtitle>

          <HeroDescription>{t('heroDescription')}</HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <CTAButton text={t('ctaSupport')} />
            <Button
              render={<Link href={homeRoute.PROJECTS} />}
              nativeButton={false}
              size='lg'
              variant='outline'
              className='bg-white'
            >
              {t('ctaLearn')}
            </Button>
          </div>

          <div className='mt-10 flex items-center gap-4'>
            <HeroStats value={t('statConstructionValue')} label={t('statConstructionLabel')} />

            <HeroStats value={VOLUNTEERS_COUNT} label={t('statVolunteersLabel')} />
          </div>
        </div>

        <HeroCardSection className='hidden md:flex'>
          <HeroCard
            variant='home'
            title={t('cardTitle')}
            image={cardImage}
            imageClassName='object-contain'
          >
            {t('cardBody')}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <div className='mb-12 text-center'>
          <SectionTitle>{t('carouselTitle')}</SectionTitle>

          <SectionDescription>{t('carouselDescription')}</SectionDescription>
        </div>

        <Suspense
          fallback={
            <div className='flex w-full items-center gap-4'>
              {CAROUSEL_SKELETON_SLOTS.map((slot) => (
                <div key={slot} className='h-96 w-full animate-pulse rounded-md bg-slate-300' />
              ))}
            </div>
          }
        >
          <div className='mx-auto w-full max-w-350'>
            <ImageCarousel />
          </div>
        </Suspense>
      </section>

      <section className='bg-slate-50 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SectionTitle>{t('centreTitle')}</SectionTitle>

            <SectionDescription>{t('centreDescription')}</SectionDescription>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            {homeProjectIcons.map(({ key, icon }) => (
              <HomeProjectCard
                key={key}
                icon={icon}
                title={t(`projects.${key}.title`)}
                href={homeRoute.PROJECTS}
              >
                {t(`projects.${key}.description`)}
              </HomeProjectCard>
            ))}
          </div>
        </div>
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
