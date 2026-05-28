'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Turnstile, type TurnstileHandle } from '@/components/turnstile'
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
import type { Locale } from '@/i18n/config'
import {
  CONTACT_LIMITS,
  type ContactErrorCode,
  type ContactPayload,
  type ContactResponse,
  buildContactSchema,
  contactErrorCode,
} from '@/lib/forms/contact-schema'

/**
 * The {@link CONTACT_API_PATH} constant
 * @description Endpoint the form submits to
 */
const CONTACT_API_PATH = '/api/forms/contact'

/**
 * The {@link CONTACT_DEFAULTS} constant
 * @description Empty initial values for every controlled field
 */
const CONTACT_DEFAULTS: ContactPayload = {
  name: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
}

/**
 * The {@link errorCodeToMessageKey} constant
 * @description Maps wire-level error codes to translation keys under `contactForm`
 */
const errorCodeToMessageKey: Record<ContactErrorCode, string> = {
  [contactErrorCode.VALIDATION]: 'errorValidation',
  [contactErrorCode.TURNSTILE]: 'errorTurnstile',
  [contactErrorCode.RATE_LIMIT]: 'errorRateLimit',
  [contactErrorCode.EMAIL_FAILED]: 'errorEmailFailed',
  [contactErrorCode.STORAGE_FAILED]: 'errorStorageFailed',
  [contactErrorCode.UNKNOWN]: 'errorUnknown',
}

/**
 * The {@link ContactForm} component
 * @description Public contact form. Validates with a locale-aware zod schema,
 * verifies a Cloudflare Turnstile token, then POSTs to `/api/forms/contact`
 * which persists the submission and dispatches an email notification.
 * @returns The rendered contact form
 */
export function ContactForm() {
  // Read the locale-aware copy
  const t = useTranslations('contactForm')
  const tCommon = useTranslations('common')
  const locale = useLocale() as Locale

  // Public Turnstile site key (Next.js inlines NEXT_PUBLIC_* at build time)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  // Build the zod schema bound to the active locale messages
  const contactSchema = useMemo(() => buildContactSchema(t), [t])

  // Initialise the form with empty defaults
  const form = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: CONTACT_DEFAULTS,
  })

  // Destructure for proxy-friendly subscriptions
  const {
    setError,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = form

  // Turnstile token state — required before submission can proceed
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileHandle>(null)

  // Success banner state — separate from RHF's isSubmitSuccessful so we can keep
  // it visible across the reset() that clears form values
  const [submitted, setSubmitted] = useState(false)

  // Submit handler — verifies Turnstile, POSTs payload, maps error codes
  const onSubmit = async (values: ContactPayload) => {
    clearErrors('root.serverError')
    setSubmitted(false)

    // Guard: Turnstile widget must have produced a token
    if (!turnstileToken) {
      setError('root.serverError', { type: 'turnstile', message: t('errorTurnstile') })
      return
    }

    // POST the validated payload + token + active locale
    let body: ContactResponse
    try {
      const res = await fetch(CONTACT_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale, turnstileToken }),
      })
      body = (await res.json()) as ContactResponse
    } catch {
      setError('root.serverError', { type: 'network', message: t('errorNetwork') })
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      return
    }

    // Branch on the discriminated response
    if (body.ok) {
      setSubmitted(true)
      reset()
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      return
    }

    setError('root.serverError', {
      type: 'server',
      message: t(errorCodeToMessageKey[body.code]),
    })
    turnstileRef.current?.reset()
    setTurnstileToken(null)
  }

  // Render the contact form fields
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8' noValidate>
        {submitted ? (
          <div
            role='status'
            className='rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 text-sm'
          >
            <p className='font-semibold'>{t('successTitle')}</p>
            <p className='mt-1'>{t('successBody')}</p>
          </div>
        ) : null}

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
                  maxLength={CONTACT_LIMITS.NAME_MAX}
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
                  maxLength={CONTACT_LIMITS.EMAIL_MAX}
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
                  maxLength={CONTACT_LIMITS.SUBJECT_MAX}
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
                  maxLength={CONTACT_LIMITS.MESSAGE_MAX}
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

        {siteKey ? (
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        ) : null}

        <Button type='submit' variant='secondary' disabled={isSubmitting}>
          {isSubmitting ? tCommon('formSubmitting') : t('submitLabel')}
        </Button>
      </form>
    </Form>
  )
}
