import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionDescription } from './ui/section/SectionDescription'
import { SectionTitle } from './ui/section/SectionTitle'

const stats = [
	{
		title: 'Pessoas Atendidas',
		value: '200+',
		description: 'Desde nossa fundação',
	},
	{
		title: 'Casas Construídas',
		value: '7',
		description: 'Disponíveis para habitação',
	},
	{
		title: 'Voluntários Ativos',
		value: '100',
		description: 'Fazendo a diferença',
	},
]

export function ImpactStats() {
	return (
		<section className='pt-10 pb-16 sm:py-16'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='text-center'>
					<SectionTitle>Números que Inspiram</SectionTitle>
					<SectionDescription>O impacto real de nossas ações na Guiné-Bissau.</SectionDescription>
				</div>

				<div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
					{stats.map((stat, index) => (
						<Card key={index} className='bg-accent text-accent-foreground'>
							<CardHeader>
								<CardTitle>{stat.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='font-bold text-4xl text-primary'>{stat.value}</p>
								<p className='mt-2 text-accent-foreground/80 text-sm'>{stat.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
