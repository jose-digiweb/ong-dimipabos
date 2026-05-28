import {
  ArrowRight,
  Facebook,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from 'lucide-react'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'

import { ContactForm } from '@/components/contact-form'
import { CTASection } from '@/components/cta'
import {
  HeroCardSection,
  HeroDescription,
  HeroTitle,
  HeroTopText,
  HeroWrapper,
} from '@/components/heroSection'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SectionDescription, SectionTitle } from '@/components/section'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema, buildContactPageSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link metadata} constant
 * @description Per-route SEO metadata for the contact page
 */
export const metadata: Metadata = buildMetadata({
  title: 'Contacto',
  description:
    'Entre em contacto com a ONG DI MI PA BÔS para saber mais sobre os nossos projetos ou colaborar com a missão.',
  path: '/contato',
})

/**
 * The {@link contactCopy} constant
 * @description Static Portuguese copy used by the contact page
 */
const contactCopy = {
  HERO_TOP: 'Fale Conosco',
  HERO_TITLE_PREFIX: 'Entre em Contato',
  HERO_TITLE_HIGHLIGHT: 'Conosco',
  HERO_DESCRIPTION:
    'Estamos aqui para ajudar. Nossa equipe está pronta para responder suas dúvidas e ouvir suas sugestões.',
  CTA_MESSAGE: 'Enviar Mensagem',
  CTA_WHATSAPP: 'WhatsApp',
  HERO_EMAIL_LABEL: 'Email',
  HERO_PHONE_LABEL: 'Telefone',
  HERO_ADDRESS_LABEL: 'Endereço',
  HERO_ADDRESS_VALUE: 'Bissau, Guiné-Bissau',
  FORM_TITLE: 'Envie uma Mensagem',
  FORM_DESCRIPTION:
    'Preencha o formulário abaixo para entrar em contato conosco. Responderemos o mais breve possível.',
  OTHER_TITLE: 'Outras Formas de Contato',
  EMAIL_TITLE: 'E-mail',
  PHONE_TITLE: 'Telefone',
  ADDRESS_TITLE: 'Endereço',
  ADDRESS_VALUE: 'Guiné-Bissau',
  SOCIAL_TITLE: 'Redes Sociais',
  ARIA_FACEBOOK: 'Facebook',
  ARIA_WHATSAPP: 'WhatsApp',
} as const

/**
 * The {@link contactDetails} constant
 * @description Shared contact information values
 */
const contactDetails = {
  EMAIL: 'contato@dimipabos.org',
  PHONE: '+31 631 791 165',
} as const

/**
 * The {@link contactLink} constant
 * @description External and internal links surfaced from the contact page
 */
const contactLink = {
  MESSAGE_ANCHOR: '/contato#enviar-mensagem',
  WHATSAPP: 'https://wa.me/31631791165',
  FACEBOOK: 'https://www.facebook.com/profile.php?id=100090763747200',
} as const

/**
 * The {@link HeroContactItem} type
 * @description Shape of an entry in {@link heroContactItems}
 */
type HeroContactItem = {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  label: string
  value: string
}

/**
 * The {@link heroContactItems} constant
 * @description Quick contact items rendered in the hero card
 */
const heroContactItems = [
  {
    icon: Mail,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    label: contactCopy.HERO_EMAIL_LABEL,
    value: contactDetails.EMAIL,
  },
  {
    icon: Phone,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    label: contactCopy.HERO_PHONE_LABEL,
    value: contactDetails.PHONE,
  },
  {
    icon: MapPin,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent-foreground',
    label: contactCopy.HERO_ADDRESS_LABEL,
    value: contactCopy.HERO_ADDRESS_VALUE,
  },
] as const satisfies readonly HeroContactItem[]

/**
 * The {@link OtherContactItem} type
 * @description Shape of an entry in {@link otherContactItems}
 */
type OtherContactItem = {
  icon: LucideIcon
  iconClassName: string
  title: string
  value: string
}

/**
 * The {@link otherContactItems} constant
 * @description Detailed contact cards rendered in the "other forms" section
 */
const otherContactItems = [
  {
    icon: Mail,
    iconClassName: 'size text-secondary',
    title: contactCopy.EMAIL_TITLE,
    value: contactDetails.EMAIL,
  },
  {
    icon: Phone,
    iconClassName: 'size text-secondary',
    title: contactCopy.PHONE_TITLE,
    value: contactDetails.PHONE,
  },
  {
    icon: MapPin,
    iconClassName: 'size-6 text-secondary',
    title: contactCopy.ADDRESS_TITLE,
    value: contactCopy.ADDRESS_VALUE,
  },
] as const satisfies readonly OtherContactItem[]

/**
 * The {@link ContactPage} component
 * @description Renders the public contact page
 * @returns The rendered contact page
 */
export default function ContactPage() {
  // Build the breadcrumb + ContactPage schemas for this route
  const jsonLdData = [
    buildBreadcrumbSchema([
      { name: 'Início', path: '/' },
      { name: 'Contacto', path: '/contato' },
    ]),
    buildContactPageSchema({
      name: 'Contacto',
      description:
        'Entre em contacto com a ONG DI MI PA BÔS para saber mais sobre os nossos projetos ou colaborar com a missão.',
      path: '/contato',
    }),
  ]

  // Render the full contact page layout
  return (
    <div className='flex min-h-screen flex-col'>
      <JsonLd data={jsonLdData} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{contactCopy.HERO_TOP}</HeroTopText>

          <HeroTitle>
            {contactCopy.HERO_TITLE_PREFIX}{' '}
            <span className='relative whitespace-nowrap'>
              <span className='relative text-primary'>{contactCopy.HERO_TITLE_HIGHLIGHT}</span>
            </span>
          </HeroTitle>

          <HeroDescription>{contactCopy.HERO_DESCRIPTION}</HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <Button
              render={<Link href={contactLink.MESSAGE_ANCHOR} />}
              nativeButton={false}
              size='lg'
              variant='CTA'
            >
              {contactCopy.CTA_MESSAGE}
              <ArrowRight className='ml-2 size-4' />
            </Button>

            <Button
              render={
                <a
                  aria-label={contactCopy.ARIA_WHATSAPP}
                  target='_blank'
                  rel='noopener noreferrer'
                  href={contactLink.WHATSAPP}
                  className='hover:text-secondary'
                />
              }
              nativeButton={false}
              size='lg'
              variant='outline'
            >
              {contactCopy.CTA_WHATSAPP}
            </Button>
          </div>
        </div>

        <HeroCardSection>
          <div className='relative rounded-2xl bg-white p-8 shadow-2xl'>
            <div className='grid gap-6'>
              {heroContactItems.map((item) => {
                // Resolve the item icon component
                const Icon = item.icon

                // Render the hero contact entry
                return (
                  <div key={item.label} className='flex items-center gap-4'>
                    <div
                      className={`flex size-12 items-center justify-center rounded-full ${item.iconBg}`}
                    >
                      <Icon className={`size-6 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className='font-medium'>{item.label}</p>
                      <p className='text-muted-foreground text-sm'>{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </HeroCardSection>
      </HeroWrapper>

      <section id='enviar-mensagem' className='scroll-mt-8 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-12 lg:grid-cols-2'>
            <div>
              <SectionTitle>{contactCopy.FORM_TITLE}</SectionTitle>

              <SectionDescription className='mx-0'>
                {contactCopy.FORM_DESCRIPTION}
              </SectionDescription>

              <div className='mt-8'>
                <ContactForm />
              </div>
            </div>

            <div>
              <h2 className='font-bold text-2xl text-foreground tracking-tight'>
                {contactCopy.OTHER_TITLE}
              </h2>
              <div className='mt-8 space-y-8'>
                {otherContactItems.map((item) => {
                  // Resolve the item icon component
                  const Icon = item.icon

                  // Render the detailed contact card
                  return (
                    <Card key={item.title}>
                      <CardContent className='flex items-start gap-4 p-6'>
                        <Icon className={item.iconClassName} />
                        <div>
                          <h3 className='font-semibold'>{item.title}</h3>
                          <p className='mt-1 text-muted-foreground'>{item.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                <div className='space-y-4'>
                  <h3 className='font-semibold'>{contactCopy.SOCIAL_TITLE}</h3>
                  <div className='flex gap-4'>
                    <Button
                      render={
                        <a
                          aria-label={contactCopy.ARIA_FACEBOOK}
                          target='_blank'
                          rel='noopener noreferrer'
                          href={contactLink.FACEBOOK}
                          className='hover:text-secondary'
                        />
                      }
                      nativeButton={false}
                      variant='outline'
                      size='icon'
                    >
                      <Facebook className='size-6' />
                      <span className='sr-only'>{contactCopy.ARIA_FACEBOOK}</span>
                    </Button>
                    <Button
                      render={
                        <a
                          aria-label={contactCopy.ARIA_WHATSAPP}
                          target='_blank'
                          rel='noopener noreferrer'
                          href={contactLink.WHATSAPP}
                          className='hover:text-secondary'
                        />
                      }
                      nativeButton={false}
                      variant='outline'
                      size='icon'
                    >
                      <MessageCircle className='size-6' />
                      <span className='sr-only'>{contactCopy.ARIA_WHATSAPP}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection className='border-b' />
    </div>
  )
}
