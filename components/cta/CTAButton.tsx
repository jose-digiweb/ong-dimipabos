import { HeartHandshake } from 'lucide-react'
import { Link } from '@/i18n/navigation'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { ctaCopy, ctaRoute } from './constants'
import type { CTAButtonProps } from './types'

/**
 * The {@link CTAButton} component
 * @description Primary call-to-action button that links to the donation page
 * @param {CTAButtonProps} props - The component props
 * @param {string} [props.text] - Optional override for the button label
 * @param {() => void} [props.onClick] - Optional click handler
 * @param {string} [props.size] - Button size variant (defaults to `lg`)
 * @param {string} [props.className] - Optional extra class names for the link wrapper
 * @returns The rendered CTA button
 */
export const CTAButton = ({ text, onClick, size = 'lg', className }: CTAButtonProps) => {
  // Resolve the label, falling back to the default copy
  const label = text ?? ctaCopy.DEFAULT_BUTTON_TEXT

  // Render the button as a Link to the donation route
  return (
    <Button
      render={
        <Link href={ctaRoute.DONATE} className={cn('group flex items-center gap-4', className)} />
      }
      nativeButton={false}
      size={size}
      variant='CTA'
      onClick={onClick}
    >
      <span>{label}</span>
      <HeartHandshake className='size-6 group-hover:animate-pulse' />
    </Button>
  )
}
