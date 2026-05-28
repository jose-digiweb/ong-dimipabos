import { Eye, HandshakeIcon, Heart, type LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

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
import { TeamSection } from '@/components/team-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionTitle } from '@/components/section'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link metadata} constant
 * @description Per-route SEO metadata for the sobre page
 */
export const metadata: Metadata = buildMetadata({
  title: 'Sobre Nós',
  description:
    'Conheça a história, missão e equipa da ONG DI MI PA BÔS, dedicada a transformar vidas na Guiné-Bissau.',
  path: '/sobre',
})

/**
 * The {@link aboutCopy} constant
 * @description Static Portuguese copy used by the sobre page
 */
const aboutCopy = {
  HERO_TOP: 'Nossa História',
  HERO_TITLE: 'Quem Somos',
  HERO_SUBTITLE: 'Construindo um futuro de esperança',
  HERO_DESCRIPTION:
    'A DI MI PA BÔS (também conhecida como dimipabos) é uma ONG na Guiné-Bissau, sediada em Bissau. Nascemos da urgente necessidade de oferecer tratamento adequado e humanizado para pessoas em situação de dependência química, e nossa missão é construir e operar o primeiro centro especializado do país.',
  CTA_SUPPORT: 'Apoie Nossa Causa',
  CTA_PROJECTS: 'Conheça o Projeto',
  STAT_FOUNDED_LABEL: 'Ano de Fundação',
  STAT_CONSTRUCTION_VALUE: '10%',
  STAT_CONSTRUCTION_LABEL: 'Da Construção Concluída',
  STAT_VOLUNTEERS_VALUE: '5',
  STAT_VOLUNTEERS_LABEL: 'Voluntários Ativos',
  CARD_TITLE: 'Nossa Essência',
  CARD_BODY:
    'Trabalhamos incansavelmente para construir um espaço de acolhimento e recuperação, onde cada pessoa possa encontrar apoio para recomeçar.',
  HISTORY_TITLE: 'Nossa História',
  HISTORY_IMAGE_ALT: 'Fundação da ONG',
  MVV_TITLE: 'Missão, Visão e Valores',
  COMMITMENTS_TITLE: 'Nossos Compromissos',
  COMMITMENTS_FOOTER:
    'Acreditamos que a recuperação é possível quando há estrutura adequada, tratamento especializado e apoio contínuo. É por isso que trabalhamos incansavelmente na construção do nosso centro.',
  CTA_COMMITMENTS: 'Apoie essa causa',
} as const

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
 * The {@link historyParagraphs} constant
 * @description Story paragraphs rendered in the "Nossa História" section
 */
const historyParagraphs = [
  'A ONG DI MI PA BÔS nasceu em 2021 com um propósito simples, mas essencial: levar ajuda a quem mais precisa. Inicialmente, nosso foco estava em doações, fornecendo apoio básico para pessoas em situação de vulnerabilidade na Guiné-Bissau. No entanto, ao longo do nosso trabalho, percebemos uma necessidade ainda maior — um espaço seguro e estruturado para acolher e tratar pessoas que lutam contra a dependência química.',
  'Dessa constatação, surgiu o nosso grande projeto: a construção de um centro de acolhimento e tratamento para pessoas que enfrentam desafios com o uso de substâncias. Esse centro será um lugar onde elas poderão se recuperar com dignidade, recebendo tratamento adequado e um acompanhamento contínuo para garantir sua reabilitação e reintegração à sociedade.',
  'Ainda estamos em fase de construção, mas cada passo que damos é movido pelo compromisso de transformar vidas. Com o apoio da comunidade, parceiros e doadores, estamos construindo um futuro onde mais pessoas tenham a chance de recomeçar.',
  'Junte-se a nós nessa missão e ajude a tornar esse sonho realidade! 💙✨',
] as const

/**
 * The {@link MissionItem} type
 * @description Shape of an entry in {@link missionItems}
 */
type MissionItem = {
  title: string
  icon: LucideIcon
  body: string | readonly string[]
}

/**
 * The {@link missionItems} constant
 * @description The mission/vision/values cards
 */
const missionItems = [
  {
    title: 'Missão',
    icon: Heart,
    body: 'Construir e operar o primeiro centro especializado em tratamento e reabilitação para pessoas em situação de dependência química na Guiné-Bissau, oferecendo acolhimento e cuidado humanizado.',
  },
  {
    title: 'Visão',
    icon: Eye,
    body: 'Ser referência em tratamento e reabilitação na Guiné-Bissau, proporcionando um espaço de acolhimento, recuperação e renovação para quem precisa.',
  },
  {
    title: 'Valores',
    icon: HandshakeIcon,
    body: [
      'Empatia e Respeito no acolhimento',
      'Transparência em nossas ações',
      'Compromisso com a recuperação',
    ],
  },
] as const satisfies readonly MissionItem[]

/**
 * The {@link commitments} constant
 * @description The three commitment cards rendered at the bottom of the sobre page
 */
const commitments = [
  {
    title: 'Transparência',
    description: 'Prestação de contas clara sobre o uso dos recursos e andamento da construção.',
  },
  {
    title: 'Qualidade',
    description:
      'Construção e implementação de um centro com estrutura adequada e equipe capacitada.',
  },
  {
    title: 'Impacto Social',
    description:
      'Compromisso com a transformação efetiva de vidas através do tratamento especializado.',
  },
] as const

/**
 * The {@link SobrePage} component
 * @description Renders the public "sobre" page
 * @returns The rendered sobre page
 */
export default function SobrePage() {
  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Início', path: '/' },
    { name: 'Sobre Nós', path: '/sobre' },
  ])

  // Render the full sobre page layout
  return (
    <div className='flex min-h-screen flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{aboutCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{aboutCopy.HERO_TITLE}</HeroTitle>
          <HeroSubtitle>{aboutCopy.HERO_SUBTITLE}</HeroSubtitle>

          <HeroDescription>{aboutCopy.HERO_DESCRIPTION}</HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <CTAButton text={aboutCopy.CTA_SUPPORT} size='lg' />

            <Button
              render={<Link href={aboutRoute.PROJECTS} />}
              nativeButton={false}
              size='lg'
              variant='outline'
              className='bg-white'
            >
              {aboutCopy.CTA_PROJECTS}
            </Button>
          </div>

          <div className='mt-10 flex items-center gap-4'>
            <HeroStats value={FOUNDED_YEAR} label={aboutCopy.STAT_FOUNDED_LABEL} />

            <HeroStats
              value={aboutCopy.STAT_CONSTRUCTION_VALUE}
              label={aboutCopy.STAT_CONSTRUCTION_LABEL}
            />

            <HeroStats
              value={aboutCopy.STAT_VOLUNTEERS_VALUE}
              label={aboutCopy.STAT_VOLUNTEERS_LABEL}
            />
          </div>
        </div>

        <HeroCardSection>
          <HeroCard
            variant='sobre'
            title={aboutCopy.CARD_TITLE}
            image={logo}
            imageClassName='object-contain'
          >
            {aboutCopy.CARD_BODY}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section id='historia' className='bg-slate-50 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-12 md:grid-cols-[1fr_35%] lg:gap-8'>
            <div className='flex flex-col justify-center'>
              <SectionTitle>{aboutCopy.HISTORY_TITLE}</SectionTitle>

              <div className='mt-6 space-y-6 text-lg text-muted-foreground'>
                {historyParagraphs.map((paragraph) => (
                  <p key={paragraph} className='text-pretty'>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className='relative mx-auto w-96 md:mx-0 md:my-auto md:w-auto'>
              <div className='aspect-square overflow-hidden rounded-full drop-shadow-md'>
                <Image
                  fill
                  src={logo}
                  alt={aboutCopy.HISTORY_IMAGE_ALT}
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
            <SectionTitle>{aboutCopy.MVV_TITLE}</SectionTitle>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            {missionItems.map((item) => {
              // Resolve the item icon component
              const Icon = item.icon

              // Render the mission/vision/values card
              return (
                <Card key={item.title}>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Icon className='size-6 text-secondary' />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(item.body) ? (
                      <ul className='space-y-2 text-muted-foreground'>
                        {item.body.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-pretty text-muted-foreground'>{item.body as string}</p>
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
            <SectionTitle>{aboutCopy.COMMITMENTS_TITLE}</SectionTitle>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            {commitments.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-pretty text-muted-foreground'>{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='mt-16 text-center'>
            <p className='mx-auto max-w-2xl text-pretty text-lg text-muted-foreground'>
              {aboutCopy.COMMITMENTS_FOOTER}
            </p>
            <div className='mt-8'>
              <CTAButton text={aboutCopy.CTA_COMMITMENTS} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
