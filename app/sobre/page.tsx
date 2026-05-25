import { CTAButton } from '@/components/cta'
import {
	HeroCard,
	HeroCardSection,
	HeroDescription,
	HeroStats,
	HeroSubtitle,
	HeroTitle,
	HeroTopText,
	HeroWrapper,
} from '@/components/heroSection'
import { ImpactNumbers } from '@/components/impact-numbers'
import { TeamSection } from '@/components/team-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionTitle } from '@/components/ui/section'
import { Eye, HandshakeIcon, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import logo from '@/assets/dimipabos_logo_2.png'

export default function SobrePage() {
	return (
		<div className='flex min-h-screen flex-col'>
			{/* Hero Section */}
			<HeroWrapper>
				<div className='flex flex-col justify-center'>
					<HeroTopText>Nossa História</HeroTopText>

					<HeroTitle>Quem Somos</HeroTitle>
					<HeroSubtitle>Construindo um futuro de esperança</HeroSubtitle>

					<HeroDescription>
						A DI MI PA BÔS nasceu da urgente necessidade de oferecer tratamento adequado e humanizado para
						pessoas em situação de dependência química na Guiné-Bissau. Nossa missão é construir e operar
						o primeiro centro especializado do país.
					</HeroDescription>

					<div className='mt-8 flex flex-col gap-4 sm:flex-row'>
						<CTAButton text='Apoie Nossa Causa' size='lg' />

						<Button
							render={<Link href='/projetos' />}
							nativeButton={false}
							size='lg'
							variant='outline'
							className='bg-white'
						>
							Conheça o Projeto
						</Button>
					</div>

					<div className='mt-10 flex items-center gap-4'>
						<HeroStats value={2021} label='Ano de Fundação' />

						<HeroStats value='10%' label='Da Construção Concluída' />

						<HeroStats value='5' label='Voluntários Ativos' />
					</div>
				</div>

				<HeroCardSection>
					<HeroCard variant='sobre' title='Nossa Essência' image={logo} imageClassName='object-contain'>
						Trabalhamos incansavelmente para construir um espaço de acolhimento e recuperação, onde cada
						pessoa possa encontrar apoio para recomeçar.
					</HeroCard>
				</HeroCardSection>
			</HeroWrapper>

			{/* História Section */}
			<section id='historia' className='bg-slate-50 py-16'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='grid gap-12 md:grid-cols-[1fr_35%] lg:gap-8'>
						<div className='flex flex-col justify-center'>
							<SectionTitle>Nossa História</SectionTitle>

							<div className='mt-6 space-y-6 text-lg text-muted-foreground'>
								<p className='text-pretty'>
									A ONG DI MI PA BÔS nasceu em 2021 com um propósito simples, mas essencial: levar ajuda a
									quem mais precisa. Inicialmente, nosso foco estava em doações, fornecendo apoio básico para
									pessoas em situação de vulnerabilidade na Guiné-Bissau. No entanto, ao longo do nosso
									trabalho, percebemos uma necessidade ainda maior — um espaço seguro e estruturado para
									acolher e tratar pessoas que lutam contra a dependência química.
								</p>
								<p className='text-pretty'>
									Dessa constatação, surgiu o nosso grande projeto: a construção de um centro de acolhimento
									e tratamento para pessoas que enfrentam desafios com o uso de substâncias. Esse centro será
									um lugar onde elas poderão se recuperar com dignidade, recebendo tratamento adequado e um
									acompanhamento contínuo para garantir sua reabilitação e reintegração à sociedade.
								</p>
								<p className='text-pretty'>
									Ainda estamos em fase de construção, mas cada passo que damos é movido pelo compromisso de
									transformar vidas. Com o apoio da comunidade, parceiros e doadores, estamos construindo um
									futuro onde mais pessoas tenham a chance de recomeçar.
								</p>
								<p className='text-pretty'>
									Junte-se a nós nessa missão e ajude a tornar esse sonho realidade! 💙✨
								</p>
							</div>
						</div>
						<div className='relative mx-auto w-96 md:mx-0 md:my-auto md:w-auto'>
							<div className='aspect-square overflow-hidden rounded-full drop-shadow-md'>
								<Image
									fill
									src={logo}
									alt='Fundação da ONG'
									className='h-full w-full rounded-full object-contain drop-shadow-xs'
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Missão, Visão e Valores Section */}
			<section className='py-16'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<SectionTitle>Missão, Visão e Valores</SectionTitle>
					</div>

					<div className='mt-16 grid gap-8 md:grid-cols-3'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Heart className='size-6 text-secondary' />
									Missão
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-pretty text-muted-foreground'>
									Construir e operar o primeiro centro especializado em tratamento e reabilitação para
									pessoas em situação de dependência química na Guiné-Bissau, oferecendo acolhimento e
									cuidado humanizado.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Eye className='size-6 text-secondary' />
									Visão
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-pretty text-muted-foreground'>
									Ser referência em tratamento e reabilitação na Guiné-Bissau, proporcionando um espaço de
									acolhimento, recuperação e renovação para quem precisa.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<HandshakeIcon className='size-6 text-secondary' />
									Valores
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className='space-y-2 text-muted-foreground'>
									<li>Empatia e Respeito no acolhimento</li>
									<li>Transparência em nossas ações</li>
									<li>Compromisso com a recuperação</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Team Section */}
			<TeamSection />

			{/* Impact Numbers */}
			<ImpactNumbers />

			{/* Compromissos Section */}
			<section className='py-16'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<SectionTitle>Nossos Compromissos</SectionTitle>
					</div>

					<div className='mt-16 grid gap-8 md:grid-cols-3'>
						{[
							{
								title: 'Transparência',
								description:
									'Prestação de contas clara sobre o uso dos recursos e andamento da construção.',
							},
							{
								title: 'Qualidade',
								description:
									'Construção e implementação de um centro com estrutura adequada e equipe capacitada.',
							},
							{
								title: 'Impacto Social',
								description:
									'Compromisso com a transformação efetiva de vidas através do tratamento especializado.',
							},
						].map((item, index) => (
							<Card key={index}>
								<CardHeader>
									<CardTitle>{item.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-pretty text-muted-foreground'>{item.description}</p>
								</CardContent>
							</Card>
						))}
					</div>

					<div className='mt-16 text-center'>
						<p className='mx-auto max-w-2xl text-pretty text-lg text-muted-foreground'>
							Acreditamos que a recuperação é possível quando há estrutura adequada, tratamento
							especializado e apoio contínuo. É por isso que trabalhamos incansavelmente na construção do
							nosso centro.
						</p>
						<div className='mt-8'>
							<CTAButton text='Apoie essa causa' />
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
