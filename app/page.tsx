import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import cardImage from '@/assets/dimipabos_logo_2.png'
import heroImage from '@/assets/heroSection/hero_image.jpg'
import { CTAButton, CTASection } from '@/components/cta'
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
import { HomeProjectCard } from '@/components/HomeProjectCard'
import { ImageCarousel } from '@/components/image-carousel'
import { Button } from '@/components/ui/button'
import { SectionDescription, SectionTitle } from '@/components/section'

/**
 * The dynamic export
 * @description Forces dynamic rendering — the homepage reads R2 images at request time
 */
export const dynamic = 'force-dynamic'

/**
 * The {@link homeRoute} constant
 * @description Internal links surfaced from the homepage
 */
const homeRoute = {
  PROJECTS: '/projetos',
} as const

/**
 * The {@link homeCopy} constant
 * @description Static Portuguese copy used by the homepage
 */
const homeCopy = {
  HERO_TOP: 'Construindo Esperança',
  HERO_TITLE: 'DI MI PA BÔS',
  HERO_SUBTITLE: 'Um lugar de acolhimento e recuperação',
  HERO_DESCRIPTION:
    'Estamos construindo o primeiro centro especializado em tratamento e reabilitação para pessoas em situação de dependência química na Guiné-Bissau. Um espaço de acolhimento, cuidado e renovação.',
  CTA_SUPPORT: 'Apoie a Construção',
  CTA_LEARN: 'Conheça o Projeto',
  STAT_CONSTRUCTION_VALUE: '10%',
  STAT_CONSTRUCTION_LABEL: 'da Construção Concluída',
  STAT_VOLUNTEERS_LABEL: 'Voluntários Ativos',
  CARD_TITLE: 'Nossa Essência',
  CARD_BODY:
    'Trabalhamos incansavelmente para construir um espaço de acolhimento e recuperação, onde cada pessoa possa encontrar apoio para recomeçar.',
  HERO_IMAGE_ALT: 'Crianças e jovens acolhidos pela DI MI PA BÔS na Guiné-Bissau.',
  CAROUSEL_TITLE: 'Nossa caminhada',
  CAROUSEL_DESCRIPTION: 'Algumas fotos do que representam nossa luta e esperança.',
  CENTRE_TITLE: 'O Centro de Reabilitação',
  CENTRE_DESCRIPTION:
    'Conheça o projeto que vai transformar o tratamento da dependência química na Guiné-Bissau.',
} as const

/**
 * The {@link VOLUNTEERS_COUNT} constant
 * @description Active volunteers shown on the homepage hero
 */
const VOLUNTEERS_COUNT = 5

/**
 * The {@link CAROUSEL_SKELETON_SLOTS} constant
 * @description Placeholder slots rendered while the carousel is loading
 */
const CAROUSEL_SKELETON_SLOTS = [1, 2, 3] as const

/**
 * The {@link homeProjects} constant
 * @description The three feature cards shown in the "Centre" section
 */
const homeProjects = [
  {
    icon: 'home',
    title: 'Acolhimento',
    description:
      'Instalações completas com dormitórios, refeitório, salas de atendimento e espaços de convivência para até 20 pessoas.',
  },
  {
    icon: 'reab',
    title: 'Reabilitação',
    description:
      'Equipe multidisciplinar preparada para oferecer acompanhamento médico, psicológico e terapêutico especializado.',
  },
  {
    icon: 'edu',
    title: 'Reintegração',
    description:
      'Suporte pós-tratamento com monitoramento e apoio para prevenir recaídas e garantir uma recuperação duradoura.',
  },
] as const

/**
 * The {@link Page} component
 * @description Renders the public homepage
 * @returns The rendered homepage
 */
export default function Page() {
  // Render the full homepage layout
  return (
    <div className='flex min-h-screen flex-col'>
      <HeroWrapper>
        <div className='relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-xl md:hidden'>
          <Image
            src={heroImage}
            alt={homeCopy.HERO_IMAGE_ALT}
            fill
            priority
            sizes='100vw'
            className='object-cover'
          />
          <div className='absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary/60 to-transparent' />
        </div>

        <div className='flex flex-col justify-center'>
          <HeroTopText>{homeCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{homeCopy.HERO_TITLE}</HeroTitle>
          <HeroSubtitle>{homeCopy.HERO_SUBTITLE}</HeroSubtitle>

          <HeroDescription>{homeCopy.HERO_DESCRIPTION}</HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <CTAButton text={homeCopy.CTA_SUPPORT} />
            <Button
              render={<Link href={homeRoute.PROJECTS} />}
              nativeButton={false}
              size='lg'
              variant='outline'
              className='bg-white'
            >
              {homeCopy.CTA_LEARN}
            </Button>
          </div>

          <div className='mt-10 flex items-center gap-4'>
            <HeroStats
              value={homeCopy.STAT_CONSTRUCTION_VALUE}
              label={homeCopy.STAT_CONSTRUCTION_LABEL}
            />

            <HeroStats value={VOLUNTEERS_COUNT} label={homeCopy.STAT_VOLUNTEERS_LABEL} />
          </div>
        </div>

        <HeroCardSection className='hidden md:flex'>
          <HeroCard
            variant='home'
            title={homeCopy.CARD_TITLE}
            image={cardImage}
            imageClassName='object-contain'
          >
            {homeCopy.CARD_BODY}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <div className='mb-12 text-center'>
          <SectionTitle>{homeCopy.CAROUSEL_TITLE}</SectionTitle>

          <SectionDescription>{homeCopy.CAROUSEL_DESCRIPTION}</SectionDescription>
        </div>

        <Suspense
          fallback={
            <div className='flex w-full items-center gap-4'>
              {CAROUSEL_SKELETON_SLOTS.map((slot) => (
                <div key={slot} className='h-96 w-full animate-pulse rounded-md bg-slate-300' />
              ))}
            </div>
          }
        >
          <div className='mx-auto w-full max-w-[1400px]'>
            <ImageCarousel />
          </div>
        </Suspense>
      </section>

      <section className='bg-slate-50 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SectionTitle>{homeCopy.CENTRE_TITLE}</SectionTitle>

            <SectionDescription>{homeCopy.CENTRE_DESCRIPTION}</SectionDescription>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            {homeProjects.map((project) => (
              <HomeProjectCard
                key={project.title}
                icon={project.icon}
                title={project.title}
                href={homeRoute.PROJECTS}
              >
                {project.description}
              </HomeProjectCard>
            ))}
          </div>
        </div>
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
