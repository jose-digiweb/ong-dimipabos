import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { Locale } from '@/i18n/config'
import type { VolunteerArea } from '@/lib/forms/volunteer-schema'

/**
 * The {@link VolunteerSubmissionEmailProps} type
 * @description Props consumed by {@link VolunteerSubmissionEmail}
 */
export type VolunteerSubmissionEmailProps = {
  name: string
  email: string
  phone: string
  area: VolunteerArea
  availability: string
  experience: string
  locale: Locale
  submittedAt: Date
}

/**
 * The {@link areaLabel} constant
 * @description Localized labels for each {@link VolunteerArea}
 */
const areaLabel: Record<Locale, Record<VolunteerArea, string>> = {
  pt: {
    construction: 'Construção',
    education: 'Educação',
    health: 'Saúde',
    social: 'Assistência Social',
    admin: 'Administrativo',
  },
  en: {
    construction: 'Construction',
    education: 'Education',
    health: 'Health',
    social: 'Social Assistance',
    admin: 'Administrative',
  },
}

/**
 * The {@link emailCopy} constant
 * @description Localized labels rendered in the notification email
 */
const emailCopy = {
  pt: {
    preview: (name: string) => `Nova candidatura de voluntário — ${name}`,
    heading: 'Nova candidatura de voluntário',
    intro: 'Foi recebida uma nova candidatura através do site DI MI PA BÔS.',
    nameLabel: 'Nome',
    emailLabel: 'Email',
    phoneLabel: 'Telefone',
    areaLabel: 'Área de interesse',
    availabilityLabel: 'Disponibilidade',
    experienceLabel: 'Experiência',
    submittedAtLabel: 'Recebida em',
    noExperience: '(Nenhuma experiência informada)',
    replyHint: 'Responder a este email envia uma resposta diretamente para o candidato.',
    footer: 'DI MI PA BÔS · ongdimipabos.org',
  },
  en: {
    preview: (name: string) => `New volunteer application — ${name}`,
    heading: 'New volunteer application',
    intro: 'A new volunteer application was received through the DI MI PA BÔS website.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    areaLabel: 'Area of interest',
    availabilityLabel: 'Availability',
    experienceLabel: 'Experience',
    submittedAtLabel: 'Received at',
    noExperience: '(No experience provided)',
    replyHint: 'Replying to this email sends a response directly to the applicant.',
    footer: 'DI MI PA BÔS · ongdimipabos.org',
  },
} as const

/**
 * The {@link VolunteerSubmissionEmail} component
 * @description React Email template rendered to HTML for inbound volunteer
 * application notifications. Replying to the email goes to the applicant.
 * @param {VolunteerSubmissionEmailProps} props - The template props
 * @returns The email markup
 */
export function VolunteerSubmissionEmail({
  name,
  email,
  phone,
  area,
  availability,
  experience,
  locale,
  submittedAt,
}: VolunteerSubmissionEmailProps) {
  // Resolve copy for the active locale
  const copy = emailCopy[locale]
  const localizedArea = areaLabel[locale][area]

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{copy.preview(name)}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{copy.heading}</Heading>
          <Text style={textStyle}>{copy.intro}</Text>

          <Section style={detailsStyle}>
            <Row label={copy.nameLabel} value={name} />
            <Row label={copy.emailLabel} value={<Link href={`mailto:${email}`}>{email}</Link>} />
            <Row label={copy.phoneLabel} value={<Link href={`tel:${phone}`}>{phone}</Link>} />
            <Row label={copy.areaLabel} value={localizedArea} />
            <Row
              label={copy.submittedAtLabel}
              value={submittedAt.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'}
            />
          </Section>

          <Hr style={hrStyle} />

          <Text style={blockLabelStyle}>{copy.availabilityLabel}</Text>
          <Text style={blockBodyStyle}>{availability}</Text>

          <Text style={blockLabelStyle}>{copy.experienceLabel}</Text>
          <Text style={blockBodyStyle}>{experience.trim() || copy.noExperience}</Text>

          <Hr style={hrStyle} />
          <Text style={hintStyle}>{copy.replyHint}</Text>
          <Text style={footerStyle}>{copy.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

/**
 * The {@link Row} component
 * @description Single label/value row rendered inside the details block
 */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Text style={rowStyle}>
      <strong style={rowLabelStyle}>{label}: </strong>
      <span>{value}</span>
    </Text>
  )
}

// Inline styles — required because email clients ignore <style> in most cases
const bodyStyle = {
  backgroundColor: '#f5f5f4',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
  margin: 0,
  padding: '32px 0',
}

const containerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
}

const headingStyle = {
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: 600,
  margin: '0 0 12px',
}

const textStyle = {
  color: '#334155',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 16px',
}

const detailsStyle = {
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
  padding: '16px 20px',
}

const rowStyle = {
  color: '#0f172a',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 6px',
}

const rowLabelStyle = {
  color: '#475569',
}

const hrStyle = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '24px 0',
}

const blockLabelStyle = {
  color: '#475569',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  margin: '16px 0 8px',
  textTransform: 'uppercase' as const,
}

const blockBodyStyle = {
  color: '#0f172a',
  fontSize: '15px',
  lineHeight: '24px',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
}

const hintStyle = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 8px',
}

const footerStyle = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: 0,
}

export default VolunteerSubmissionEmail
