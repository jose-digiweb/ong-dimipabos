import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import avatarPlaceholder from '@/assets/team/avatar_placeholder.jpg'
import cesaltinaImage from '@/assets/team/cesaltina.jpeg'
import Image from 'next/image'
import { SectionDescription } from './ui/section/SectionDescription'
import { SectionTitle } from './ui/section/SectionTitle'

const team = [
	{
		name: 'Cesaltina Pereira',
		role: 'Coordenadora Geral',
		description: 'Apaixonada por ajudar pessoas em situação de vulnerabilidade.',
		image: cesaltinaImage,
	},
	{
		name: 'Por completar',
		role: 'Diretor de Operações',
		description: 'Dedicado a criar soluções eficientes para maximizar nosso impacto.',
		image: avatarPlaceholder,
	},
	{
		name: 'Por completar',
		role: 'Coordenadora de Voluntários',
		description: 'Especialista em mobilizar pessoas para causas sociais.',
		image: avatarPlaceholder,
	},
]

export function TeamSection() {
	return (
		<section className='bg-slate-50 py-16'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='text-center'>
					<SectionTitle>Nossa Equipe</SectionTitle>
					<SectionDescription>
						Conheça as pessoas dedicadas que trabalham para tornar o centro de tratamento uma realidade.
					</SectionDescription>
				</div>

				<div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
					{team.map((member, index) => (
						<Card key={index}>
							<CardContent className='pt-6'>
								<div className='flex flex-col items-center'>
									<div className='relative mb-4 size-32 overflow-hidden rounded-full'>
										<Image fill src={member.image} alt={member.name} className='h-full w-full object-cover' />
									</div>

									<CardHeader className='p-0 text-center'>
										<CardTitle className='text-xl'>{member.name}</CardTitle>

										<p className='font-medium text-primary text-sm'>{member.role}</p>
									</CardHeader>
									<p className='mt-2 text-pretty text-center text-muted-foreground text-sm'>
										{member.description}
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
