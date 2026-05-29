import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import projReab from '@/assets/projectos/proj_reab.webp'
import { CTAButton, CTASection } from '@/components/cta'
import {
  HeroCard,
  HeroCardSection,
  HeroDescription,
  HeroSubtitle,
  HeroTitle,
  HeroTopText,
  HeroWrapper,
} from '@/components/heroSection'
import { ProjectCard } from '@/components/projects'
import { SectionDescription, SectionTitle } from '@/components/section'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { projects } from '@/lib/data'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/config'

/**
 * The {@link ProjectsHubRouteProps} type
 * @description Route props for the projects index page
 */
type ProjectsHubRouteProps = {
  params: Promise<{ locale: Locale }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the projects index page
 * @param {ProjectsHubRouteProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the active locale
 */
export async function generateMetadata({ params }: ProjectsHubRouteProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy from the projectsHub namespace
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projectsHub' })

  // Build the metadata with the localised title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/projetos',
    locale,
  })
}

/**
 * The {@link projectsPageRoute} constant
 * @description Internal links surfaced from the projects index page
 */
const projectsPageRoute = {
  VOLUNTEER: '/como-ajudar/voluntario',
} as const

/**
 * The {@link ProjectsPage} component
 * @description Renders the public projects index page in the active locale
 * @param {ProjectsHubRouteProps} props - The route props
 * @returns The rendered projects index page
 */
export default async function ProjectsPage({ params }: ProjectsHubRouteProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware projectsHub translations
  const t = await getTranslations('projectsHub')

  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t('breadcrumbHome'), path: '/' },
    { name: t('breadcrumbProjects'), path: '/projetos' },
  ])

  // Render the full projects index layout
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
              render={<Link href={projectsPageRoute.VOLUNTEER} />}
              nativeButton={false}
              size='lg'
              variant='outline'
              className='bg-white'
            >
              {t('ctaVolunteer')}
            </Button>
          </div>
        </div>

        <HeroCardSection>
          <HeroCard variant='projetos' title={t('cardTitle')} image={projReab}>
            {t('cardBody')}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SectionTitle>{t('featuredTitle')}</SectionTitle>
            <SectionDescription>{t('featuredDescription')}</SectionDescription>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
