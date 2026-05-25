// Dependencies
import { cn } from '@/lib/utils'
import {
	Building,
	Eye,
	GraduationCap,
	Hammer,
	HandshakeIcon,
	Heart,
	HeartHandshake,
	Home,
	UserPlus,
	Users,
	Wallet,
} from 'lucide-react'
import Image, { type ImageProps } from 'next/image'

// Types
import type { ReactNode } from 'react'
type Props = {
	title: string
	children: ReactNode
	image: ImageProps['src']
	variant: 'home' | 'sobre' | 'projetos' | 'contato' | 'ajudar'
	className?: string
	imageClassName?: string
}

/**
 * The HeroCard component
 * @description Will render the HeroCard
 * @param {Props} props The component props
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The HeroCard component
 */
export const HeroCard = ({
	variant = 'home',
	title,
	image,
	children,
	className,
	imageClassName,
}: Props) => {
	return (
		<div className={cn('z-10 max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl', className)}>
			<div className='relative aspect-video w-full'>
				<Image
					fill
					priority
					src={image}
					alt='Impacto na comunidade'
					className={cn('h-full w-full object-cover', imageClassName)}
				/>
			</div>
			<div className='p-8'>
				<h2 className='font-bold text-xl'>{title}</h2>
				<p className='mt-2 text-muted-foreground'>{children}</p>

				{variant === 'home' && <HomeIcons />}
				{variant === 'sobre' && <SobreIcons />}
				{variant === 'projetos' && <ProjetosIcons />}
				{variant === 'ajudar' && <AjudarIcons />}
			</div>
		</div>
	)
}

function IconWrapper({ children, className }: { className?: string; children: ReactNode }) {
	return (
		<div className={cn('flex size-12 items-center justify-center rounded-full', className)}>
			{children}
		</div>
	)
}

function HomeIcons() {
	return (
		<div className='mt-6 flex gap-4'>
			<IconWrapper className='bg-primary/10'>
				<Home className='size-6 text-primary' />
			</IconWrapper>

			<IconWrapper className='bg-secondary/10'>
				<Heart className='size-6 text-secondary' />
			</IconWrapper>

			<IconWrapper className='bg-accent/10'>
				<Users className='size-6 text-accent-foreground' />
			</IconWrapper>
		</div>
	)
}

function SobreIcons() {
	return (
		<div className='mt-6 flex gap-4'>
			<IconWrapper className='bg-primary/10'>
				<Heart className='size-6 text-primary' />
			</IconWrapper>

			<IconWrapper className='bg-secondary/10'>
				<HandshakeIcon className='size-6 text-secondary' />
			</IconWrapper>

			<IconWrapper className='bg-accent/10'>
				<Eye className='size-6 text-accent-foreground' />
			</IconWrapper>
		</div>
	)
}

function ProjetosIcons() {
	return (
		<div className='mt-6 flex gap-4'>
			<IconWrapper className='bg-primary/10'>
				<Hammer className='size-6 text-primary' />
			</IconWrapper>

			<IconWrapper className='bg-secondary/10'>
				<HeartHandshake className='size-6 text-secondary' />
			</IconWrapper>

			<IconWrapper className='bg-accent/10'>
				<GraduationCap className='size-6 text-accent-foreground' />
			</IconWrapper>
		</div>
	)
}

function AjudarIcons() {
	return (
		<div className='mt-6 flex gap-4'>
			<IconWrapper className='bg-primary/10'>
				<Wallet className='size-6 text-primary' />
			</IconWrapper>

			<IconWrapper className='bg-secondary/10'>
				<UserPlus className='size-6 text-secondary' />
			</IconWrapper>

			<IconWrapper className='bg-accent/10'>
				<Building className='size-6 text-accent-foreground' />
			</IconWrapper>
		</div>
	)
}
