import { cn } from '@/lib/utils'

import type { HeroStatsProps } from './types'

/**
 * The {@link HeroStats} component
 * @description Single stat cell rendered inside the hero stats row
 * @param {HeroStatsProps} props - The component props
 * @param {number | string} props.value - The headline value to display
 * @param {string} props.label - The descriptive label beneath the value
 * @param {string} [props.className] - Optional extra class names
 * @returns The rendered stat cell
 */
export const HeroStats = ({ value, label, className }: HeroStatsProps) => {
  // Render the value and label inside a bordered column
  return (
    <div className={cn('flex flex-col border-border border-r pr-4 last:border-r-0', className)}>
      <p className='font-bold text-3xl text-foreground'>{value}</p>
      <p className='mt-1 text-muted-foreground text-sm'>{label}</p>
    </div>
  )
}
