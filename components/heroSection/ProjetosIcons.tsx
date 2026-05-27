import { GraduationCap, Hammer, HeartHandshake } from 'lucide-react'

import { IconWrapper } from './IconWrapper'

/**
 * The {@link ProjetosIcons} component
 * @description Hero card icon trio for the projects page variant
 * @returns The rendered icon trio
 */
export const ProjetosIcons = () => {
  // Render three colour-tinted icons representing construction, partnership and education
  return (
    <div className='mt-6 flex gap-4'>
      <IconWrapper className='bg-primary/10'>
        <Hammer className='size-6 text-primary' />
      </IconWrapper>
      <IconWrapper className='bg-secondary/10'>
        <HeartHandshake className='size-6 text-secondary' />
      </IconWrapper>
      <IconWrapper className='bg-accent/10'>
        <GraduationCap className='size-6 text-accent-foreground' />
      </IconWrapper>
    </div>
  )
}
