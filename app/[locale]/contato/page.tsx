import {
  ArrowRight,
  Facebook,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ContactForm } from '@/components/contact-form'
import { CTASection } from '@/components/cta'
import {
  HeroCardSection,
  HeroDescription,
  HeroTitle,
  HeroTopText,
  HeroWrapper,
} from '@/components/heroSection'
import { SectionDescription, SectionTitle } from '@/components/section'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { buildBreadcrumbSchema, buildContactPageSchema } from '@/lib/seo/jsonLd'
import { buildMetadata } from '@/lib/seo/metadata'

/**
 * The {@link ContactRouteProps} type
 * @description Route props for the contact page
 */
type ContactRouteProps = {
  params: Promise<{ locale: string }>
}

/**
 * The {@link generateMetadata} export
 * @description Locale-aware SEO metadata for the contact page
 * @param {ContactRouteProps} props - The route props
 * @returns {Promise<Metadata>} The metadata for the active locale
 */
export async function generateMetadata({ params }: ContactRouteProps): Promise<Metadata> {
  // Resolve the locale and read the SEO copy from the contact namespace
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  // Build the metadata with the localised title and description
  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/contato',
  })
}

/**
 * The {@link contactDetails} constant
 * @description Shared, locale-independent contact information values
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
 * The {@link HeroContactEntry} type
 * @description Shape of an entry in the hero contact list
 */
type HeroContactEntry = {
  key: 'email' | 'phone' | 'address'
  icon: LucideIcon
  iconBg: string
  iconColor: string
  value: string
}

/**
 * The {@link OtherContactEntry} type
 * @description Shape of an entry in the "other contact" list
 */
type OtherContactEntry = {
  key: 'email' | 'phone' | 'address'
  icon: LucideIcon
  iconClassName: string
  value: string
}

/**
 * The {@link ContactPage} component
 * @description Renders the public contact page in the active locale
 * @param {ContactRouteProps} props - The route props
 * @returns The rendered contact page
 */
export default async function ContactPage({ params }: ContactRouteProps) {
  // Opt this route into static rendering for the active locale
  const { locale } = await params
  setRequestLocale(locale)

  // Read the locale-aware contact translations
  const t = await getTranslations('contact')

  // Build the locale-independent hero contact entries (values + presentation)
  const heroContactEntries = [
    {
      key: 'email',
      icon: Mail,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      value: contactDetails.EMAIL,
    },
    {
      key: 'phone',
      icon: Phone,
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
      value: contactDetails.PHONE,
    },
    {
      key: 'address',
      icon: MapPin,
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent-foreground',
      value: t('heroAddressValue'),
    },
  ] as const satisfies readonly HeroContactEntry[]

  // Build the locale-independent "other contact" entries
  const otherContactEntries = [
    {
      key: 'email',
      icon: Mail,
      iconClassName: 'size text-secondary',
      value: contactDetails.EMAIL,
    },
    {
      key: 'phone',
      icon: Phone,
      iconClassName: 'size text-secondary',
      value: contactDetails.PHONE,
    },
    {
      key: 'address',
      icon: MapPin,
      iconClassName: 'size-6 text-secondary',
      value: t('addressValue'),
    },
  ] as const satisfies readonly OtherContactEntry[]

  // Resolve the labels keyed by hero entry key
  const heroLabels = {
    email: t('heroEmailLabel'),
    phone: t('heroPhoneLabel'),
    address: t('heroAddressLabel'),
  } as const

  // Resolve the titles keyed by other-contact entry key
  const otherTitles = {
    email: t('emailTitle'),
    phone: t('phoneTitle'),
    address: t('addressTitle'),
  } as const

  // Build the breadcrumb + ContactPage schemas for this route
  const jsonLdData = [
    buildBreadcrumbSchema([
      { name: t('breadcrumbHome'), path: '/' },
      { name: t('breadcrumbContact'), path: '/contato' },
    ]),
    buildContactPageSchema({
      name: t('breadcrumbContact'),
      description: t('metaDescription'),
      path: '/contato',
    }),
  ]

  // Render the full contact page layout
  return (
    <div className='flex min-h-screen flex-col'>
      <JsonLd data={jsonLdData} />
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>{t('heroTop')}</HeroTopText>

          <HeroTitle>
            {t('heroTitlePrefix')}{' '}
            <span className='relative whitespace-nowrap'>
              <span className='relative text-primary'>{t('heroTitleHighlight')}</span>
            </span>
          </HeroTitle>

          <HeroDescription>{t('heroDescription')}</HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <Button
              render={<Link href={contactLink.MESSAGE_ANCHOR} />}
              nativeButton={false}
              size='lg'
              variant='CTA'
            >
              {t('ctaMessage')}
              <ArrowRight className='ml-2 size-4' />
            </Button>

            <Button
              render={
                <a
                  aria-label={t('ariaWhatsapp')}
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
              {t('ctaWhatsapp')}
            </Button>
          </div>
        </div>

        <HeroCardSection>
          <div className='relative rounded-2xl bg-white p-8 shadow-2xl'>
            <div className='grid gap-6'>
              {heroContactEntries.map((entry) => {
                // Resolve the entry icon component
                const Icon = entry.icon

                // Render the hero contact entry
                return (
                  <div key={entry.key} className='flex items-center gap-4'>
                    <div
                      className={`flex size-12 items-center justify-center rounded-full ${entry.iconBg}`}
                    >
                      <Icon className={`size-6 ${entry.iconColor}`} />
                    </div>
                    <div>
                      <p className='font-medium'>{heroLabels[entry.key]}</p>
                      <p className='text-muted-foreground text-sm'>{entry.value}</p>
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
              <SectionTitle>{t('formTitle')}</SectionTitle>

              <SectionDescription className='mx-0'>
                {t('formDescription')}
              </SectionDescription>

              <div className='mt-8'>
                <ContactForm />
              </div>
            </div>

            <div>
              <h2 className='font-bold text-2xl text-foreground tracking-tight'>
                {t('otherTitle')}
              </h2>
              <div className='mt-8 space-y-8'>
                {otherContactEntries.map((entry) => {
                  // Resolve the entry icon component
                  const Icon = entry.icon

                  // Render the detailed contact card
                  return (
                    <Card key={entry.key}>
                      <CardContent className='flex items-start gap-4 p-6'>
                        <Icon className={entry.iconClassName} />
                        <div>
                          <h3 className='font-semibold'>{otherTitles[entry.key]}</h3>
                          <p className='mt-1 text-muted-foreground'>{entry.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                <div className='space-y-4'>
                  <h3 className='font-semibold'>{t('socialTitle')}</h3>
                  <div className='flex gap-4'>
                    <Button
                      render={
                        <a
                          aria-label={t('ariaFacebook')}
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
                      <span className='sr-only'>{t('ariaFacebook')}</span>
                    </Button>
                    <Button
                      render={
                        <a
                          aria-label={t('ariaWhatsapp')}
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
                      <span className='sr-only'>{t('ariaWhatsapp')}</span>
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
