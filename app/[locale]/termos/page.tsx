import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'

import { HeroDescription, HeroTitle, HeroTopText, HeroWrapper } from '@/components/heroSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link metadata} constant
 * @description Per-route SEO metadata for the terms page
 */
export const metadata: Metadata = buildMetadata({
  title: 'Termos e Condições',
  description: 'Termos de utilização do website da DI MI PA BÔS e condições aplicáveis às doações.',
  path: '/termos',
})

/**
 * The {@link termsCopy} constant
 * @description Static Portuguese copy used by the terms page
 */
const termsCopy = {
  HERO_TOP: 'Informação Legal',
  HERO_TITLE: 'Termos e Condições',
  HERO_DESCRIPTION:
    'Estes termos regulam a utilização do website da ONG DI MI PA BÔS e as condições aplicáveis às doações e demais interações disponibilizadas.',
  LAST_UPDATED_LABEL: 'Última atualização:',
  LAST_UPDATED_VALUE: '27 de Maio de 2026',
  DONATIONS_EMAIL: 'donativos@ongdimipabos.org',
  GENERAL_EMAIL: 'contact@ongdimipabos.org',
} as const

/**
 * The {@link organizationDetails} constant
 * @description Legal identification of the responsible organization
 */
const organizationDetails = {
  LEGAL_NAME: 'ONG DI MI PA BÔS',
  NIPC: '910324840',
  LEGAL_FORM: 'Organização Não Governamental (ONG)',
  COUNTRY: 'República da Guiné-Bissau',
  ADDRESS: 'Bissau, Guiné-Bissau',
} as const

/**
 * The {@link TermsSection} type
 * @description Shape of a section rendered on the terms page
 */
type TermsSection = {
  id: string
  title: string
  paragraphs: readonly string[]
  list?: readonly string[]
}

/**
 * The {@link termsSections} constant
 * @description Ordered sections rendered on the terms page
 */
const termsSections: readonly TermsSection[] = [
  {
    id: 'identificacao',
    title: '1. Identificação',
    paragraphs: [
      `Este website é detido e operado pela ${organizationDetails.LEGAL_NAME} (${organizationDetails.LEGAL_FORM}), com o número de identificação fiscal ${organizationDetails.NIPC}, sede em ${organizationDetails.ADDRESS}, ${organizationDetails.COUNTRY}, contactável através do endereço ${termsCopy.GENERAL_EMAIL}.`,
    ],
  },
  {
    id: 'objeto',
    title: '2. Objeto',
    paragraphs: [
      'O presente website tem como finalidade dar a conhecer a missão, os projetos e as iniciativas da ONG DI MI PA BÔS, bem como permitir aos visitantes contactar a organização, candidatar-se a voluntariado, propor parcerias e contribuir através de doações.',
      'A utilização do website pressupõe a aceitação integral dos presentes termos e da Política de Privacidade.',
    ],
  },
  {
    id: 'doacoes',
    title: '3. Doações',
    paragraphs: [
      'As doações realizadas através deste website têm natureza voluntária e revertem integralmente para o financiamento das atividades e projetos da ONG DI MI PA BÔS, podendo ser afetas a qualquer área de intervenção de acordo com as necessidades operacionais da organização, salvo indicação expressa em contrário no momento da doação.',
      'A doação é considerada concluída no momento em que a transação é confirmada pelo prestador de serviços de pagamento. Por se tratar de liberalidade sem contraprestação, as doações têm, em regra, caráter definitivo e não reembolsável.',
    ],
  },
  {
    id: 'reembolsos',
    title: '4. Pedidos de reembolso',
    paragraphs: [
      'Sem prejuízo do caráter definitivo das doações, o doador pode solicitar o reembolso de uma doação no prazo de catorze (14) dias contados da respetiva data, quando se verifique erro comprovado, duplicação de pagamento, transação não autorizada ou outra circunstância manifestamente justificada.',
      `Os pedidos de reembolso devem ser enviados para ${termsCopy.DONATIONS_EMAIL}, indicando o nome do doador, a data, o valor da doação e o motivo do pedido. A organização compromete-se a analisar e responder a cada pedido em tempo útil.`,
    ],
  },
  {
    id: 'pagamentos',
    title: '5. Processamento de pagamentos',
    paragraphs: [
      'O processamento das doações é assegurado por um prestador de serviços de pagamento terceiro, a indicar oportunamente nesta página. A ONG DI MI PA BÔS não recolhe nem armazena dados de cartão ou outros dados sensíveis de pagamento, sendo essa responsabilidade integralmente assumida pelo prestador, em conformidade com os padrões aplicáveis à indústria de pagamentos.',
    ],
  },
  {
    id: 'recibos',
    title: '6. Comprovativos e recibos',
    paragraphs: [
      `Após cada doação concluída, o doador receberá um comprovativo eletrónico emitido pelo prestador de serviços de pagamento. Recibos adicionais podem ser solicitados a pedido, através do endereço ${termsCopy.DONATIONS_EMAIL}, indicando os dados necessários à respetiva emissão.`,
      'A ONG DI MI PA BÔS não emite, no presente, declarações com efeitos de dedução fiscal em Portugal ou noutras jurisdições. A elegibilidade fiscal de uma doação é da responsabilidade do doador, devendo ser avaliada à luz da legislação aplicável no seu país de residência.',
    ],
  },
  {
    id: 'propriedade',
    title: '7. Propriedade intelectual',
    paragraphs: [
      'Todos os conteúdos disponibilizados neste website, incluindo textos, imagens, vídeos, logótipos, marcas, ilustrações e elementos gráficos, são propriedade da ONG DI MI PA BÔS ou de terceiros que autorizaram a sua utilização e encontram-se protegidos pela legislação aplicável em matéria de propriedade intelectual.',
      'É proibida a reprodução, distribuição, modificação ou utilização comercial dos conteúdos sem autorização prévia e expressa da organização, salvo para fins de uso pessoal não comercial.',
    ],
  },
  {
    id: 'responsabilidade',
    title: '8. Limitação de responsabilidade',
    paragraphs: [
      'A ONG DI MI PA BÔS envida os melhores esforços para garantir a exatidão e atualização da informação disponibilizada neste website, não assumindo, contudo, responsabilidade por eventuais erros, omissões ou indisponibilidades técnicas pontuais.',
      'Este website pode conter ligações para sites externos, cujos conteúdos e políticas são da exclusiva responsabilidade das respetivas entidades, não sendo assumida qualquer responsabilidade pelo seu funcionamento ou pelas práticas dessas entidades.',
    ],
  },
  {
    id: 'lei-aplicavel',
    title: '9. Lei aplicável e foro',
    paragraphs: [
      'Os presentes termos regem-se pela lei da República da Guiné-Bissau. Qualquer litígio emergente da sua aplicação ou interpretação será submetido aos tribunais competentes de Bissau, sem prejuízo dos foros legalmente imperativos aplicáveis a consumidores residentes noutras jurisdições.',
    ],
  },
  {
    id: 'alteracoes',
    title: '10. Alterações',
    paragraphs: [
      'A ONG DI MI PA BÔS reserva-se o direito de alterar os presentes termos a qualquer momento. A versão em vigor é sempre a publicada nesta página, identificada pela data de última atualização indicada no topo.',
    ],
  },
] as const

/**
 * The {@link TermsPage} component
 * @description Renders the public terms and conditions page
 * @returns The rendered terms page
 */
export default function TermsPage() {
  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Início', path: '/' },
    { name: 'Termos e Condições', path: '/termos' },
  ])

  // Render the full terms page layout
  return (
    <div className='flex min-h-screen flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper className='min-h-0'>
        <div className='flex flex-col justify-center md:col-span-2'>
          <HeroTopText>{termsCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{termsCopy.HERO_TITLE}</HeroTitle>

          <HeroDescription>{termsCopy.HERO_DESCRIPTION}</HeroDescription>

          <p className='mt-6 text-muted-foreground text-sm'>
            <span className='font-semibold'>{termsCopy.LAST_UPDATED_LABEL}</span>{' '}
            {termsCopy.LAST_UPDATED_VALUE}
          </p>
        </div>
      </HeroWrapper>

      <article className='mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8'>
        {termsSections.map((section) => (
          <section key={section.id} id={section.id} className='mb-10'>
            <h2 className='mb-4 font-semibold text-2xl text-foreground'>{section.title}</h2>

            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className='mb-4 text-foreground/80 leading-relaxed'>
                {paragraph}
              </p>
            ))}

            {section.list && (
              <ul className='ml-6 list-disc space-y-2 text-foreground/80'>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className='mt-12 border-border border-t pt-6 text-muted-foreground text-sm'>
          Consulte também a nossa{' '}
          <Link
            href='/politica-de-privacidade'
            className='text-primary underline underline-offset-4'
          >
            Política de Privacidade
          </Link>
          .
        </p>
      </article>
    </div>
  )
}
