import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CTAButton } from './cta'

interface ProjectProgressProps {
	title: string
	description: string
}

export function ProjectProgress({ title, description }: ProjectProgressProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6'>
				<div className='rounded-lg bg-muted p-6'>
					<div className='flex flex-wrap gap-8'>
						<div className='flex-1'>
							<div className='font-medium text-muted-foreground text-sm'>Meta</div>
							<div className='mt-1 font-bold text-2xl'>€500.000</div>
						</div>
						<div className='flex-1'>
							<div className='font-medium text-muted-foreground text-sm'>Arrecadado</div>
							<div className='mt-1 font-bold text-2xl'>€75.000</div>
						</div>
						<div className='flex-1'>
							<div className='font-medium text-muted-foreground text-sm'>Doadores</div>
							<div className='mt-1 font-bold text-2xl'>42</div>
						</div>
					</div>
				</div>

				<CTAButton text='Contribua com o Projeto' size='lg' />
			</CardContent>
		</Card>
	)
}
