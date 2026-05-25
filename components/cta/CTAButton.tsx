// Dependencies
import { cn } from '@/lib/utils'
import { HeartHandshake } from 'lucide-react'
import Link from 'next/link'
import { Button, type ButtonProps } from '../ui/button'

type Props = {
	text?: string
	onClick?: () => void
} & Omit<ButtonProps, 'variant'>

/**
 * The CATButton component
 * @description Will render the CATButton
 * @param {Props} props The component props
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The CATButton component
 */
export const CTAButton = ({ text, onClick, size = 'lg', className }: Props) => {
	return (
		<Button
			render={<Link href='/como-ajudar' className={cn('group flex items-center gap-4', className)} />}
			nativeButton={false}
			size={size}
			variant='CTA'
			onClick={onClick}
		>
			<span>{text ? text : 'Doe Agora'}</span>

			<HeartHandshake className='size-6 group-hover:animate-pulse' />
		</Button>
	)
}
