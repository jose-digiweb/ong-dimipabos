import { useTranslations } from 'next-intl'
import Image from 'next/image'

import cesaltinaImage from '@/assets/team/cesaltina.webp'
import { Card, CardContent } from '@/components/ui/card'

import { SectionDescription } from './section/SectionDescription'
import { SectionTitle } from './section/SectionTitle'

/**
 * The {@link teamMembers} constant
 * @description Team members rendered in the team grid. The `key` references a
 * translation entry under `team.members.<key>` for role and description.
 */
const teamMembers = [
  {
    key: 'cesaltina',
    name: 'Cesaltina Pereira',
    image: cesaltinaImage,
  },
] as const

/**
 * The {@link TeamSection} component
 * @description Renders the team grid with photo, name, role and bio for each member
 * @returns The rendered team section
 */
export function TeamSection() {
  // Read the locale-aware team translations
  const t = useTranslations('team')

  // Render the centred section title plus the team cards
  return (
    <section className='bg-slate-50 py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <SectionTitle>{t('sectionTitle')}</SectionTitle>
          <SectionDescription>{t('sectionDescription')}</SectionDescription>
        </div>

        <div className='mt-16 flex flex-wrap justify-center gap-8'>
          {teamMembers.map((member) => (
            <Card key={member.key} className='w-full max-w-sm'>
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
                  {t(`members.${member.key}.role`)}
                </p>
                <p className='mt-4 text-pretty text-muted-foreground text-sm leading-relaxed'>
                  {t(`members.${member.key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
