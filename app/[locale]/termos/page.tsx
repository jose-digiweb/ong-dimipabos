import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { HeroDescription, HeroTitle, HeroTopText, HeroWrapper } from '@/components/heroSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/config'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link LegalSection} type
 * @description Shape of a section rendered on the terms page
 */
type LegalSection = {
  id: string
  title: string
  paragraphs: readonly string[]
  list?: readonly string[]
}

/**
 * The {@link TermsRouteProps} type
 * @description Route props for the terms page
 */
type TermsRouteProps = {
  params: Promise<{ locale: Locale }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the terms page
 * @param {TermsRouteProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the active locale
 */
export async function generateMetadata({ params }: TermsRouteProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms' })

  // Build the metadata with the localised title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/termos',
    locale,
  })
}

/**
 * The {@link TermsPage} component
 * @description Renders the public terms and conditions page
 * @param {TermsRouteProps} props - The route props
 * @returns The rendered terms page
 */
export default async function TermsPage({ params }: TermsRouteProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware terms translations
  const t = await getTranslations('terms')

  // Read the localised sections array
  const sections = t.raw('sections') as readonly LegalSection[]

  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t('breadcrumbHome'), path: '/' },
      { name: t('breadcrumbTerms'), path: '/termos' },
    ],
    locale,
  )

  // Render the full terms page layout
  return (
    <div className='flex min-h-screen flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper className='min-h-0'>
        <div className='flex flex-col justify-center md:col-span-2'>
          <HeroTopText>{t('heroTop')}</HeroTopText>

          <HeroTitle>{t('heroTitle')}</HeroTitle>

          <HeroDescription>{t('heroDescription')}</HeroDescription>

          <p className='mt-6 text-muted-foreground text-sm'>
            <span className='font-semibold'>{t('lastUpdatedLabel')}</span> {t('lastUpdatedValue')}
          </p>
        </div>
      </HeroWrapper>

      <article className='mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8'>
        {sections.map((section) => (
          <section key={section.id} id={section.id} className='mb-10'>
            <h2 className='mb-4 font-semibold text-2xl text-foreground'>{section.title}</h2>

            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className='mb-4 text-foreground/80 leading-relaxed'>
                {paragraph}
              </p>
            ))}

            {section.list && (
              <ul className='ml-6 list-disc space-y-2 text-foreground/80'>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className='mt-12 border-border border-t pt-6 text-muted-foreground text-sm'>
          {t('relatedText')}{' '}
          <Link
            href='/politica-de-privacidade'
            className='text-primary underline underline-offset-4'
          >
            {t('relatedLinkLabel')}
          </Link>
          .
        </p>
      </article>
    </div>
  )
}
