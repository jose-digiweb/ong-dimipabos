import { Handshake, Mail, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import { ctaRoute } from './cta/constants'
import { SectionDescription, SectionTitle } from './section'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

/**
 * The {@link supportOptions} constant
 * @description The three support routes that are open while bank donations are held,
 * paired with the translation key prefix that carries each card's copy
 */
const supportOptions = [
  { key: 'volunteer', href: ctaRoute.VOLUNTEER, Icon: Users },
  { key: 'partner', href: ctaRoute.PARTNER, Icon: Handshake },
  { key: 'contact', href: ctaRoute.CONTACT, Icon: Mail },
] as const

/**
 * The {@link SupportOptionsSection} component
 * @description Renders the bank-donation status note plus the support routes that
 * remain available while the organisation's bank account is being confirmed
 * @returns The rendered support options section
 */
export const SupportOptionsSection = () => {
  // Read the locale-aware support options translations
  const t = useTranslations('supportOptions')

  // Render the status note followed by the three support cards
  return (
    <section className='py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl rounded-lg border border-border bg-muted/40 px-6 py-5 text-center'>
          <p className='font-semibold text-foreground text-lg'>{t('statusTitle')}</p>
        </div>

        <div className='mt-16 text-center'>
          <SectionTitle>{t('sectionTitle')}</SectionTitle>
          <SectionDescription>{t('sectionDescription')}</SectionDescription>
        </div>

        <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {supportOptions.map(({ key, href, Icon }) => (
            <Card key={key} className='flex flex-col'>
              <CardHeader>
                <Icon className='size-8 text-primary' />
                <CardTitle className='mt-4'>{t(`${key}Title`)}</CardTitle>
                <CardDescription className='mt-2 text-pretty'>{t(`${key}Body`)}</CardDescription>
              </CardHeader>

              <CardContent className='flex-1' />

              <CardFooter>
                <Button render={<Link href={href} />} nativeButton={false} variant='outline'>
                  {t(`${key}Cta`)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
