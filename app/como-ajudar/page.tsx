import { Handshake, Heart, Users, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import projHabitacao from '@/assets/projectos/proj_habitacao.jpeg'
import { CTASection } from '@/components/cta'
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
import { PartnershipForm } from '@/components/partnership-form'
import { TestimonialSection } from '@/components/testimonial-section'
import { Button } from '@/components/ui/button'
import { SectionDescription, SectionTitle } from '@/components/ui/section'
import { VolunteerForm } from '@/components/volunteer-form'

/**
 * The {@link helpPageCopy} constant
 * @description Static Portuguese copy used by the help page
 */
const helpPageCopy = {
  HERO_TOP: 'Como Ajudar',
  HERO_TITLE: 'Faça Parte Desta Construção',
  HERO_SUBTITLE: 'Ajude a Construir Esperança',
  HERO_DESCRIPTION:
    'Sua contribuição é fundamental para concluirmos a construção do centro e começarmos a transformar vidas. Cada tijolo conta, cada ajuda importa..',
  STAT_VOLUNTEERS_LABEL: 'Voluntários Ativos',
  STAT_PARTNERS_LABEL: 'Parcerias Ativas',
  CARD_TITLE: 'Como Você Pode Ajudar',
  CARD_BODY: 'Escolha a forma que mais combina com você e faça parte desta transformação social.',
  SECTION_TITLE: 'Como Você Pode Ajudar',
  SECTION_DESCRIPTION:
    'Existem várias maneiras de contribuir com nossa causa. Escolha a que mais combina com você.',
} as const

/**
 * The {@link helpStats} constant
 * @description Hero statistic values for the help page
 */
const helpStats = {
  VOLUNTEERS: '5',
  PARTNERS: '2+',
} as const

/**
 * The {@link helpAnchor} constant
 * @description In-page anchors used by the help page
 */
const helpAnchor = {
  DONATE: '#doar',
  VOLUNTEER: '#voluntario',
  PARTNER: '#parceiro',
} as const

/**
 * The {@link HelpOption} type
 * @description Shape of each entry in {@link helpOptions}
 */
type HelpOption = {
  icon: LucideIcon
  title: string
  description: string
  href: string
  cta: string
}

/**
 * The {@link helpOptions} constant
 * @description The three "ways to help" cards rendered on the help page
 */
const helpOptions = [
  {
    icon: Heart,
    title: 'Doe',
    description:
      'Sua doação ajuda a manter nossos programas de tratamento e acompanhamento pós-reabilitação.',
    href: helpAnchor.DONATE,
    cta: 'Doe Agora',
  },
  {
    icon: Users,
    title: 'Seja Voluntário',
    description: 'Ajude em nossos programas de acompanhamento e suporte emocional aos pacientes.',
    href: helpAnchor.VOLUNTEER,
    cta: 'Inscreva-se',
  },
  {
    icon: Handshake,
    title: 'Seja Parceiro',
    description: 'Apoie nosso trabalho de reintegração social e manutenção da sobriedade.',
    href: helpAnchor.PARTNER,
    cta: 'Saiba Mais',
  },
] as const satisfies readonly HelpOption[]

/**
 * The {@link HelpPage} component
 * @description Renders the public "como ajudar" page
 * @returns The rendered help page
 */
export default function HelpPage() {
  // Render the full help page layout
  return (
    <div className='flex min-h-dvh flex-col'>
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{helpPageCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{helpPageCopy.HERO_TITLE}</HeroTitle>
          <HeroSubtitle>{helpPageCopy.HERO_SUBTITLE}</HeroSubtitle>

          <HeroDescription>{helpPageCopy.HERO_DESCRIPTION}</HeroDescription>

          <div className='mt-10 flex items-center gap-4'>
            <HeroStats value={helpStats.VOLUNTEERS} label={helpPageCopy.STAT_VOLUNTEERS_LABEL} />

            <HeroStats value={helpStats.PARTNERS} label={helpPageCopy.STAT_PARTNERS_LABEL} />
          </div>
        </div>

        <HeroCardSection>
          <HeroCard variant='ajudar' title={helpPageCopy.CARD_TITLE} image={projHabitacao}>
            {helpPageCopy.CARD_BODY}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SectionTitle>{helpPageCopy.SECTION_TITLE}</SectionTitle>

            <SectionDescription>{helpPageCopy.SECTION_DESCRIPTION}</SectionDescription>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            {helpOptions.map((option) => {
              // Resolve the option icon component
              const Icon = option.icon

              // Render the option card
              return (
                <div
                  key={option.title}
                  className='flex flex-col items-center rounded-lg bg-muted p-8 text-center'
                >
                  <Icon className='size-12 text-secondary' />

                  <h3 className='mt-4 font-bold text-xl'>{option.title}</h3>

                  <p className='mt-2 text-pretty'>{option.description}</p>

                  <Button
                    render={<Link href={option.href} />}
                    nativeButton={false}
                    variant='CTA'
                    className='mt-6'
                  >
                    {option.cta}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id='voluntario' className='scroll-mt-8 bg-slate-50 py-16'>
        <VolunteerForm />
      </section>

      <section id='parceiro' className='scroll-mt-8 py-16'>
        <PartnershipForm />
      </section>

      <TestimonialSection />

      <CTASection className='border-b' />
    </div>
  )
}
