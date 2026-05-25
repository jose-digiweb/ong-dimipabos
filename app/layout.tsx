import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'DI MI PA BÔS - Transformando vidas na Guiné-Bissau',
	description:
		'ONG dedicada a transformar vidas através de habitação, cuidado e serviços essenciais na Guiné-Bissau',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='pt'>
			<body className={inter.className}>
				<Header />
				<main className='overflow-hidden'>{children}</main>
				<Footer />
			</body>
		</html>
	)
}
