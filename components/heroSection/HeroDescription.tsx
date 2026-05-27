import { cn } from '@/lib/utils'

import type { ChildrenWithClassName } from './types'

/**
 * The {@link HeroDescription} component
 * @description Paragraph used for the hero description copy
 * @param {ChildrenWithClassName} props - The component props
 * @param {ReactNode} props.children - The paragraph content
 * @param {string} [props.className] - Optional extra class names
 * @returns The rendered description paragraph
 */
export const HeroDescription = ({ children, className }: ChildrenWithClassName) => {
  // Render the styled paragraph wrapping the description content
  return (
    <p
      className={cn('mt-6 max-w-xl text-pretty text-muted-foreground text-xl leading-8', className)}
    >
      {children}
    </p>
  )
}
