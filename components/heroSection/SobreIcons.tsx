import { Eye, HandshakeIcon, Heart } from 'lucide-react'

import { IconWrapper } from './IconWrapper'

/**
 * The {@link SobreIcons} component
 * @description Hero card icon trio for the "sobre" (about) page variant
 * @returns The rendered icon trio
 */
export const SobreIcons = () => {
  // Render three colour-tinted icons representing heart, partnership and vision
  return (
    <div className='mt-6 flex gap-4'>
      <IconWrapper className='bg-primary/10'>
        <Heart className='size-6 text-primary' />
      </IconWrapper>
      <IconWrapper className='bg-secondary/10'>
        <HandshakeIcon className='size-6 text-secondary' />
      </IconWrapper>
      <IconWrapper className='bg-accent/10'>
        <Eye className='size-6 text-accent-foreground' />
      </IconWrapper>
    </div>
  )
}
