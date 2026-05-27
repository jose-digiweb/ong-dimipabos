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

/**
 * The {@link contactCopy} constant
 * @description Static Portuguese copy used by the contact form
 */
const contactCopy = {
  NAME_LABEL: 'Nome Completo',
  NAME_PLACEHOLDER: 'Digite seu nome',
  EMAIL_LABEL: 'E-mail',
  EMAIL_PLACEHOLDER: 'Digite seu e-mail',
  SUBJECT_LABEL: 'Assunto',
  SUBJECT_PLACEHOLDER: 'Digite o assunto',
  MESSAGE_LABEL: 'Mensagem',
  MESSAGE_PLACEHOLDER: 'Digite sua mensagem',
  CONSENT_LABEL: 'Eu autorizo o uso dos meus dados para resposta da mensagem.',
  SUBMIT_LABEL: 'Enviar Mensagem',
  NAME_ERROR: 'O nome deve ter pelo menos 2 caracteres.',
  EMAIL_ERROR: 'Digite um e-mail válido.',
  SUBJECT_ERROR: 'O assunto deve ter pelo menos 2 caracteres.',
  MESSAGE_ERROR: 'A mensagem deve ter pelo menos 10 caracteres.',
  CONSENT_ERROR: 'Você deve autorizar o uso dos seus dados.',
} as const

/**
 * The {@link MIN_NAME_LENGTH} constant
 * @description Minimum length for the name and subject fields
 */
const MIN_NAME_LENGTH = 2

/**
 * The {@link MIN_MESSAGE_LENGTH} constant
 * @description Minimum length for the message field
 */
const MIN_MESSAGE_LENGTH = 10

/**
 * The {@link contactSchema} constant
 * @description Zod schema for the contact form payload
 */
const contactSchema = z.object({
  name: z.string().min(MIN_NAME_LENGTH, { message: contactCopy.NAME_ERROR }),
  email: z.string().email({ message: contactCopy.EMAIL_ERROR }),
  subject: z.string().min(MIN_NAME_LENGTH, { message: contactCopy.SUBJECT_ERROR }),
  message: z.string().min(MIN_MESSAGE_LENGTH, { message: contactCopy.MESSAGE_ERROR }),
  consent: z.boolean().refine((val) => val === true, { message: contactCopy.CONSENT_ERROR }),
})

/**
 * The {@link ContactFormValues} type
 * @description Inferred shape of the contact form values
 */
type ContactFormValues = z.infer<typeof contactSchema>

/**
 * The {@link ContactForm} component
 * @description Renders the public contact form
 * @returns The rendered contact form
 */
export function ContactForm() {
  // Initialise the form with empty defaults
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '', consent: false },
  })

  // Placeholder submit handler — wire up to the backend when available
  const onSubmit = (_values: ContactFormValues) => {
    // no-op until a backend handler is added
  }

  // Render the contact form fields
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{contactCopy.NAME_LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={contactCopy.NAME_PLACEHOLDER} {...field} />
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
              <FormLabel>{contactCopy.EMAIL_LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={contactCopy.EMAIL_PLACEHOLDER} type='email' {...field} />
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
              <FormLabel>{contactCopy.SUBJECT_LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={contactCopy.SUBJECT_PLACEHOLDER} {...field} />
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
              <FormLabel>{contactCopy.MESSAGE_LABEL}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={contactCopy.MESSAGE_PLACEHOLDER}
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
                <FormLabel>{contactCopy.CONSENT_LABEL}</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type='submit' variant='secondary'>
          {contactCopy.SUBMIT_LABEL}
        </Button>
      </form>
    </Form>
  )
}
