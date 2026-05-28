'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
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
 * The {@link ContactFormValues} type
 * @description Shape of the contact form values
 */
type ContactFormValues = {
  name: string
  email: string
  subject: string
  message: string
  consent: boolean
}

/**
 * The {@link ContactForm} component
 * @description Renders the public contact form using locale-aware copy and
 * validation messages
 * @returns The rendered contact form
 */
export function ContactForm() {
  // Read the locale-aware contact form translations
  const t = useTranslations('contactForm')

  // Build the zod schema bound to the active locale messages
  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(MIN_NAME_LENGTH, { message: t('nameError') }),
        email: z.string().email({ message: t('emailError') }),
        subject: z.string().min(MIN_NAME_LENGTH, { message: t('subjectError') }),
        message: z.string().min(MIN_MESSAGE_LENGTH, { message: t('messageError') }),
        consent: z
          .boolean()
          .refine((val) => val === true, { message: t('consentError') }),
      }),
    [t],
  )

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
              <FormLabel>{t('nameLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('namePlaceholder')} {...field} />
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
              <FormLabel>{t('emailLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('emailPlaceholder')} type='email' {...field} />
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
              <FormLabel>{t('subjectLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('subjectPlaceholder')} {...field} />
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
              <FormLabel>{t('messageLabel')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('messagePlaceholder')}
                  className='min-h-30 resize-none'
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
                <FormLabel>{t('consentLabel')}</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type='submit' variant='secondary'>
          {t('submitLabel')}
        </Button>
      </form>
    </Form>
  )
}
