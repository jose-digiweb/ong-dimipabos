import { ArrowLeft, Calendar, Mail, MapPin, Phone, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTASection } from '@/components/cta'
import { ImageGallery } from '@/components/image-gallery'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { projects } from '@/lib/data'
import type { ProjectStatus, ProjectType } from '@/lib/data'
import { JsonLd } from '@/components/seo/JsonLd'
import { cloudinaryImage } from '@/lib/img'
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link projectPageCopy} constant
 * @description Static Portuguese copy used by the project detail page
 */
const projectPageCopy = {
  BACK_TO_PROJECTS: 'Voltar para Projetos',
  BADGE_CAPTACAO: 'Em Captação de Recursos',
  BADGE_PLANEJAMENTO: 'Em Planejamento',
  BADGE_ANDAMENTO: 'Em Andamento',
  BADGE_CONCLUIDO: 'Concluído',
  LOCATION_LABEL: 'Localização',
  START_LABEL: 'Início',
  CAPACITY_LABEL: 'Capacidade',
  TAB_ABOUT: 'Sobre o Projeto',
  TAB_GALLERY: 'Galeria',
  DETAILS_TITLE: 'Detalhes do Projeto',
  TEAM_TITLE: 'Equipe do Projeto',
  CONTACT_TITLE: 'Contato',
  EMAIL_LABEL: 'E-mail',
  PHONE_LABEL: 'Telefone',
  EMPTY_GALLERY: 'Nenhuma imagem disponível no momento.',
} as const

/**
 * The {@link projectsRoute} constant
 * @description Routes related to the projects section
 */
const projectsRoute = {
  LIST: '/projetos',
} as const

/**
 * The {@link projectStatusBadge} constant
 * @description Status-to-badge presentation map
 */
const projectStatusBadge = {
  captacao: { label: projectPageCopy.BADGE_CAPTACAO, className: 'bg-yellow-500 text-white' },
  planejamento: {
    label: projectPageCopy.BADGE_PLANEJAMENTO,
    className: 'bg-blue-500 text-white',
  },
  andamento: { label: projectPageCopy.BADGE_ANDAMENTO, className: 'bg-green-500 text-white' },
  concluido: { label: projectPageCopy.BADGE_CONCLUIDO, className: 'bg-green-500 text-white' },
} as const satisfies Record<ProjectStatus, { label: string; className: string }>

/**
 * The {@link ProjectPageProps} type
 * @description Props for the {@link ProjectPage} component
 */
type ProjectPageProps = {
  params: Promise<{ slug: string }>
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
 * @description Pre-renders every project detail page at build time
 * @returns {Promise<{ slug: string }[]>} The list of slug params for static generation
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // Map every project to its slug param
  return projects.map((project) => ({ slug: project.slug }))
}

/**
 * The {@link generateMetadata} export
 * @description Builds per-project SEO metadata including canonical URL and Open Graph image
 * @param {ProjectPageProps} props - The route props
 * @param {Promise<{ slug: string }>} props.params - The dynamic route params
 * @returns {Promise<Metadata>} The metadata for the resolved project, or empty when missing
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  // Resolve the slug from the dynamic params
  const slug = (await params).slug

  // Look up the matching project
  const project = await getProject(slug)

  // Return empty metadata when the project does not exist so notFound takes over rendering
  if (!project) {
    return {}
  }

  // Build per-project metadata with canonical URL and project image as the OG card
  return buildMetadata({
    title: project.title,
    description: project.shortDescription,
    path: `/projetos/${project.slug}`,
    image: cloudinaryImage(project.image, { width: 1200, height: 630, crop: 'fill' }),
    ogType: 'article',
  })
}

/**
 * The {@link ProjectPage} component
 * @description Renders the detail page for a single project
 * @param {ProjectPageProps} props - The component props
 * @param {Promise<{ slug: string }>} props.params - The dynamic route params
 * @returns The rendered project detail page
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  // Resolve the slug from the dynamic route params
  const slug = (await params).slug

  // Fetch the project that matches the slug
  const project = await getProject(slug)

  // 404 when no matching project is found
  if (!project) {
    notFound()
  }

  // Resolve the badge presentation for the project status
  const statusBadge = projectStatusBadge[project.status]

  // Build the breadcrumb + Article schemas for this project
  const jsonLdData = [
    buildBreadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Projetos', path: '/projetos' },
      { name: project.title, path: `/projetos/${project.slug}` },
    ]),
    buildArticleSchema({
      title: project.title,
      description: project.shortDescription,
      path: `/projetos/${project.slug}`,
      image: cloudinaryImage(project.image, { width: 1200, height: 630, crop: 'fill' }),
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
            {projectPageCopy.BACK_TO_PROJECTS}
          </Link>

          <div className='mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12'>
            <div className='order-2 lg:order-1'>
              <Badge className={statusBadge.className}>{statusBadge.label}</Badge>

              <h1 className='mt-4 text-balance font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl'>
                {project.title}
              </h1>

              <p className='mt-4 max-w-prose text-pretty text-base text-muted-foreground sm:mt-6 sm:text-lg'>
                {project.description}
              </p>

              <dl className='mt-6 flex flex-wrap gap-x-5 gap-y-3 text-muted-foreground text-sm sm:mt-8'>
                {project.location && (
                  <div className='flex items-center gap-2'>
                    <MapPin className='size-4 shrink-0 text-primary' aria-hidden />
                    <dt className='sr-only'>{projectPageCopy.LOCATION_LABEL}</dt>
                    <dd>{project.location}</dd>
                  </div>
                )}
                {project.startDate && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='size-4 shrink-0 text-primary' aria-hidden />
                    <dt className='sr-only'>{projectPageCopy.START_LABEL}</dt>
                    <dd>
                      <span className='font-medium text-foreground'>
                        {projectPageCopy.START_LABEL}:
                      </span>{' '}
                      {project.startDate}
                    </dd>
                  </div>
                )}
                {project.capacity && (
                  <div className='flex items-center gap-2'>
                    <Users className='size-4 shrink-0 text-primary' aria-hidden />
                    <dt className='sr-only'>{projectPageCopy.CAPACITY_LABEL}</dt>
                    <dd>
                      <span className='font-medium text-foreground'>
                        {projectPageCopy.CAPACITY_LABEL}:
                      </span>{' '}
                      {project.capacity}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {project.image && (
              <div className='relative order-1 aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-lg lg:order-2 lg:aspect-4/3'>
                <Image
                  src={cloudinaryImage(project.image, { width: 1200, crop: 'fill' })}
                  alt={project.title}
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
            <TabsList className='grid w-full grid-cols-2 sm:w-[400px]'>
              <TabsTrigger value='sobre'>{projectPageCopy.TAB_ABOUT}</TabsTrigger>
              <TabsTrigger value='galeria'>{projectPageCopy.TAB_GALLERY}</TabsTrigger>
            </TabsList>

            <TabsContent value='sobre'>
              <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8'>
                <Card>
                  <CardContent className='p-5 sm:p-7'>
                    <h2 className='font-bold text-xl sm:text-2xl'>
                      {projectPageCopy.DETAILS_TITLE}
                    </h2>
                    <div className='mt-4 whitespace-pre-line text-pretty text-[15px] text-muted-foreground leading-relaxed sm:text-base'>
                      {project.longDescription}
                    </div>
                  </CardContent>
                </Card>

                <aside className='space-y-6 lg:sticky lg:top-6 lg:self-start'>
                  {project.team && project.team.length > 0 && (
                    <Card>
                      <CardContent className='p-5 sm:p-6'>
                        <h3 className='font-bold text-lg'>{projectPageCopy.TEAM_TITLE}</h3>
                        <ul className='mt-4 list-disc space-y-2 pl-5 text-muted-foreground text-sm marker:text-primary/60'>
                          {project.team.map((member) => (
                            <li key={member}>{member}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {project.contact && (
                    <Card>
                      <CardContent className='p-5 sm:p-6'>
                        <h3 className='font-bold text-lg'>{projectPageCopy.CONTACT_TITLE}</h3>
                        <div className='mt-4 space-y-3 text-sm'>
                          <div>
                            <p className='font-medium text-foreground'>{project.contact.name}</p>
                            <p className='text-muted-foreground'>{project.contact.role}</p>
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
                <p className='text-center text-muted-foreground'>{projectPageCopy.EMPTY_GALLERY}</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
