import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'

import { HeroDescription, HeroTitle, HeroTopText, HeroWrapper } from '@/components/heroSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link metadata} constant
 * @description Per-route SEO metadata for the privacy policy page
 */
export const metadata: Metadata = buildMetadata({
  title: 'Política de Privacidade',
  description:
    'Como a ONG DI MI PA BÔS recolhe, utiliza e protege os dados pessoais dos visitantes deste website.',
  path: '/politica-de-privacidade',
})

/**
 * The {@link privacyCopy} constant
 * @description Static Portuguese copy used by the privacy policy page
 */
const privacyCopy = {
  HERO_TOP: 'Informação Legal',
  HERO_TITLE: 'Política de Privacidade',
  HERO_DESCRIPTION:
    'Esta política descreve como a ONG DI MI PA BÔS recolhe, utiliza e protege os seus dados pessoais quando interage com este website.',
  LAST_UPDATED_LABEL: 'Última atualização:',
  LAST_UPDATED_VALUE: '27 de Maio de 2026',
  CONTACT_EMAIL: 'privacidade@ongdimipabos.org',
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
 * The {@link PrivacySection} type
 * @description Shape of a section rendered on the privacy policy page
 */
type PrivacySection = {
  id: string
  title: string
  paragraphs: readonly string[]
  list?: readonly string[]
}

/**
 * The {@link privacySections} constant
 * @description Ordered sections rendered on the privacy policy page
 */
const privacySections: readonly PrivacySection[] = [
  {
    id: 'responsavel',
    title: '1. Responsável pelo tratamento',
    paragraphs: [
      `O responsável pelo tratamento dos seus dados pessoais é a ${organizationDetails.LEGAL_NAME} (${organizationDetails.LEGAL_FORM}), com o número de identificação fiscal ${organizationDetails.NIPC}, sede em ${organizationDetails.ADDRESS}, ${organizationDetails.COUNTRY}.`,
      `Para qualquer questão relativa ao tratamento dos seus dados, pode contactar-nos através do endereço ${privacyCopy.CONTACT_EMAIL}.`,
    ],
  },
  {
    id: 'dados',
    title: '2. Dados pessoais recolhidos',
    paragraphs: [
      'Recolhemos apenas os dados necessários para o funcionamento dos serviços disponibilizados neste website, conforme indicado nos formulários disponíveis. Em concreto, podemos recolher:',
    ],
    list: [
      'Dados de identificação e contacto fornecidos voluntariamente em formulários (nome, endereço de email, telefone, mensagem).',
      'Dados associados a doações, quando aplicável, processados diretamente pelo prestador de serviços de pagamento que venha a ser contratado.',
      'Dados técnicos recolhidos de forma automática pelo nosso fornecedor de infraestrutura (endereço IP, tipo de navegador, data e hora do acesso), exclusivamente para fins de segurança e funcionamento do site.',
    ],
  },
  {
    id: 'finalidades',
    title: '3. Finalidades e fundamento legal',
    paragraphs: ['Tratamos os seus dados pessoais para as seguintes finalidades:'],
    list: [
      'Responder a pedidos de contacto, candidaturas a voluntariado e propostas de parceria submetidos através dos formulários do website (execução de diligências pré-contratuais e interesse legítimo).',
      'Processar doações, emitir comprovativos e cumprir obrigações legais e contabilísticas associadas (cumprimento de obrigação legal e execução de contrato).',
      'Garantir a segurança, integridade e funcionamento técnico do website (interesse legítimo).',
    ],
  },
  {
    id: 'subcontratantes',
    title: '4. Subcontratantes e transferências internacionais',
    paragraphs: [
      'Para prestar os nossos serviços recorremos a fornecedores que atuam como subcontratantes, vinculados por obrigações contratuais de confidencialidade e proteção de dados:',
    ],
    list: [
      'Cloudflare, Inc., para alojamento, distribuição e segurança do website e dos respetivos ativos digitais.',
      'Prestador de serviços de pagamento, a indicar oportunamente, para o processamento de doações eletrónicas.',
    ],
  },
  {
    id: 'transferencias',
    title: '5. Transferências internacionais de dados',
    paragraphs: [
      'Alguns dos nossos subcontratantes estão sediados fora da Guiné-Bissau e do Espaço Económico Europeu, designadamente nos Estados Unidos da América. Sempre que existam transferências internacionais de dados, asseguramos que as mesmas são realizadas com base em garantias adequadas, nomeadamente Cláusulas Contratuais-Tipo aprovadas pela Comissão Europeia, quando aplicáveis.',
    ],
  },
  {
    id: 'conservacao',
    title: '6. Conservação dos dados',
    paragraphs: [
      'Os seus dados pessoais são conservados apenas durante o período necessário para as finalidades para as quais foram recolhidos, ou pelo período legalmente exigido. Mensagens enviadas através dos formulários do website são conservadas pelo tempo necessário ao seu tratamento e arquivo histórico, podendo ser eliminadas a pedido do titular. Registos associados a doações são conservados pelos prazos exigidos pela legislação contabilística e fiscal aplicável.',
    ],
  },
  {
    id: 'direitos',
    title: '7. Os seus direitos',
    paragraphs: ['Enquanto titular dos dados, assistem-lhe os seguintes direitos:'],
    list: [
      'Direito de acesso aos seus dados pessoais.',
      'Direito de retificação de dados inexatos ou incompletos.',
      'Direito ao apagamento dos dados, nos casos previstos na lei.',
      'Direito à limitação e à oposição ao tratamento, nos casos legalmente admitidos.',
      'Direito à portabilidade dos dados, quando aplicável.',
      'Direito a apresentar reclamação junto da autoridade de controlo competente.',
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies',
    paragraphs: [
      'Este website utiliza apenas cookies e tecnologias semelhantes estritamente necessárias ao seu funcionamento, não recorrendo, à data, a cookies de análise, publicidade ou rastreio comportamental que exijam consentimento prévio. Caso esta situação se altere, esta política será atualizada e será solicitado o consentimento adequado.',
    ],
  },
  {
    id: 'contacto',
    title: '9. Contacto',
    paragraphs: [
      `Para exercer os seus direitos ou esclarecer qualquer dúvida sobre o tratamento dos seus dados pessoais, contacte-nos através de ${privacyCopy.CONTACT_EMAIL} ou, em alternativa, ${privacyCopy.GENERAL_EMAIL}. Comprometemo-nos a responder sem demora injustificada e, em qualquer caso, dentro dos prazos legalmente aplicáveis.`,
    ],
  },
  {
    id: 'alteracoes',
    title: '10. Alterações a esta política',
    paragraphs: [
      'Esta Política de Privacidade poderá ser atualizada a qualquer momento para refletir alterações legais, técnicas ou operacionais. A versão em vigor é sempre a publicada nesta página, identificada pela data de última atualização indicada no topo.',
    ],
  },
] as const

/**
 * The {@link PrivacyPolicyPage} component
 * @description Renders the public privacy policy page
 * @returns The rendered privacy policy page
 */
export default function PrivacyPolicyPage() {
  // Build the breadcrumb schema for this route
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Início', path: '/' },
    { name: 'Política de Privacidade', path: '/politica-de-privacidade' },
  ])

  // Render the full privacy policy layout
  return (
    <div className='flex min-h-screen flex-col'>
      <JsonLd data={breadcrumbSchema} />
      <HeroWrapper className='min-h-0'>
        <div className='flex flex-col justify-center md:col-span-2'>
          <HeroTopText>{privacyCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>{privacyCopy.HERO_TITLE}</HeroTitle>

          <HeroDescription>{privacyCopy.HERO_DESCRIPTION}</HeroDescription>

          <p className='mt-6 text-muted-foreground text-sm'>
            <span className='font-semibold'>{privacyCopy.LAST_UPDATED_LABEL}</span>{' '}
            {privacyCopy.LAST_UPDATED_VALUE}
          </p>
        </div>
      </HeroWrapper>

      <article className='mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8'>
        {privacySections.map((section) => (
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
          Consulte também os nossos{' '}
          <Link href='/termos' className='text-primary underline underline-offset-4'>
            Termos e Condições
          </Link>
          .
        </p>
      </article>
    </div>
  )
}
