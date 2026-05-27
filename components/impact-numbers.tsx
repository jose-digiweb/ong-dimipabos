/**
 * The {@link impactNumbersStats} constant
 * @description Headline metrics displayed in the homepage impact band
 */
const impactNumbersStats = [
  { number: '10%', label: 'Da Construção Concluída' },
  { number: '5', label: 'Voluntários Ativos' },
  { number: '2021', label: 'Ano de Fundação' },
  { number: '3', label: 'Anos de História' },
] as const

/**
 * The {@link ImpactNumbers} component
 * @description Renders the dark primary band with the headline impact metrics
 * @returns The rendered impact numbers section
 */
export function ImpactNumbers() {
  // Render the four-column metrics band
  return (
    <section className='bg-primary py-16 text-primary-foreground'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4'>
          {impactNumbersStats.map((stat) => (
            <div key={stat.label} className='flex flex-col items-center text-primary-foreground'>
              <div className='font-bold text-4xl'>{stat.number}</div>
              <div className='mt-2 text-lg'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
