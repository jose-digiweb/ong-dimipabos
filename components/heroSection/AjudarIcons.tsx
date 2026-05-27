import { Building, UserPlus, Wallet } from 'lucide-react'

import { IconWrapper } from './IconWrapper'

/**
 * The {@link AjudarIcons} component
 * @description Hero card icon trio for the "como ajudar" (how to help) page variant
 * @returns The rendered icon trio
 */
export const AjudarIcons = () => {
  // Render three colour-tinted icons representing donations, volunteers and partnerships
  return (
    <div className='mt-6 flex gap-4'>
      <IconWrapper className='bg-primary/10'>
        <Wallet className='size-6 text-primary' />
      </IconWrapper>
      <IconWrapper className='bg-secondary/10'>
        <UserPlus className='size-6 text-secondary' />
      </IconWrapper>
      <IconWrapper className='bg-accent/10'>
        <Building className='size-6 text-accent-foreground' />
      </IconWrapper>
    </div>
  )
}
