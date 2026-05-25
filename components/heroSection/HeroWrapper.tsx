// Dependencies
import { cn } from '@/lib/utils'

// Types
import type { ReactNode } from 'react'
type Props = {
	children: ReactNode
	className?: string
}

/**
 * The HeroWrapper component
 * @description Will render the HeroWrapper
 * @param {Props} props The component props
 * @param {ReactNode} props.children The component children
 * @param {VariantUnion} props.variant The component variant
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The HeroWrapper component
 */
export const HeroWrapper = ({ children, className }: Props) => {
	return (
		<section
			className={cn('relative overflow-hidden bg-linear-to-b from-primary/5 to-primary/10', className)}
		>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='grid min-h-[600px] items-center gap-12 pt-8 pb-16 md:grid-cols-2 lg:min-h-[700px] lg:gap-16'>
					{children}
				</div>
			</div>
		</section>
	)
}
