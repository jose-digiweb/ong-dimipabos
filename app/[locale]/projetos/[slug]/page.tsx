import { ArrowLeft, Calendar, Mail, MapPin, Phone, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { CTASection } from '@/components/cta'
import { ImageGallery } from '@/components/image-gallery'
import { JsonLd } from '@/components/seo/JsonLd'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { projects } from '@/lib/data'
import type { ProjectStatus, ProjectType } from '@/lib/data'
import { cfImage } from '@/lib/img'
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/config'

/**
 * The {@link projectsRoute} constant
 * @description Routes related to the projects section
 */
const projectsRoute = {
  LIST: '/projetos',
} as const

/**
 * The {@link projectStatusBadgeClass} constant
 * @description Status-to-badge className map (presentation only). Labels come
 * from translations under `projectDetail.status.<status>`.
 */
const projectStatusBadgeClass = {
  captacao: 'bg-yellow-500 text-white',
  planejamento: 'bg-blue-500 text-white',
  andamento: 'bg-green-500 text-white',
  concluido: 'bg-green-500 text-white',
} as const satisfies Record<ProjectStatus, string>

/**
 * The {@link ProjectPageProps} type
 * @description Props for the {@link ProjectPage} component
 */
type ProjectPageProps = {
  params: Promise<{ locale: Locale; slug: string }>
}

/**
 * The {@link getProject} helper
 * @description Resolves a project by slug from the static project list
 * @param {string} slug - The project slug to look up
 * @returns {Promise<ProjectType | undefined>} The matching project or undefined
 */
const getProject = async (slug: string): Promise<ProjectType | undefined> => {
  // Look up the project by slug in the static list
  return projects.find((project) => project.slug === slug)
}

/**
 * The {@link generateStaticParams} export
 * @description Pre-renders every project detail page at build time, one branch per locale
 * @returns {Promise<{ locale: string; slug: string }[]>} The combined locale/slug params
 */
export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  // Cross-join every supported locale with every project slug
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  )
}

/**
 * The {@link generateMetadata} export
 * @description Builds per-project SEO metadata for the active locale
 * @param {ProjectPageProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the resolved project, or empty when missing
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  // Resolve the route params
  const { locale, slug } = await params

  // Look up the matching project shell
  const project = await getProject(slug)

  // Return empty metadata when the project does not exist so notFound takes over rendering
  if (!project) {
    return {}
  }

  // Read the project-specific translations for the active locale
  const t = await getTranslations({ locale, namespace: `projects.items.${slug}` })

  // Build per-project metadata with canonical URL and project image as the OG card
  return buildMetadata({
    title: t('title'),
    description: t('shortDescription'),
    path: `/projetos/${project.slug}`,
    locale,
    image: cfImage(project.image, { width: 1200, height: 630 }),
    ogType: 'article',
  })
}

/**
 * The {@link ProjectPage} component
 * @description Renders the detail page for a single project in the active locale
 * @param {ProjectPageProps} props - The component props
 * @returns The rendered project detail page
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  // Resolve the route params and opt into static rendering for the active locale
  const { locale, slug } = await params
  setRequestLocale(locale)

  // Fetch the project shell that matches the slug
  const project = await getProject(slug)

  // 404 when no matching project is found
  if (!project) {
    notFound()
  }

  // Read the per-project translations and the shared detail-page copy
  const tItem = await getTranslations(`projects.items.${slug}`)
  const tDetail = await getTranslations('projectDetail')

  // Resolve the translated title, descriptions, team list and status badge label
  const title = tItem('title')
  const description = tItem('description')
  const shortDescription = tItem('shortDescription')
  const longDescription = tItem('longDescription')
  const location = tItem('location')
  const capacity = tItem('capacity')
  const contactRole = tItem('contactRole')
  const team = tItem.raw('team') as readonly string[]
  const statusLabel = tDetail(`status.${project.status}`)
  const statusClassName = projectStatusBadgeClass[project.status]

  // Build the breadcrumb + Article schemas for this project
  const jsonLdData = [
    buildBreadcrumbSchema(
      [
        { name: tDetail('breadcrumbHome'), path: '/' },
        { name: tDetail('breadcrumbProjects'), path: '/projetos' },
        { name: title, path: `/projetos/${project.slug}` },
      ],
      locale,
    ),
    buildArticleSchema({
      title,
      description: shortDescription,
      path: `/projetos/${project.slug}`,
      image: cfImage(project.image, { width: 1200, height: 630 }),
      locale,
    }),
  ]

  // Render the project detail layout
  return (
    <div className='min-h-screen'>
      <JsonLd data={jsonLdData} />
      <section className='relative overflow-hidden bg-linear-to-b from-primary/5 to-primary/10'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20'>
          <Link
            href={projectsRoute.LIST}
            className='inline-flex items-center text-muted-foreground text-sm hover:text-foreground'
          >
            <ArrowLeft className='mr-2 size-4' />
            {tDetail('backToProjects')}
          </Link>

          <div className='mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12'>
            <div className='order-2 lg:order-1'>
              <Badge className={statusClassName}>{statusLabel}</Badge>

              <h1 className='mt-4 text-balance font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl'>
                {title}
              </h1>

              <p className='mt-4 max-w-prose text-pretty text-base text-muted-foreground sm:mt-6 sm:text-lg'>
                {description}
              </p>

              <dl className='mt-6 flex flex-wrap gap-x-5 gap-y-3 text-muted-foreground text-sm sm:mt-8'>
                {location && (
                  <div className='flex items-center gap-2'>
                    <MapPin className='size-4 shrink-0 text-primary' aria-hidden />
                    <dt className='sr-only'>{tDetail('locationLabel')}</dt>
                    <dd>{location}</dd>
                  </div>
                )}
                {project.startDate && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='size-4 shrink-0 text-primary' aria-hidden />
                    <dt className='sr-only'>{tDetail('startLabel')}</dt>
                    <dd>
                      <span className='font-medium text-foreground'>{tDetail('startLabel')}:</span>{' '}
                      {project.startDate}
                    </dd>
                  </div>
                )}
                {capacity && (
                  <div className='flex items-center gap-2'>
                    <Users className='size-4 shrink-0 text-primary' aria-hidden />
                    <dt className='sr-only'>{tDetail('capacityLabel')}</dt>
                    <dd>
                      <span className='font-medium text-foreground'>
                        {tDetail('capacityLabel')}:
                      </span>{' '}
                      {capacity}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {project.image && (
              <div className='relative order-1 aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-lg lg:order-2 lg:aspect-4/3'>
                <Image
                  src={cfImage(project.image, { width: 1200 })}
                  alt={title}
                  fill
                  priority
                  sizes='(min-width: 1024px) 45vw, 100vw'
                  className='object-cover'
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className='py-10 sm:py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <Tabs defaultValue='sobre' className='space-y-6 sm:space-y-8'>
            <TabsList className='grid w-full grid-cols-2 sm:w-100'>
              <TabsTrigger value='sobre'>{tDetail('tabAbout')}</TabsTrigger>
              <TabsTrigger value='galeria'>{tDetail('tabGallery')}</TabsTrigger>
            </TabsList>

            <TabsContent value='sobre'>
              <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8'>
                <Card>
                  <CardContent className='p-5 sm:p-7'>
                    <h2 className='font-bold text-xl sm:text-2xl'>{tDetail('detailsTitle')}</h2>
                    <div className='mt-4 whitespace-pre-line text-pretty text-[15px] text-muted-foreground leading-relaxed sm:text-base'>
                      {longDescription}
                    </div>
                  </CardContent>
                </Card>

                <aside className='space-y-6 lg:sticky lg:top-6 lg:self-start'>
                  {team && team.length > 0 && (
                    <Card>
                      <CardContent className='p-5 sm:p-6'>
                        <h3 className='font-bold text-lg'>{tDetail('teamTitle')}</h3>
                        <ul className='mt-4 list-disc space-y-2 pl-5 text-muted-foreground text-sm marker:text-primary/60'>
                          {team.map((member) => (
                            <li key={member}>{member}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {project.contact && (
                    <Card>
                      <CardContent className='p-5 sm:p-6'>
                        <h3 className='font-bold text-lg'>{tDetail('contactTitle')}</h3>
                        <div className='mt-4 space-y-3 text-sm'>
                          <div>
                            <p className='font-medium text-foreground'>{project.contact.name}</p>
                            <p className='text-muted-foreground'>{contactRole}</p>
                          </div>
                          {project.contact.email && (
                            <a
                              href={`mailto:${project.contact.email}`}
                              className='flex items-start gap-2 break-all text-primary hover:underline'
                            >
                              <Mail className='mt-0.5 size-4 shrink-0' aria-hidden />
                              <span>{project.contact.email}</span>
                            </a>
                          )}
                          {project.contact.phone && (
                            <a
                              href={`tel:${project.contact.phone.replace(/\s/g, '')}`}
                              className='flex items-center gap-2 text-primary hover:underline'
                            >
                              <Phone className='size-4 shrink-0' aria-hidden />
                              <span>{project.contact.phone}</span>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </aside>
              </div>
            </TabsContent>

            <TabsContent value='galeria'>
              {project.images && project.images.length > 0 ? (
                <ImageGallery images={project.images} />
              ) : (
                <p className='text-center text-muted-foreground'>{tDetail('emptyGallery')}</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
