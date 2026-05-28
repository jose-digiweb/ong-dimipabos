import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/seo/constants'
import { buildOrganizationSchema, buildWebsiteSchema } from '@/lib/seo/jsonLd'

import './globals.css'

/**
 * The {@link inter} font instance
 * @description Inter font with the latin subset, applied to the document body
 */
const inter = Inter({ subsets: ['latin'], display: 'swap' })

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
    locale: SITE_LOCALE,
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
 * The {@link HTML_LANG} constant
 * @description Document language used by the root layout
 */
const HTML_LANG = 'pt'

/**
 * The {@link RootLayoutProps} type
 * @description Props for the {@link RootLayout} component
 */
type RootLayoutProps = {
  children: ReactNode
}

/**
 * The {@link RootLayout} component
 * @description Root document layout that wires up fonts, header and footer
 * @param {RootLayoutProps} props - The component props
 * @param {ReactNode} props.children - The page content to render between header and footer
 * @returns The rendered HTML document
 */
export default function RootLayout({ children }: RootLayoutProps) {
  // Build site-wide JSON-LD nodes once per render
  const jsonLdData = [buildOrganizationSchema(), buildWebsiteSchema()]

  // Render the full document shell
  return (
    <html lang={HTML_LANG}>
      <body className={inter.className}>
        <JsonLd data={jsonLdData} />
        <Header />
        <main className='overflow-hidden'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
