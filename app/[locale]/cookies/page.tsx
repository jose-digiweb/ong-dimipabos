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
 * @description Shape of a section rendered on the cookies page
 */
type LegalSection = {
  id: string
  title: string
  paragraphs: readonly string[]
  list?: readonly string[]
}

/**
 * The {@link CookiesRouteProps} type
 * @description Route props for the cookies page
 */
type CookiesRouteProps = {
  params: Promise<{ locale: Locale }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the cookies page
 * @param {CookiesRouteProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the active locale
 */
export async function generateMetadata({ params }: CookiesRouteProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cookies' })

  // Build the metadata with the localised title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/cookies',
    locale,
  })
}

/**
 * The {@link CookiesPage} component
 * @description Renders the public cookie policy page
 * @param {CookiesRouteProps} props - The route props
 * @returns The rendered cookies page
 */
export default async function CookiesPage({ params }: CookiesRouteProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware cookies translations
  const t = await getTranslations('cookies')

  // Read the localised sections array
  const sections = t.raw('sections') as readonly LegalSection[]

  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t('breadcrumbHome'), path: '/' },
      { name: t('breadcrumbCookies'), path: '/cookies' },
    ],
    locale,
  )

  // Render the full cookies page layout
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
