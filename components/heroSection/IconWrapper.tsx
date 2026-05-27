import { cn } from '@/lib/utils'

import type { IconWrapperProps } from './types'

/**
 * The {@link IconWrapper} component
 * @description Circular tinted wrapper used to render an icon inside the hero card
 * @param {IconWrapperProps} props - The component props
 * @param {string} [props.className] - Optional extra class names
 * @param {ReactNode} props.children - The icon element
 * @returns The rendered wrapper
 */
export const IconWrapper = ({ children, className }: IconWrapperProps) => {
  // Render a round flex container that sizes the icon
  return (
    <div className={cn('flex size-12 items-center justify-center rounded-full', className)}>
      {children}
    </div>
  )
}
