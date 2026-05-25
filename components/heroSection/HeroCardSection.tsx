// Dependencies
import { cn } from '@/lib/utils'

// Types
import type { ReactNode } from 'react'
import { HeroBgColors } from './HeroBgColors'
type Props = {
	children: ReactNode
	className?: string
}

/**
 * The HeroCardSection component
 * @description Will render the HeroCardSection
 * @param {Props} props The component props
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The HeroCardSection component
 */
export const HeroCardSection = ({ children, className }: Props) => {
	return (
		<div className={cn('relative flex items-center justify-center', className)}>
			<HeroBgColors />

			{children}
		</div>
	)
}
