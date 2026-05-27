import { cn } from '@/lib/utils'

import { HeroBgColors } from './HeroBgColors'
import type { ChildrenWithClassName } from './types'

/**
 * The {@link HeroCardSection} component
 * @description Layout wrapper that centres the hero card on top of the decorative {@link HeroBgColors}
 * @param {ChildrenWithClassName} props - The component props
 * @param {ReactNode} props.children - The card or content to centre
 * @param {string} [props.className] - Optional extra class names for the wrapper
 * @returns The rendered section
 */
export const HeroCardSection = ({ children, className }: ChildrenWithClassName) => {
  // Render the relative wrapper with the background blobs behind the children
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <HeroBgColors />
      {children}
    </div>
  )
}
