import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import projHabitacao from '@/assets/projectos/proj_habitacao.jpeg'
import { BankTransferSection } from '@/components/bank-transfer-section'
import { CTASection } from '@/components/cta'
import {
  HeroCard,
  HeroCardSection,
  HeroDescription,
  HeroSubtitle,
  HeroTitle,
  HeroTopText,
  HeroWrapper,
} from '@/components/heroSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/config'

/**
 * The {@link DonateRouteProps} type
 * @description Route props for the donate page
 */
type DonateRouteProps = {
  params: Promise<{ locale: Locale }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the donate page
 * @param {DonateRouteProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the active locale
 */
export async function generateMetadata({ params }: DonateRouteProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'donatePage' })

  // Build the metadata with the localised title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/como-ajudar/doar',
    locale,
  })
}

/**
 * The {@link DonatePage} component
 * @description Renders the standalone donation page
 * @param {DonateRouteProps} props - The route props
 * @returns The rendered donate page
 */
export default async function DonatePage({ params }: DonateRouteProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware donate page translations
  const t = await getTranslations('donatePage')

  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t('breadcrumbHome'), path: '/' },
    { name: t('breadcrumbDonate'), path: '/como-ajudar/doar' },
  ])

  // Render the full donate page layout
  return (
    <div className='flex min-h-dvh flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{t('heroTop')}</HeroTopText>

          <HeroTitle>{t('heroTitle')}</HeroTitle>
          <HeroSubtitle>{t('heroSubtitle')}</HeroSubtitle>

          <HeroDescription>{t('heroDescription')}</HeroDescription>
        </div>

        <HeroCardSection>
          <HeroCard variant='ajudar' title={t('cardTitle')} image={projHabitacao}>
            {t('cardBody')}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <BankTransferSection />
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
