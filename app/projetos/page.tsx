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
import Link from 'next/link'

import projReab from '@/assets/projectos/proj_reab.jpeg'

import { projects } from '@/lib/data'

export default function ProjectsPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      {/* Hero Section */}
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>Nossos Projetos</HeroTopText>

          <HeroTitle>Recuperação e Vida Nova</HeroTitle>
          <HeroSubtitle>Conheça nossos programas de reabilitação</HeroSubtitle>

          <HeroDescription>
            Através de nossos projetos, oferecemos um caminho completo para a recuperação, desde o
            acolhimento inicial até o acompanhamento pós-tratamento, garantindo uma reintegração
            segura e duradoura.
          </HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <CTAButton text='Apoie Nossos Projetos' size='lg' />

            <Button
              render={<Link href='/como-ajudar#voluntario' />}
              nativeButton={false}
              size='lg'
              variant='outline'
              className='bg-white'
            >
              Seja Voluntário
            </Button>
          </div>

          {/* <div className='mt-10 flex items-center gap-4'>
            <HeroStats value='10+' label='Profissionais' />

            <HeroStats value='85%' label='Taxa de reabilitação' />
          </div> */}
        </div>

        <HeroCardSection>
          <HeroCard
            variant='projetos'
            title='Nossos Programas
'
            image={projReab}
          >
            Tratamento especializado e humanizado para dependência química.
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      {/* Featured Projects */}
      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SectionTitle>Projetos em Destaque</SectionTitle>
            <SectionDescription>
              Conheça nossos principais projetos e o impacto que estamos gerando na comunidade.
            </SectionDescription>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <ImpactNumbers />

      {/* Project Gallery */}
      {/* <ProjectGrid /> */}

      {/* CTA Section */}
      <CTASection className='border-b' />
    </div>
  )
}
