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
 * The {@link metadata} constant
 * @description Default site metadata applied to every route
 */
export const metadata: Metadata = {
  title: 'DI MI PA BÔS - Transformando vidas na Guiné-Bissau',
  description:
    'ONG dedicada a transformar vidas através de habitação, cuidado e serviços essenciais na Guiné-Bissau',
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
