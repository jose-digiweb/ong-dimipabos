'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
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

import { SectionDescription } from './section/SectionDescription'
import { SectionTitle } from './section/SectionTitle'

/**
 * The {@link MIN_NAME_LENGTH} constant
 * @description Minimum length for company and contact name fields
 */
const MIN_NAME_LENGTH = 2

/**
 * The {@link MIN_PHONE_LENGTH} constant
 * @description Minimum length for the phone field
 */
const MIN_PHONE_LENGTH = 8

/**
 * The {@link MIN_MESSAGE_LENGTH} constant
 * @description Minimum length for the message field
 */
const MIN_MESSAGE_LENGTH = 10

/**
 * The {@link MAX_NAME_LENGTH} constant
 * @description Maximum length for company and contact name fields
 */
const MAX_NAME_LENGTH = 120

/**
 * The {@link MAX_EMAIL_LENGTH} constant
 * @description Maximum length for the email field
 */
const MAX_EMAIL_LENGTH = 254

/**
 * The {@link MAX_PHONE_LENGTH} constant
 * @description Maximum length for the phone field
 */
const MAX_PHONE_LENGTH = 32

/**
 * The {@link MAX_MESSAGE_LENGTH} constant
 * @description Maximum length for the message field
 */
const MAX_MESSAGE_LENGTH = 2000

/**
 * The {@link PartnershipFormValues} type
 * @description Shape of the partnership form values
 */
type PartnershipFormValues = {
  companyName: string
  contactName: string
  email: string
  phone: string
  message: string
}

/**
 * The {@link PARTNERSHIP_DEFAULTS} constant
 * @description Empty initial values for every controlled field
 */
const PARTNERSHIP_DEFAULTS: PartnershipFormValues = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  message: '',
}

/**
 * The {@link toStringList} helper
 * @description Narrows an unknown value returned by `t.raw` into a string array
 * @param {unknown} value - The raw translation payload
 * @returns {readonly string[]} A filtered list of string entries
 */
const toStringList = (value: unknown): readonly string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

/**
 * The {@link PartnershipForm} component
 * @description Renders the partnership pitch alongside its contact form in the
 * active locale. Submission is not yet wired to a backend; the handler surfaces
 * a friendly notice via `setError('root.serverError', ...)`.
 * @returns The rendered partnership section
 */
export function PartnershipForm() {
  // Read the locale-aware copy
  const t = useTranslations('partnershipForm')
  const tCommon = useTranslations('common')

  // Read the benefits and types as typed string arrays
  const benefits = toStringList(t.raw('benefits'))
  const types = toStringList(t.raw('types'))

  // Build the schema bound to the active locale messages
  const partnershipSchema = useMemo(
    () =>
      z.object({
        companyName: z.string().min(MIN_NAME_LENGTH, { message: t('companyError') }),
        contactName: z.string().min(MIN_NAME_LENGTH, { message: t('contactError') }),
        email: z.string().email({ message: t('emailError') }),
        phone: z.string().min(MIN_PHONE_LENGTH, { message: t('phoneError') }),
        message: z.string().min(MIN_MESSAGE_LENGTH, { message: t('messageError') }),
      }),
    [t],
  )

  // Initialise the form with empty defaults
  const form = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: PARTNERSHIP_DEFAULTS,
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

  // Render the two-column partnership pitch and form
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <SectionTitle>{t('sectionTitle')}</SectionTitle>
        <SectionDescription>{t('sectionDescription')}</SectionDescription>
      </div>

      <div className='mt-16 grid gap-12 lg:grid-cols-2'>
        <div>
          <h3 className='font-bold text-xl'>{t('whyTitle')}</h3>

          <ul className='mt-6 space-y-4'>
            {benefits.map((benefit, index) => (
              <li key={`benefit-${index}`} className='flex items-start'>
                <span className='mr-2 text-primary'>•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <h3 className='mt-12 font-bold text-xl'>{t('typesTitle')}</h3>

          <ul className='mt-6 space-y-4'>
            {types.map((type, index) => (
              <li key={`type-${index}`} className='flex items-start'>
                <span className='mr-2 text-primary'>•</span>
                <span>{type}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
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
                name='companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('companyLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('companyPlaceholder')}
                        autoComplete='organization'
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
                name='contactName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contactLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('contactPlaceholder')}
                        autoComplete='name'
                        maxLength={MAX_NAME_LENGTH}
                        {...field}
                      />
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
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phoneLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('phonePlaceholder')}
                          type='tel'
                          inputMode='tel'
                          autoComplete='tel'
                          maxLength={MAX_PHONE_LENGTH}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('messageLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('messagePlaceholder')}
                        className='resize-none'
                        maxLength={MAX_MESSAGE_LENGTH}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' variant='secondary' disabled={isSubmitting}>
                {isSubmitting ? tCommon('formSubmitting') : t('submitLabel')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
