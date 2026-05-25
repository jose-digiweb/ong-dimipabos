import { CTASection } from '@/components/cta'
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
import { PartnershipForm } from '@/components/partnership-form'
import { TestimonialSection } from '@/components/testimonial-section'
import { Button } from '@/components/ui/button'
import { SectionDescription, SectionTitle } from '@/components/ui/section'
import { VolunteerForm } from '@/components/volunteer-form'
import { Handshake, Heart, Users } from 'lucide-react'
import Link from 'next/link'

import projHabitacao from '@/assets/projectos/proj_habitacao.jpeg'

export default function HelpPage() {
	return (
		<div className='flex min-h-dvh flex-col'>
			{/* Hero Section */}
			<HeroWrapper>
				<div className='flex flex-col justify-center'>
					<HeroTopText>Como Ajudar</HeroTopText>

					<HeroTitle>Faça Parte Desta Construção</HeroTitle>
					<HeroSubtitle>Ajude a Construir Esperança</HeroSubtitle>

					<HeroDescription>
						Sua contribuição é fundamental para concluirmos a construção do centro e começarmos a
						transformar vidas. Cada tijolo conta, cada ajuda importa..
					</HeroDescription>

					<div className='mt-10 flex items-center gap-4'>
						<HeroStats value='5' label='Voluntários Ativos' />

						<HeroStats value='2+' label='Parcerias Ativas' />
					</div>
				</div>

				<HeroCardSection>
					<HeroCard variant='ajudar' title='Como Você Pode Ajudar' image={projHabitacao}>
						Escolha a forma que mais combina com você e faça parte desta transformação social.
					</HeroCard>
				</HeroCardSection>
			</HeroWrapper>

			{/* Ways to Help Section */}
			<section className='py-16'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<SectionTitle>Como Você Pode Ajudar</SectionTitle>

						<SectionDescription>
							Existem várias maneiras de contribuir com nossa causa. Escolha a que mais combina com você.
						</SectionDescription>
					</div>

					<div className='mt-16 grid gap-8 md:grid-cols-3'>
						<div className='flex flex-col items-center rounded-lg bg-muted p-8 text-center'>
							<Heart className='size-12 text-secondary' />

							<h3 className='mt-4 font-bold text-xl'>Doe</h3>

							<p className='mt-2 text-pretty'>
								Sua doação ajuda a manter nossos programas de tratamento e acompanhamento pós-reabilitação.
							</p>

							<Button render={<Link href='#doar' />} nativeButton={false} variant='CTA' className='mt-6'>
								Doe Agora
							</Button>
						</div>

						<div className='flex flex-col items-center rounded-lg bg-muted p-8 text-center'>
							<Users className='size-12 text-secondary' />

							<h3 className='mt-4 font-bold text-xl'>Seja Voluntário</h3>
							<p className='mt-2 text-pretty'>
								Ajude em nossos programas de acompanhamento e suporte emocional aos pacientes.
							</p>

							<Button
								render={<Link href='#voluntario' />}
								nativeButton={false}
								variant='CTA'
								className='mt-6'
							>
								Inscreva-se
							</Button>
						</div>

						<div className='flex flex-col items-center rounded-lg bg-muted p-8 text-center'>
							<Handshake className='size-12 text-secondary' />

							<h3 className='mt-4 font-bold text-xl'>Seja Parceiro</h3>
							<p className='mt-2 text-pretty'>
								Apoie nosso trabalho de reintegração social e manutenção da sobriedade.
							</p>

							<Button
								render={<Link href='#parceiro' />}
								nativeButton={false}
								variant='CTA'
								className='mt-6'
							>
								Saiba Mais
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Volunteer Section */}
			<section id='voluntario' className='scroll-mt-8 bg-slate-50 py-16'>
				<VolunteerForm />
			</section>

			{/* Partnership Section */}
			<section id='parceiro' className='scroll-mt-8 py-16'>
				<PartnershipForm />
			</section>

			{/* Testimonial Section */}
			<TestimonialSection />

			{/* CTA Section */}
			<CTASection className='border-b' />
		</div>
	)
}
