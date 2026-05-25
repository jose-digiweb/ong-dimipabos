'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SectionDescription } from './ui/section/SectionDescription'
import { SectionTitle } from './ui/section/SectionTitle'

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'O nome deve ter pelo menos 2 caracteres.',
	}),
	email: z.string().email({
		message: 'Digite um e-mail válido.',
	}),
	phone: z.string().min(8, {
		message: 'Digite um número de telefone válido.',
	}),
	area: z.string({
		error: 'Selecione uma área de interesse.',
	}),
	availability: z.string().min(2, {
		message: 'Descreva sua disponibilidade.',
	}),
	experience: z.string(),
	terms: z.boolean().refine((val) => val === true, {
		message: 'Você deve aceitar os termos.',
	}),
})

export function VolunteerForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			availability: '',
			experience: '',
			terms: false,
		},
	})

	return (
		<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
			<div className='text-center'>
				<SectionTitle>Seja um Voluntário</SectionTitle>
				<SectionDescription>
					Dedique seu tempo e habilidades para fazer a diferença na vida de alguém.
				</SectionDescription>
			</div>

			<div className='mt-16'>
				<Form {...form}>
					<form className='space-y-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome Completo</FormLabel>
									<FormControl>
										<Input placeholder='Digite seu nome' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='grid gap-8 md:grid-cols-2'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input placeholder='Digite seu e-mail' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Telefone</FormLabel>
										<FormControl>
											<Input placeholder='Digite seu telefone' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='area'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Área de Interesse</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Selecione uma área' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='construction'>Construção</SelectItem>
											<SelectItem value='education'>Educação</SelectItem>
											<SelectItem value='health'>Saúde</SelectItem>
											<SelectItem value='social'>Assistência Social</SelectItem>
											<SelectItem value='admin'>Administrativo</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='availability'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Disponibilidade</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Descreva sua disponibilidade (dias e horários)'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='experience'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Experiência</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Conte-nos sobre suas experiências relevantes (opcional)'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='terms'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>
											Concordo em receber comunicações da DI MI PA BÔS e aceito os termos de uso e política de
											privacidade.
										</FormLabel>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>

						<Button type='submit' variant='secondary'>
							Enviar Inscrição
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
