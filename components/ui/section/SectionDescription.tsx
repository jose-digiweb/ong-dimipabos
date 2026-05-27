// Dependencies
import { cn } from '@/lib/utils'

// Types
import type { ReactNode } from 'react'
type Props = {
  children: ReactNode
  className?: string
}

/**
 * The SectionDescription component
 * @description Will render the SectionDescription
 * @param {Props} props The component props
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The SectionDescription component
 */
export const SectionDescription = ({ children, className }: Props) => {
  return (
    <p className={cn('mx-auto mt-4 max-w-lg text-pretty text-lg text-muted-foreground', className)}>
      {children}
    </p>
  )
}
