// Dependencies
import { cn } from '@/lib/utils'

// Types
type Props = {
	value: number | string
	label: string
	className?: string
}

/**
 * The HeroStats component
 * @description Will render the HeroStats
 * @param {Props} props The component props
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The HeroStats component
 */
export const HeroStats = ({ value, label, className }: Props) => {
	return (
		<div className={cn('flex flex-col border-border border-r pr-4 last:border-r-0', className)}>
			<p className='font-bold text-3xl text-foreground'>{value}</p>
			<p className='mt-1 text-muted-foreground text-sm'>{label}</p>
		</div>
	)
}
