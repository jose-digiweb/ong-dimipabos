// Dependencies
import { cn } from '@/lib/utils'
import { SendHorizontal } from 'lucide-react'

// Types
import type { ReactNode } from 'react'
type Props = {
	children: ReactNode
	className?: string
}

/**
 * The HeroTopText component
 * @description Will render the HeroTopText
 * @param {Props} props The component props
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The HeroTopText component
 */
export const HeroTopText = ({ children, className }: Props) => {
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
