import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Dependencies
import { cn } from '@/lib/utils'
import { ArrowRight, Heart, Home, Users } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useMemo } from 'react'

// Types
type Icons = 'home' | 'reab' | 'edu'
type Props = {
	title: string
	children: ReactNode
	href: string
	icon: Icons
	className?: string
}
const getIcon = (icon: Icons) => {
	switch (icon) {
		case 'home':
			return Home
		case 'reab':
			return Users
		case 'edu':
			return Heart
		default:
			return Home
	}
}

/**
 * The HeroProjectCard component
 * @description Will render the HeroProjectCard
 * @param {Props} props The component props
 * @param {string} props.title The component title
 * @param {ReactNode} props.children The component children
 * @param {string} props.href The component href
 * @param {Icons} props.icon The component icon
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The HeroProjectCard component
 */
export const HomeProjectCard = ({ icon, title, children, href, className }: Props) => {
	const Icon = useMemo(() => getIcon(icon), [icon])

	return (
		<Card className={cn('flex flex-col', className)}>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Icon className='size-6 text-primary' />
					<span>{title}</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='text-muted-foreground'>{children}</p>
				<Link
					href={href}
					className='mt-4 inline-flex items-center font-medium text-primary hover:text-secondary/90'
				>
					Saiba mais
					<ArrowRight className='ml-1 size-4' />
				</Link>
			</CardContent>
		</Card>
	)
}
