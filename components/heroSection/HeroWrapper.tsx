import { cn } from '@/lib/utils'

import type { ChildrenWithClassName } from './types'

/**
 * The {@link HeroWrapper} component
 * @description Outer hero section wrapper that lays out a responsive 2-column grid
 * @param {ChildrenWithClassName} props - The component props
 * @param {ReactNode} props.children - The hero columns (text + card)
 * @param {string} [props.className] - Optional extra class names
 * @returns The rendered hero wrapper
 */
export const HeroWrapper = ({ children, className }: ChildrenWithClassName) => {
  // Render the section with the responsive 2-column grid layout
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-linear-to-b from-primary/5 to-primary/10',
        className,
      )}
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid min-h-150 items-center gap-12 pt-8 pb-16 md:grid-cols-2 lg:min-h-175 lg:gap-16'>
          {children}
        </div>
      </div>
    </section>
  )
}
