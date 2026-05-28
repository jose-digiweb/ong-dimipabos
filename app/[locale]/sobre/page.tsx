import { Eye, HandshakeIcon, Heart, type LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'

import logo from '@/assets/dimipabos_logo_2.png'
import { CTAButton } from '@/components/cta'
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
import { SectionTitle } from '@/components/section'
import { JsonLd } from '@/components/seo/JsonLd'
import { TeamSection } from '@/components/team-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link SobreRouteProps} type
 * @description Props for the sobre route segment (metadata + page)
 */
type SobreRouteProps = {
  params: Promise<{ locale: string }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the sobre page
 * @param {SobreRouteProps} props - The route props
 * @returns {Promise<Metadata>} The metadata resolved against the active locale
 */
export async function generateMetadata({ params }: SobreRouteProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy from the about namespace
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  // Build the metadata with the localized title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/sobre',
  })
}

/**
 * The {@link aboutRoute} constant
 * @description Internal links surfaced from the sobre page
 */
const aboutRoute = {
  PROJECTS: '/projetos',
} as const

/**
 * The {@link FOUNDED_YEAR} constant
 * @description Year the NGO was founded
 */
const FOUNDED_YEAR = 2021

/**
 * The {@link MissionEntry} type
 * @description Shape of an entry in the mission/vision/values grid
 */
type MissionEntry = {
  key: 'mission' | 'vision' | 'values'
  icon: LucideIcon
  isList: boolean
}

/**
 * The {@link missionEntries} constant
 * @description The mission/vision/values cards (locale-independent shape)
 */
const missionEntries = [
  { key: 'mission', icon: Heart, isList: false },
  { key: 'vision', icon: Eye, isList: false },
  { key: 'values', icon: HandshakeIcon, isList: true },
] as const satisfies readonly MissionEntry[]

/**
 * The {@link commitmentKeys} constant
 * @description Keys for the three commitment cards rendered at the bottom of the sobre page
 */
const commitmentKeys = ['transparency', 'quality', 'impact'] as const

/**
 * The {@link historyParagraphIndices} constant
 * @description Static indices used to read the locale-specific history paragraphs
 */
const historyParagraphIndices = [0, 1, 2, 3] as const

/**
 * The {@link SobrePage} component
 * @description Renders the public "sobre" page in the active locale
 * @param {SobreRouteProps} props - The route props
 * @returns The rendered sobre page
 */
export default async function SobrePage({ params }: SobreRouteProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware about translations
  const t = await getTranslations('about')

  // Read history paragraphs as a typed string array
  const historyParagraphs = t.raw('historyParagraphs') as readonly string[]

  // Read the values list as a typed string array
  const valuesItems = t.raw('values.items') as readonly string[]

  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t('breadcrumbHome'), path: '/' },
    { name: t('breadcrumbAbout'), path: '/sobre' },
  ])

  // Render the full sobre page layout
  return (
    <div className='flex min-h-screen flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{t('heroTop')}</HeroTopText>

          <HeroTitle>{t('heroTitle')}</HeroTitle>
          <HeroSubtitle>{t('heroSubtitle')}</HeroSubtitle>

          <HeroDescription>{t('heroDescription')}</HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <CTAButton text={t('ctaSupport')} size='lg' />

            <Button
              render={<Link href={aboutRoute.PROJECTS} />}
              nativeButton={false}
              size='lg'
              variant='outline'
              className='bg-white'
            >
              {t('ctaProjects')}
            </Button>
          </div>

          <div className='mt-10 flex items-center gap-4'>
            <HeroStats value={FOUNDED_YEAR} label={t('statFoundedLabel')} />

            <HeroStats value={t('statConstructionValue')} label={t('statConstructionLabel')} />

            <HeroStats value={t('statVolunteersValue')} label={t('statVolunteersLabel')} />
          </div>
        </div>

        <HeroCardSection>
          <HeroCard
            variant='sobre'
            title={t('cardTitle')}
            image={logo}
            imageClassName='object-contain'
          >
            {t('cardBody')}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section id='historia' className='bg-slate-50 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-12 md:grid-cols-[1fr_35%] lg:gap-8'>
            <div className='flex flex-col justify-center'>
              <SectionTitle>{t('historyTitle')}</SectionTitle>

              <div className='mt-6 space-y-6 text-lg text-muted-foreground'>
                {historyParagraphIndices.map((index) => (
                  <p key={index} className='text-pretty'>
                    {historyParagraphs[index]}
                  </p>
                ))}
              </div>
            </div>
            <div className='relative mx-auto w-96 md:mx-0 md:my-auto md:w-auto'>
              <div className='aspect-square overflow-hidden rounded-full drop-shadow-md'>
                <Image
                  fill
                  src={logo}
                  alt={t('historyImageAlt')}
                  className='h-full w-full rounded-full object-contain drop-shadow-xs'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SectionTitle>{t('mvvTitle')}</SectionTitle>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            {missionEntries.map((item) => {
              // Resolve the item icon component and translated title
              const Icon = item.icon
              const title = t(`${item.key}.title`)

              // Render the mission/vision/values card
              return (
                <Card key={item.key}>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Icon className='size-6 text-secondary' />
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.isList ? (
                      <ul className='space-y-2 text-muted-foreground'>
                        {valuesItems.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-pretty text-muted-foreground'>{t(`${item.key}.body`)}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <TeamSection />

      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SectionTitle>{t('commitmentsTitle')}</SectionTitle>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            {commitmentKeys.map((key) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle>{t(`commitments.${key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-pretty text-muted-foreground'>
                    {t(`commitments.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='mt-16 text-center'>
            <p className='mx-auto max-w-2xl text-pretty text-lg text-muted-foreground'>
              {t('commitmentsFooter')}
            </p>
            <div className='mt-8'>
              <CTAButton text={t('ctaCommitments')} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
