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
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'O nome deve ter pelo menos 2 caracteres.',
	}),
	email: z.string().email({
		message: 'Digite um e-mail válido.',
	}),
	subject: z.string().min(2, {
		message: 'O assunto deve ter pelo menos 2 caracteres.',
	}),
	message: z.string().min(10, {
		message: 'A mensagem deve ter pelo menos 10 caracteres.',
	}),
	consent: z.boolean().refine((val) => val === true, {
		message: 'Você deve autorizar o uso dos seus dados.',
	}),
})

export function ContactForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			subject: '',
			message: '',
			consent: false,
		},
	})

	function onSubmit(_values: z.infer<typeof formSchema>) {
		// Here you would typically send the form data to your server
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<Input placeholder='Digite seu e-mail' type='email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='subject'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Assunto</FormLabel>
							<FormControl>
								<Input placeholder='Digite o assunto' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mensagem</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Digite sua mensagem'
									className='min-h-[120px] resize-none'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='consent'
					render={({ field }) => (
						<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<div className='space-y-1 leading-none'>
								<FormLabel>Eu autorizo o uso dos meus dados para resposta da mensagem.</FormLabel>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				<Button type='submit' variant='secondary'>
					Enviar Mensagem
				</Button>
			</form>
		</Form>
	)
}
