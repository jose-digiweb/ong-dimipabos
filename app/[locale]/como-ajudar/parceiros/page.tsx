import type { Metadata } from 'next'

import projReab from '@/assets/projectos/proj_reab.jpeg'
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
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link metadata} constant
 * @description Per-route SEO metadata for the partners page
 */
export const metadata: Metadata = buildMetadata({
  title: 'Parcerias',
  description:
    'Construa uma parceria com a DI MI PA BÔS e amplie o impacto da reabilitação e reintegração social na Guiné-Bissau.',
  path: '/como-ajudar/parceiros',
})

/**
 * The {@link partnersPageCopy} constant
 * @description Static Portuguese copy used by the partners page
 */
const partnersPageCopy = {
  HERO_TOP: 'Como Ajudar / Parceiros',
  HERO_TITLE: 'Seja Nosso Parceiro',
  HERO_SUBTITLE: 'Construa Junto com a Gente',
  HERO_DESCRIPTION:
    'Empresas, instituições e organizações que se juntam à DI MI PA BÔS ampliam o alcance da reabilitação e reintegração social na Guiné-Bissau.',
  STAT_PARTNERS_LABEL: 'Parcerias Ativas',
  CARD_TITLE: 'Por que ser Parceiro',
  CARD_BODY:
    'Apoie o trabalho de reintegração social, manutenção da sobriedade e fortalecimento comunitário com visibilidade e impacto mensurável.',
} as const

/**
 * The {@link partnersStats} constant
 * @description Hero statistic values for the partners page
 */
const partnersStats = {
  PARTNERS: '2+',
} as const

/**
 * The {@link PartnersPage} component
 * @description Renders the standalone partners page
 * @returns The rendered partners page
 */
export default function PartnersPage() {
  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Início', path: '/' },
    { name: 'Parcerias', path: '/como-ajudar/parceiros' },
  ])

  // Render the full partners page layout
  return (
    <div className='flex min-h-dvh flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{partnersPageCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{partnersPageCopy.HERO_TITLE}</HeroTitle>
          <HeroSubtitle>{partnersPageCopy.HERO_SUBTITLE}</HeroSubtitle>

          <HeroDescription>{partnersPageCopy.HERO_DESCRIPTION}</HeroDescription>

          <div className='mt-10 flex items-center gap-4'>
            <HeroStats
              value={partnersStats.PARTNERS}
              label={partnersPageCopy.STAT_PARTNERS_LABEL}
            />
          </div>
        </div>

        <HeroCardSection>
          <HeroCard variant='ajudar' title={partnersPageCopy.CARD_TITLE} image={projReab}>
            {partnersPageCopy.CARD_BODY}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <PartnershipForm />
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
