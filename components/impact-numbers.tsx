const stats = [
	{
		number: '10%',
		label: 'Da Construção Concluída',
	},
	{
		number: '5',
		label: 'Voluntários Ativos',
	},
	{
		number: '2021',
		label: 'Ano de Fundação',
	},
	{
		number: '3',
		label: 'Anos de História',
	},
]

export function ImpactNumbers() {
	return (
		<section className='bg-primary py-16 text-primary-foreground'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4'>
					{stats.map((stat, index) => (
						<div key={index} className='flex flex-col items-center text-primary-foreground'>
							<div className='font-bold text-4xl'>{stat.number}</div>
							<div className='mt-2 text-lg'>{stat.label}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
