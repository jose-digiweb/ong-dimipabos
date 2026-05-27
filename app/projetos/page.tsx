import Link from 'next/link'

import projReab from '@/assets/projectos/proj_reab.jpeg'
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
import { ImpactNumbers } from '@/components/impact-numbers'
import { ProjectCard } from '@/components/projects'
import { Button } from '@/components/ui/button'
import { SectionDescription, SectionTitle } from '@/components/ui/section'
import { projects } from '@/lib/data'

/**
 * The {@link projectsPageCopy} constant
 * @description Static Portuguese copy used by the projects index page
 */
const projectsPageCopy = {
  HERO_TOP: 'Nossos Projetos',
  HERO_TITLE: 'Recuperação e Vida Nova',
  HERO_SUBTITLE: 'Conheça nossos programas de reabilitação',
  HERO_DESCRIPTION:
    'Através de nossos projetos, oferecemos um caminho completo para a recuperação, desde o acolhimento inicial até o acompanhamento pós-tratamento, garantindo uma reintegração segura e duradoura.',
  CTA_SUPPORT: 'Apoie Nossos Projetos',
  CTA_VOLUNTEER: 'Seja Voluntário',
  CARD_TITLE: 'Nossos Programas',
  CARD_BODY: 'Tratamento especializado e humanizado para dependência química.',
  FEATURED_TITLE: 'Projetos em Destaque',
  FEATURED_DESCRIPTION:
    'Conheça nossos principais projetos e o impacto que estamos gerando na comunidade.',
} as const

/**
 * The {@link projectsPageRoute} constant
 * @description Internal links surfaced from the projects index page
 */
const projectsPageRoute = {
  VOLUNTEER: '/como-ajudar#voluntario',
} as const

/**
 * The {@link ProjectsPage} component
 * @description Renders the public projects index page
 * @returns The rendered projects index page
 */
export default function ProjectsPage() {
  // Render the full projects index layout
  return (
    <div className='flex min-h-screen flex-col'>
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{projectsPageCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{projectsPageCopy.HERO_TITLE}</HeroTitle>
          <HeroSubtitle>{projectsPageCopy.HERO_SUBTITLE}</HeroSubtitle>

          <HeroDescription>{projectsPageCopy.HERO_DESCRIPTION}</HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <CTAButton text={projectsPageCopy.CTA_SUPPORT} size='lg' />

            <Button
              render={<Link href={projectsPageRoute.VOLUNTEER} />}
              nativeButton={false}
              size='lg'
              variant='outline'
              className='bg-white'
            >
              {projectsPageCopy.CTA_VOLUNTEER}
            </Button>
          </div>
        </div>

        <HeroCardSection>
          <HeroCard variant='projetos' title={projectsPageCopy.CARD_TITLE} image={projReab}>
            {projectsPageCopy.CARD_BODY}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SectionTitle>{projectsPageCopy.FEATURED_TITLE}</SectionTitle>
            <SectionDescription>{projectsPageCopy.FEATURED_DESCRIPTION}</SectionDescription>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <ImpactNumbers />

      <CTASection className='border-b' />
    </div>
  )
}
