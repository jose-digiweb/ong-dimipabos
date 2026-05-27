import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { SectionDescription } from './ui/section/SectionDescription'
import { SectionTitle } from './ui/section/SectionTitle'

/**
 * The {@link impactStatsCopy} constant
 * @description Static Portuguese copy for the impact stats section
 */
const impactStatsCopy = {
  SECTION_TITLE: 'Números que Inspiram',
  SECTION_DESCRIPTION: 'O impacto real de nossas ações na Guiné-Bissau.',
} as const

/**
 * The {@link impactStatsItems} constant
 * @description Cards rendered in the impact stats grid
 */
const impactStatsItems = [
  { title: 'Pessoas Atendidas', value: '200+', description: 'Desde nossa fundação' },
  { title: 'Casas Construídas', value: '7', description: 'Disponíveis para habitação' },
  { title: 'Voluntários Ativos', value: '100', description: 'Fazendo a diferença' },
] as const

/**
 * The {@link ImpactStats} component
 * @description Renders the cards grid that highlights our impact metrics
 * @returns The rendered impact stats section
 */
export function ImpactStats() {
  // Render the centred title plus the three impact cards
  return (
    <section className='pt-10 pb-16 sm:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <SectionTitle>{impactStatsCopy.SECTION_TITLE}</SectionTitle>
          <SectionDescription>{impactStatsCopy.SECTION_DESCRIPTION}</SectionDescription>
        </div>

        <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {impactStatsItems.map((stat) => (
            <Card key={stat.title} className='bg-accent text-accent-foreground'>
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
