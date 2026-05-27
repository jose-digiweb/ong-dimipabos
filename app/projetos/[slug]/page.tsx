import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTASection } from '@/components/cta'
import { ImageGallery } from '@/components/image-gallery'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { projects } from '@/lib/data'
import type { ProjectStatus, ProjectType } from '@/lib/data'

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
  START_LABEL: 'Início:',
  CAPACITY_LABEL: 'Capacidade:',
  TAB_ABOUT: 'Sobre o Projeto',
  TAB_GALLERY: 'Galeria',
  DETAILS_TITLE: 'Detalhes do Projeto',
  TEAM_TITLE: 'Equipe do Projeto',
  CONTACT_TITLE: 'Contato',
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
  captacao: { label: projectPageCopy.BADGE_CAPTACAO, className: 'mb-6 bg-yellow-500 text-white' },
  planejamento: {
    label: projectPageCopy.BADGE_PLANEJAMENTO,
    className: 'mb-6 bg-blue-500 text-white',
  },
  andamento: { label: projectPageCopy.BADGE_ANDAMENTO, className: 'mb-6 bg-green-500 text-white' },
  concluido: { label: projectPageCopy.BADGE_CONCLUIDO, className: 'mb-6 bg-green-500 text-white' },
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

  // Render the project detail layout
  return (
    <div className='min-h-screen'>
      <section className='relative overflow-hidden bg-linear-to-b from-primary/5 to-primary/10 py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center text-center'>
            <Link
              href={projectsRoute.LIST}
              className='mb-4 inline-flex items-center text-muted-foreground text-sm hover:text-foreground'
            >
              <ArrowLeft className='mr-2 size-4' />
              {projectPageCopy.BACK_TO_PROJECTS}
            </Link>

            <Badge className={statusBadge.className}>{statusBadge.label}</Badge>

            <h1 className='font-bold text-4xl text-foreground tracking-tight sm:text-5xl md:text-6xl'>
              {project.title}
            </h1>
            <p className='mt-6 max-w-2xl text-lg text-muted-foreground'>{project.description}</p>
            <div className='mt-8 flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm'>
              {project.location && (
                <div className='flex items-center gap-2'>
                  <MapPin className='size-4' />
                  {project.location}
                </div>
              )}
              {project.startDate && (
                <div className='flex items-center gap-2'>
                  <Calendar className='size-4' />
                  {projectPageCopy.START_LABEL} {project.startDate}
                </div>
              )}
              {project.capacity && (
                <div className='flex items-center gap-2'>
                  <Users className='size-4' />
                  {projectPageCopy.CAPACITY_LABEL} {project.capacity}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <Tabs defaultValue='sobre' className='space-y-8'>
            <TabsList className='grid w-full grid-cols-2 lg:w-[400px]'>
              <TabsTrigger value='sobre'>{projectPageCopy.TAB_ABOUT}</TabsTrigger>
              <TabsTrigger value='galeria'>{projectPageCopy.TAB_GALLERY}</TabsTrigger>
            </TabsList>

            <TabsContent value='sobre' className='space-y-8'>
              <div className='grid gap-8 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                  <Card>
                    <CardContent className='p-6'>
                      <h2 className='font-bold text-2xl'>{projectPageCopy.DETAILS_TITLE}</h2>
                      <div className='mt-4 whitespace-pre-line text-muted-foreground'>
                        {project.longDescription}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className='space-y-8'>
                  {project.team && project.team.length > 0 && (
                    <Card>
                      <CardContent className='p-6'>
                        <h3 className='font-bold text-lg'>{projectPageCopy.TEAM_TITLE}</h3>
                        <ul className='mt-4 space-y-2'>
                          {project.team.map((member) => (
                            <li key={member} className='text-muted-foreground'>
                              • {member}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {project.contact && (
                    <Card>
                      <CardContent className='p-6'>
                        <h3 className='font-bold text-lg'>{projectPageCopy.CONTACT_TITLE}</h3>
                        <div className='mt-4 space-y-2 text-sm'>
                          <p className='font-medium'>{project.contact.name}</p>
                          <p className='text-muted-foreground'>{project.contact.role}</p>
                          <p className='text-muted-foreground'>{project.contact.email}</p>
                          <p className='text-muted-foreground'>{project.contact.phone}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
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
