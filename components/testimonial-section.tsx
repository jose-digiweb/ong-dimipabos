import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Quote } from 'lucide-react'
import { SectionDescription } from './ui/section/SectionDescription'
import { SectionTitle } from './ui/section/SectionTitle'

import testimonialImage from '@/assets/testimonial/testimonial.jpg'
import Image from 'next/image'

export function TestimonialSection() {
	return (
		<section className='py-16'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='text-center'>
					<SectionTitle>Histórias de Impacto</SectionTitle>
					<SectionDescription>
						Conheça algumas das vidas que foram transformadas através do nosso trabalho.
					</SectionDescription>
				</div>

				<div className='mt-16'>
					<Card className='overflow-hidden'>
						<div className='grid md:grid-cols-2'>
							<div className='relative aspect-square md:aspect-auto'>
								<Image
									fill
									src={testimonialImage}
									alt='Maria em sua nova casa'
									className='h-full w-full object-cover'
								/>
							</div>

							<CardContent className='flex flex-col justify-center p-8'>
								<Quote className='size-8 text-secondary' />
								<CardHeader className='p-0'>
									<blockquote className='mt-4 text-lg text-muted-foreground'>
										Hoje, tenho um lugar para chamar de lar. A DI MI PA BÔS não apenas me deu uma casa, mas me
										devolveu a dignidade e a esperança em um futuro melhor.
									</blockquote>

									<footer className='mt-4'>
										<p className='font-semibold text-foreground'>Maria</p>
										<p className='text-muted-foreground text-sm'>Beneficiária do Projeto Habitação Digna</p>
									</footer>
								</CardHeader>
							</CardContent>
						</div>
					</Card>
				</div>
			</div>
		</section>
	)
}
