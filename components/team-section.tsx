import Image from 'next/image'

import cesaltinaImage from '@/assets/team/cesaltina.jpeg'
import { Card, CardContent } from '@/components/ui/card'

import { SectionDescription } from './section/SectionDescription'
import { SectionTitle } from './section/SectionTitle'

/**
 * The {@link teamSectionCopy} constant
 * @description Static Portuguese copy for the team section header
 */
const teamSectionCopy = {
  SECTION_TITLE: 'Nossa Equipe',
  SECTION_DESCRIPTION:
    'Conheça as pessoas dedicadas que trabalham para tornar o centro de tratamento uma realidade.',
} as const

/**
 * The {@link teamMembers} constant
 * @description Team members rendered in the team grid
 */
const teamMembers = [
  {
    name: 'Cesaltina Pereira',
    role: 'Coordenadora Geral',
    description: 'Apaixonada por ajudar pessoas em situação de vulnerabilidade.',
    image: cesaltinaImage,
  },
] as const

/**
 * The {@link TeamSection} component
 * @description Renders the team grid with photo, name, role and bio for each member
 * @returns The rendered team section
 */
export function TeamSection() {
  // Render the centred section title plus the team cards
  return (
    <section className='bg-slate-50 py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <SectionTitle>{teamSectionCopy.SECTION_TITLE}</SectionTitle>
          <SectionDescription>{teamSectionCopy.SECTION_DESCRIPTION}</SectionDescription>
        </div>

        <div className='mt-16 flex flex-wrap justify-center gap-8'>
          {teamMembers.map((member) => (
            <Card key={member.name} className='w-full max-w-sm'>
              <CardContent className='flex flex-col items-center px-6 py-8 text-center'>
                <div className='relative mb-6 size-36 overflow-hidden rounded-full ring-4 ring-primary/10'>
                  <Image
                    fill
                    src={member.image}
                    alt={member.name}
                    sizes='144px'
                    className='object-cover'
                  />
                </div>

                <h3 className='font-bold text-foreground text-xl'>{member.name}</h3>
                <p className='mt-1 font-medium text-primary text-sm uppercase tracking-wide'>
                  {member.role}
                </p>
                <p className='mt-4 text-pretty text-muted-foreground text-sm leading-relaxed'>
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
