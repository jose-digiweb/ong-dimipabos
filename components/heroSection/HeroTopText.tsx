import { SendHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { ChildrenWithClassName } from './types'

/**
 * The {@link HeroTopText} component
 * @description Small pill rendered above the hero title with an icon and label text
 * @param {ChildrenWithClassName} props - The component props
 * @param {ReactNode} props.children - The label text
 * @param {string} [props.className] - Optional extra class names
 * @returns The rendered pill
 */
export const HeroTopText = ({ children, className }: ChildrenWithClassName) => {
  // Render the pill wrapper, icon and inline label content
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 font-medium text-blue-700 text-sm',
        className,
      )}
    >
      <SendHorizontal className='mr-2 size-4' />
      {children}
    </div>
  )
}
