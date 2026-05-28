'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
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
 * The {@link MAX_NAME_LENGTH} constant
 * @description Maximum length for the name and subject fields
 */
const MAX_NAME_LENGTH = 120

/**
 * The {@link MAX_EMAIL_LENGTH} constant
 * @description Maximum length for the email field
 */
const MAX_EMAIL_LENGTH = 254

/**
 * The {@link MAX_MESSAGE_LENGTH} constant
 * @description Maximum length for the message field
 */
const MAX_MESSAGE_LENGTH = 2000

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
 * The {@link CONTACT_DEFAULTS} constant
 * @description Empty initial values for every controlled field
 */
const CONTACT_DEFAULTS: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
}

/**
 * The {@link ContactForm} component
 * @description Renders the public contact form using locale-aware copy and
 * validation messages. Submission is not yet wired to a backend; the handler
 * surfaces a friendly notice via `setError('root.serverError', ...)`.
 * @returns The rendered contact form
 */
export function ContactForm() {
  // Read the locale-aware copy
  const t = useTranslations('contactForm')
  const tCommon = useTranslations('common')

  // Build the zod schema bound to the active locale messages
  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(MIN_NAME_LENGTH, { message: t('nameError') }),
        email: z.string().email({ message: t('emailError') }),
        subject: z.string().min(MIN_NAME_LENGTH, { message: t('subjectError') }),
        message: z.string().min(MIN_MESSAGE_LENGTH, { message: t('messageError') }),
        consent: z.boolean().refine((val) => val === true, { message: t('consentError') }),
      }),
    [t],
  )

  // Initialise the form with empty defaults
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: CONTACT_DEFAULTS,
  })

  // Destructure for proxy-friendly subscriptions
  const {
    setError,
    clearErrors,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = form

  // Stub submit handler — surfaces the unavailable banner until the backend lands
  const onSubmit = async () => {
    clearErrors('root.serverError')
    setError('root.serverError', { type: 'unavailable', message: tCommon('formUnavailable') })
  }

  // Reset the form once the backend wiring lands and a real success is reported
  useEffect(() => {
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful, reset])

  // Render the contact form fields
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8' noValidate>
        {errors.root?.serverError ? (
          <div
            role='alert'
            className='rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 text-sm'
          >
            {errors.root.serverError.message}
          </div>
        ) : null}

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('nameLabel')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('namePlaceholder')}
                  autoComplete='name'
                  maxLength={MAX_NAME_LENGTH}
                  {...field}
                />
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
                <Input
                  placeholder={t('emailPlaceholder')}
                  type='email'
                  inputMode='email'
                  autoComplete='email'
                  maxLength={MAX_EMAIL_LENGTH}
                  {...field}
                />
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
                <Input
                  placeholder={t('subjectPlaceholder')}
                  autoComplete='off'
                  maxLength={MAX_NAME_LENGTH}
                  {...field}
                />
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
                  maxLength={MAX_MESSAGE_LENGTH}
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

        <Button type='submit' variant='secondary' disabled={isSubmitting}>
          {isSubmitting ? tCommon('formSubmitting') : t('submitLabel')}
        </Button>
      </form>
    </Form>
  )
}
