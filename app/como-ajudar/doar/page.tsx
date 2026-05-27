import type { Metadata } from 'next'

import projHabitacao from '@/assets/projectos/proj_habitacao.jpeg'
import { BankTransferSection } from '@/components/bank-transfer-section'
import { CTASection } from '@/components/cta'
import {
  HeroCard,
  HeroCardSection,
  HeroDescription,
  HeroSubtitle,
  HeroTitle,
  HeroTopText,
  HeroWrapper,
} from '@/components/heroSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link metadata} constant
 * @description Per-route SEO metadata for the donate page
 */
export const metadata: Metadata = buildMetadata({
  title: 'Como Doar',
  description:
    'Apoie a construção do Centro de Tratamento e Reabilitação da DI MI PA BÔS através de uma doação por transferência bancária.',
  path: '/como-ajudar/doar',
})

/**
 * The {@link donatePageCopy} constant
 * @description Static Portuguese copy used by the donate page
 */
const donatePageCopy = {
  HERO_TOP: 'Como Ajudar / Doe',
  HERO_TITLE: 'Sua Doação Constrói Esperança',
  HERO_SUBTITLE: 'Cada Euro Importa',
  HERO_DESCRIPTION:
    'Sua contribuição é fundamental para concluirmos a construção do centro e começarmos a transformar vidas. Cada tijolo conta, cada ajuda importa.',
  CARD_TITLE: 'Por que Doar',
  CARD_BODY:
    '100% dos fundos são destinados à construção e operação do centro de acolhimento, com prestação de contas transparente.',
} as const

/**
 * The {@link DonatePage} component
 * @description Renders the standalone donation page
 * @returns The rendered donate page
 */
export default function DonatePage() {
  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Início', path: '/' },
    { name: 'Como Doar', path: '/como-ajudar/doar' },
  ])

  // Render the full donate page layout
  return (
    <div className='flex min-h-dvh flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{donatePageCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{donatePageCopy.HERO_TITLE}</HeroTitle>
          <HeroSubtitle>{donatePageCopy.HERO_SUBTITLE}</HeroSubtitle>

          <HeroDescription>{donatePageCopy.HERO_DESCRIPTION}</HeroDescription>
        </div>

        <HeroCardSection>
          <HeroCard variant='ajudar' title={donatePageCopy.CARD_TITLE} image={projHabitacao}>
            {donatePageCopy.CARD_BODY}
          </HeroCard>
        </HeroCardSection>
      </HeroWrapper>

      <section className='py-16'>
        <BankTransferSection />
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
