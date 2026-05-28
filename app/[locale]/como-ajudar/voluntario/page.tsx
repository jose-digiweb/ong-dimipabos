import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import projEducacao from '@/assets/projectos/proj_educacao.jpeg'
import { CTASection } from '@/components/cta'
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
import { JsonLd } from '@/components/seo/JsonLd'
import { TestimonialSection } from '@/components/testimonial-section'
import { VolunteerForm } from '@/components/volunteer-form'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/config'

/**
 * The {@link VolunteerRouteProps} type
 * @description Route props for the volunteer page
 */
type VolunteerRouteProps = {
  params: Promise<{ locale: Locale }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the volunteer page
 * @param {VolunteerRouteProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the active locale
 */
export async function generateMetadata({ params }: VolunteerRouteProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'volunteerPage' })

  // Build the metadata with the localised title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/como-ajudar/voluntario',
    locale,
  })
}

/**
 * The {@link VolunteerPage} component
 * @description Renders the standalone volunteer page
 * @param {VolunteerRouteProps} props - The route props
 * @returns The rendered volunteer page
 */
export default async function VolunteerPage({ params }: VolunteerRouteProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware volunteer page translations
  const t = await getTranslations('volunteerPage')

  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t('breadcrumbHome'), path: '/' },
    { name: t('breadcrumbVolunteer'), path: '/como-ajudar/voluntario' },
  ])

  // Render the full volunteer page layout
  return (
    <div className='flex min-h-dvh flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{t('heroTop')}</HeroTopText>

          <HeroTitle>{t('heroTitle')}</HeroTitle>
          <HeroSubtitle>{t('heroSubtitle')}</HeroSubtitle>

          <HeroDescription>{t('heroDescription')}</HeroDescription>

          <div className='mt-10 flex items-center gap-4'>
            <HeroStats value={t('statVolunteersValue')} label={t('statVolunteersLabel')} />
          </div>
        </div>

        <HeroCardSection>
          <HeroCard variant='ajudar' title={t('cardTitle')} image={projEducacao}>
            {t('cardBody')}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='bg-slate-50 py-16'>
        <VolunteerForm />
      </section>

      <TestimonialSection />

      <CTASection className='border-b' />
    </div>
  )
}
