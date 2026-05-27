import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import './globals.css'

/**
 * The {@link inter} font instance
 * @description Inter font with the latin subset, applied to the document body
 */
const inter = Inter({ subsets: ['latin'] })

/**
 * The {@link SITE_URL} constant
 * @description Canonical production URL used to resolve absolute metadata URLs
 */
const SITE_URL = 'https://ongdimipabos.org'

/**
 * The {@link SITE_NAME} constant
 * @description Public site name used in social share cards
 */
const SITE_NAME = 'DI MI PA BÔS'

/**
 * The {@link SITE_TITLE} constant
 * @description Default browser tab and social card title
 */
const SITE_TITLE = 'DI MI PA BÔS - Transformando vidas na Guiné-Bissau'

/**
 * The {@link SITE_DESCRIPTION} constant
 * @description Default meta description and social card subtitle
 */
const SITE_DESCRIPTION =
  'ONG dedicada a transformar vidas através de habitação, cuidado e serviços essenciais na Guiné-Bissau'

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
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
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
  // Render the full document shell
  return (
    <html lang={HTML_LANG}>
      <body className={inter.className}>
        <Header />
        <main className='overflow-hidden'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
