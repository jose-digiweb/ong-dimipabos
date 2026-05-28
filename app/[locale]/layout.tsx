import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PostHogProvider } from '@/components/analytics/PostHogProvider'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Locale } from '@/i18n/config'
import { localeOgCodes } from '@/i18n/config'
import { routing } from '@/i18n/routing'
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/seo/constants'
import { buildOrganizationSchema, buildWebsiteSchema } from '@/lib/seo/jsonLd'

import '../globals.css'

/**
 * The {@link inter} font instance
 * @description Inter font with the latin subset, applied to the document body
 */
const inter = Inter({ subsets: ['latin'], display: 'swap' })

/**
 * The {@link generateStaticParams} function
 * @description Pre-renders one branch per supported locale
 */
export function generateStaticParams() {
  // Return one params object per supported locale
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * The {@link metadata} constant
 * @description Default site metadata applied to every route, including Open Graph and Twitter cards
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: localeOgCodes.pt,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

/**
 * The {@link LocaleLayoutProps} type
 * @description Props for the {@link LocaleLayout} root layout
 */
type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

/**
 * The {@link LocaleLayout} component
 * @description Root document layout. Validates the URL locale, enables static
 * rendering via {@link setRequestLocale}, and wires the next-intl provider.
 * @param {LocaleLayoutProps} props - The component props
 * @param {ReactNode} props.children - The page content to render between header and footer
 * @param {Promise} props.params - The route params containing the active locale
 * @returns The rendered HTML document
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Validate the URL segment against the supported locale set
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Opt the route tree into static rendering for the active locale
  setRequestLocale(locale)

  // Build site-wide JSON-LD nodes once per render
  const jsonLdData = [buildOrganizationSchema(), buildWebsiteSchema()]

  // Render the full document shell
  return (
    <html lang={locale satisfies Locale}>
      <body className={inter.className}>
        <JsonLd data={jsonLdData} />
        <PostHogProvider>
          <NextIntlClientProvider>
            <Header />
            <main className='overflow-hidden'>{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
