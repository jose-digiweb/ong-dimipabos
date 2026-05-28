import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import projReab from '@/assets/projectos/proj_reab.jpeg'
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
import { PartnershipForm } from '@/components/partnership-form'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link PartnersRouteProps} type
 * @description Route props for the partners page
 */
type PartnersRouteProps = {
  params: Promise<{ locale: string }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the partners page
 * @param {PartnersRouteProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the active locale
 */
export async function generateMetadata({ params }: PartnersRouteProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnersPage' })

  // Build the metadata with the localised title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/como-ajudar/parceiros',
  })
}

/**
 * The {@link PartnersPage} component
 * @description Renders the standalone partners page
 * @param {PartnersRouteProps} props - The route props
 * @returns The rendered partners page
 */
export default async function PartnersPage({ params }: PartnersRouteProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware partners page translations
  const t = await getTranslations('partnersPage')

  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t('breadcrumbHome'), path: '/' },
    { name: t('breadcrumbPartners'), path: '/como-ajudar/parceiros' },
  ])

  // Render the full partners page layout
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
            <HeroStats
              value={t('statPartnersValue')}
              label={t('statPartnersLabel')}
            />
          </div>
        </div>

        <HeroCardSection>
          <HeroCard variant='ajudar' title={t('cardTitle')} image={projReab}>
            {t('cardBody')}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <PartnershipForm />
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
