// Dependencies
import { cn } from '@/lib/utils'

// Types
import type { ReactNode } from 'react'
type Props = {
	children: ReactNode
	className?: string
}

/**
 * The HeroSubtitle component
 * @description Will render the HeroSubtitle
 * @param {Props} props The component props
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The HeroSubtitle component
 */
export const HeroSubtitle = ({ children, className }: Props) => {
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
