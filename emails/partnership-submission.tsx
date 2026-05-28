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

/**
 * The {@link PartnershipSubmissionEmailProps} type
 * @description Props consumed by {@link PartnershipSubmissionEmail}
 */
export type PartnershipSubmissionEmailProps = {
  companyName: string
  contactName: string
  email: string
  phone: string
  message: string
  locale: Locale
  submittedAt: Date
}

/**
 * The {@link emailCopy} constant
 * @description Localized labels rendered in the notification email
 */
const emailCopy = {
  pt: {
    preview: (company: string) => `Nova proposta de parceria — ${company}`,
    heading: 'Nova proposta de parceria',
    intro: 'Foi recebida uma nova proposta de parceria através do site DI MI PA BÔS.',
    companyLabel: 'Empresa',
    contactLabel: 'Contato',
    emailLabel: 'Email',
    phoneLabel: 'Telefone',
    messageLabel: 'Mensagem',
    submittedAtLabel: 'Recebida em',
    replyHint: 'Responder a este email envia uma resposta diretamente para o contato.',
    footer: 'DI MI PA BÔS · ongdimipabos.org',
  },
  en: {
    preview: (company: string) => `New partnership inquiry — ${company}`,
    heading: 'New partnership inquiry',
    intro: 'A new partnership inquiry was received through the DI MI PA BÔS website.',
    companyLabel: 'Company',
    contactLabel: 'Contact',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    messageLabel: 'Message',
    submittedAtLabel: 'Received at',
    replyHint: 'Replying to this email sends a response directly to the contact.',
    footer: 'DI MI PA BÔS · ongdimipabos.org',
  },
} as const

/**
 * The {@link PartnershipSubmissionEmail} component
 * @description React Email template rendered to HTML for inbound partnership
 * inquiry notifications. Replying to the email goes to the contact via reply-to.
 * @param {PartnershipSubmissionEmailProps} props - The template props
 * @returns The email markup
 */
export function PartnershipSubmissionEmail({
  companyName,
  contactName,
  email,
  phone,
  message,
  locale,
  submittedAt,
}: PartnershipSubmissionEmailProps) {
  // Resolve copy for the active locale
  const copy = emailCopy[locale]

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{copy.preview(companyName)}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{copy.heading}</Heading>
          <Text style={textStyle}>{copy.intro}</Text>

          <Section style={detailsStyle}>
            <Row label={copy.companyLabel} value={companyName} />
            <Row label={copy.contactLabel} value={contactName} />
            <Row label={copy.emailLabel} value={<Link href={`mailto:${email}`}>{email}</Link>} />
            <Row label={copy.phoneLabel} value={<Link href={`tel:${phone}`}>{phone}</Link>} />
            <Row
              label={copy.submittedAtLabel}
              value={submittedAt.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'}
            />
          </Section>

          <Hr style={hrStyle} />

          <Text style={messageLabelStyle}>{copy.messageLabel}</Text>
          <Text style={messageBodyStyle}>{message}</Text>

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

const messageLabelStyle = {
  color: '#475569',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
}

const messageBodyStyle = {
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

export default PartnershipSubmissionEmail
