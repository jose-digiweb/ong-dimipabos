'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Turnstile, type TurnstileHandle } from '@/components/turnstile'
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
import type { Locale } from '@/i18n/config'
import {
  PARTNERSHIP_LIMITS,
  type PartnershipErrorCode,
  type PartnershipPayload,
  type PartnershipResponse,
  buildPartnershipSchema,
  partnershipErrorCode,
} from '@/lib/forms/partnership-schema'

import { SectionDescription } from './section/SectionDescription'
import { SectionTitle } from './section/SectionTitle'

/**
 * The {@link PARTNERSHIP_API_PATH} constant
 * @description Endpoint the form submits to
 */
const PARTNERSHIP_API_PATH = '/api/forms/partnership'

/**
 * The {@link PARTNERSHIP_DEFAULTS} constant
 * @description Empty initial values for every controlled field
 */
const PARTNERSHIP_DEFAULTS: PartnershipPayload = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  message: '',
}

/**
 * The {@link errorCodeToMessageKey} constant
 * @description Maps wire-level error codes to translation keys under `partnershipForm`
 */
const errorCodeToMessageKey: Record<PartnershipErrorCode, string> = {
  [partnershipErrorCode.VALIDATION]: 'errorValidation',
  [partnershipErrorCode.TURNSTILE]: 'errorTurnstile',
  [partnershipErrorCode.RATE_LIMIT]: 'errorRateLimit',
  [partnershipErrorCode.EMAIL_FAILED]: 'errorEmailFailed',
  [partnershipErrorCode.STORAGE_FAILED]: 'errorStorageFailed',
  [partnershipErrorCode.UNKNOWN]: 'errorUnknown',
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
 * @description Renders the partnership pitch alongside its contact form. Validates
 * with a locale-aware zod schema, verifies a Cloudflare Turnstile token, then
 * POSTs to `/api/forms/partnership` which persists the submission and dispatches
 * an email notification.
 * @returns The rendered partnership section
 */
export function PartnershipForm() {
  // Read the locale-aware copy
  const t = useTranslations('partnershipForm')
  const tCommon = useTranslations('common')
  const locale = useLocale() as Locale

  // Read the benefits and types as typed string arrays
  const benefits = toStringList(t.raw('benefits'))
  const types = toStringList(t.raw('types'))

  // Public Turnstile site key (Next.js inlines NEXT_PUBLIC_* at build time)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  // Build the zod schema bound to the active locale messages
  const partnershipSchema = useMemo(() => buildPartnershipSchema(t), [t])

  // Initialise the form with empty defaults
  const form = useForm<PartnershipPayload>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: PARTNERSHIP_DEFAULTS,
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
  const onSubmit = async (values: PartnershipPayload) => {
    clearErrors('root.serverError')
    setSubmitted(false)

    // Guard: Turnstile widget must have produced a token
    if (!turnstileToken) {
      setError('root.serverError', { type: 'turnstile', message: t('errorTurnstile') })
      return
    }

    // POST the validated payload + token + active locale
    let body: PartnershipResponse
    try {
      const res = await fetch(PARTNERSHIP_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale, turnstileToken }),
      })
      body = (await res.json()) as PartnershipResponse
    } catch {
      setError('root.serverError', { type: 'network', message: t('errorNetwork') })
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      return
    }

    // Branch on the discriminated response
    if (body.ok) {
      posthog.capture('form_submitted', { form: 'partnership', locale })
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
                name='companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('companyLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('companyPlaceholder')}
                        autoComplete='organization'
                        maxLength={PARTNERSHIP_LIMITS.COMPANY_MAX}
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
                        maxLength={PARTNERSHIP_LIMITS.CONTACT_MAX}
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
                          maxLength={PARTNERSHIP_LIMITS.EMAIL_MAX}
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
                          maxLength={PARTNERSHIP_LIMITS.PHONE_MAX}
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
                        maxLength={PARTNERSHIP_LIMITS.MESSAGE_MAX}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
        </div>
      </div>
    </div>
  )
}
