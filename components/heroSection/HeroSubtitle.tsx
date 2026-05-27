import { cn } from '@/lib/utils'

import type { ChildrenWithClassName } from './types'

/**
 * The {@link HeroSubtitle} component
 * @description Hero subtitle rendered immediately under the title
 * @param {ChildrenWithClassName} props - The component props
 * @param {ReactNode} props.children - The subtitle content
 * @param {string} [props.className] - Optional extra class names
 * @returns The rendered subtitle
 */
export const HeroSubtitle = ({ children, className }: ChildrenWithClassName) => {
  // Render the inline-block subtitle with the project's typography ramp
  return (
    <span
      className={cn(
        'mt-2 block max-w-lg text-pretty font-medium text-2xl text-primary sm:text-3xl md:text-4xl',
        className,
      )}
    >
      {children}
    </span>
  )
}
