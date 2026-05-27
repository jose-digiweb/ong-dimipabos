import { Heart, Home, Users } from 'lucide-react'

import { IconWrapper } from './IconWrapper'

/**
 * The {@link HomeIcons} component
 * @description Hero card icon trio for the home page variant
 * @returns The rendered icon trio
 */
export const HomeIcons = () => {
  // Render three colour-tinted icons representing home, heart and community
  return (
    <div className='mt-6 flex gap-4'>
      <IconWrapper className='bg-primary/10'>
        <Home className='size-6 text-primary' />
      </IconWrapper>
      <IconWrapper className='bg-secondary/10'>
        <Heart className='size-6 text-secondary' />
      </IconWrapper>
      <IconWrapper className='bg-accent/10'>
        <Users className='size-6 text-accent-foreground' />
      </IconWrapper>
    </div>
  )
}
