import { cn } from '@/lib/utils'

import type { ChildrenWithClassName } from './types'

/**
 * The {@link HeroTitle} component
 * @description Top-level hero heading
 * @param {ChildrenWithClassName} props - The component props
 * @param {ReactNode} props.children - The heading content
 * @param {string} [props.className] - Optional extra class names
 * @returns The rendered heading
 */
export const HeroTitle = ({ children, className }: ChildrenWithClassName) => {
  // Render the responsive h1 heading
  return (
    <h1
      className={cn(
        'mt-6 text-pretty font-bold text-4xl text-foreground tracking-tight sm:text-5xl md:text-6xl',
        className,
      )}
    >
      {children}
    </h1>
  )
}
