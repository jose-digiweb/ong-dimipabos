// Dependencies
import { cn } from '@/lib/utils'

// Types
import type { ReactNode } from 'react'
type Props = {
	children: ReactNode
	className?: string
}

/**
 * The HeroTitle component
 * @description Will render the HeroTitle
 * @param {Props} props The component props
 * @param {ReactNode} props.children The component children
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The HeroTitle component
 */
export const HeroTitle = ({ children, className }: Props) => {
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
