import type { Metadata } from 'next'

import projEducacao from '@/assets/projectos/proj_educacao.jpeg'
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
import { TestimonialSection } from '@/components/testimonial-section'
import { VolunteerForm } from '@/components/volunteer-form'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link metadata} constant
 * @description Per-route SEO metadata for the volunteer page
 */
export const metadata: Metadata = buildMetadata({
  title: 'Seja Voluntário',
  description:
    'Doe o seu tempo e talento como voluntário da DI MI PA BÔS e ajude a transformar vidas na Guiné-Bissau.',
  path: '/como-ajudar/voluntario',
})

/**
 * The {@link volunteerPageCopy} constant
 * @description Static Portuguese copy used by the volunteer page
 */
const volunteerPageCopy = {
  HERO_TOP: 'Como Ajudar / Voluntário',
  HERO_TITLE: 'Seja Voluntário e Mude Vidas',
  HERO_SUBTITLE: 'Some Sua Energia à Nossa Missão',
  HERO_DESCRIPTION:
    'Doe seu tempo e talento para nossos programas de acompanhamento, suporte emocional e atividades terapêuticas. Cada hora dedicada transforma uma história.',
  STAT_VOLUNTEERS_LABEL: 'Voluntários Ativos',
  CARD_TITLE: 'Por que ser Voluntário',
  CARD_BODY:
    'Faça parte de uma equipe que acolhe, escuta e reconstrói trajetórias junto com pessoas em situação de vulnerabilidade.',
} as const

/**
 * The {@link volunteerStats} constant
 * @description Hero statistic values for the volunteer page
 */
const volunteerStats = {
  VOLUNTEERS: '5',
} as const

/**
 * The {@link VolunteerPage} component
 * @description Renders the standalone volunteer page
 * @returns The rendered volunteer page
 */
export default function VolunteerPage() {
  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Início', path: '/' },
    { name: 'Seja Voluntário', path: '/como-ajudar/voluntario' },
  ])

  // Render the full volunteer page layout
  return (
    <div className='flex min-h-dvh flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{volunteerPageCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{volunteerPageCopy.HERO_TITLE}</HeroTitle>
          <HeroSubtitle>{volunteerPageCopy.HERO_SUBTITLE}</HeroSubtitle>

          <HeroDescription>{volunteerPageCopy.HERO_DESCRIPTION}</HeroDescription>

          <div className='mt-10 flex items-center gap-4'>
            <HeroStats
              value={volunteerStats.VOLUNTEERS}
              label={volunteerPageCopy.STAT_VOLUNTEERS_LABEL}
            />
          </div>
        </div>

        <HeroCardSection>
          <HeroCard variant='ajudar' title={volunteerPageCopy.CARD_TITLE} image={projEducacao}>
            {volunteerPageCopy.CARD_BODY}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='bg-slate-50 py-16'>
        <VolunteerForm />
      </section>

      <TestimonialSection />

      <CTASection className='border-b' />
    </div>
  )
}
