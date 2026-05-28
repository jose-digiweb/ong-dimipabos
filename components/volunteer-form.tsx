'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import posthog from 'posthog-js'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SectionDescription, SectionTitle } from '@/components/section'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Locale } from '@/i18n/config'
import {
  VOLUNTEER_LIMITS,
  type VolunteerArea,
  type VolunteerErrorCode,
  type VolunteerPayload,
  type VolunteerResponse,
  buildVolunteerSchema,
  volunteerAreaKeys,
  volunteerErrorCode,
} from '@/lib/forms/volunteer-schema'

/**
 * The {@link VOLUNTEER_API_PATH} constant
 * @description Endpoint the form submits to
 */
const VOLUNTEER_API_PATH = '/api/forms/volunteer'

/**
 * The {@link VOLUNTEER_DEFAULTS} constant
 * @description Empty initial values for every controlled field
 */
const VOLUNTEER_DEFAULTS: VolunteerPayload = {
  name: '',
  email: '',
  phone: '',
  area: '',
  availability: '',
  experience: '',
  terms: false,
}

/**
 * The {@link areaLabelKey} constant
 * @description Maps area enum values to translation keys under `volunteerForm`
 */
const areaLabelKey: Record<VolunteerArea, string> = {
  construction: 'areaConstruction',
  education: 'areaEducation',
  health: 'areaHealth',
  social: 'areaSocial',
  admin: 'areaAdmin',
}

/**
 * The {@link errorCodeToMessageKey} constant
 * @description Maps wire-level error codes to translation keys under `volunteerForm`
 */
const errorCodeToMessageKey: Record<VolunteerErrorCode, string> = {
  [volunteerErrorCode.VALIDATION]: 'errorValidation',
  [volunteerErrorCode.TURNSTILE]: 'errorTurnstile',
  [volunteerErrorCode.RATE_LIMIT]: 'errorRateLimit',
  [volunteerErrorCode.EMAIL_FAILED]: 'errorEmailFailed',
  [volunteerErrorCode.STORAGE_FAILED]: 'errorStorageFailed',
  [volunteerErrorCode.UNKNOWN]: 'errorUnknown',
}

/**
 * The {@link VolunteerForm} component
 * @description Public volunteer application form. Validates with a locale-aware
 * zod schema, verifies a Cloudflare Turnstile token, then POSTs to
 * `/api/forms/volunteer` which persists the submission and dispatches an email.
 * @returns The rendered volunteer form
 */
export function VolunteerForm() {
  // Read the locale-aware copy
  const t = useTranslations('volunteerForm')
  const tCommon = useTranslations('common')
  const locale = useLocale() as Locale

  // Public Turnstile site key (Next.js inlines NEXT_PUBLIC_* at build time)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  // Build the zod schema bound to the active locale messages
  const volunteerSchema = useMemo(() => buildVolunteerSchema(t), [t])

  // Build the localized area options once per translator
  const areaOptions = useMemo(
    () => volunteerAreaKeys.map((value) => ({ value, label: t(areaLabelKey[value]) })),
    [t],
  )

  // Initialise the form with empty defaults
  const form = useForm<VolunteerPayload>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: VOLUNTEER_DEFAULTS,
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
  const onSubmit = async (values: VolunteerPayload) => {
    clearErrors('root.serverError')
    setSubmitted(false)

    // Guard: Turnstile widget must have produced a token
    if (!turnstileToken) {
      setError('root.serverError', { type: 'turnstile', message: t('errorTurnstile') })
      return
    }

    // POST the validated payload + token + active locale
    let body: VolunteerResponse
    try {
      const res = await fetch(VOLUNTEER_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale, turnstileToken }),
      })
      body = (await res.json()) as VolunteerResponse
    } catch {
      setError('root.serverError', { type: 'network', message: t('errorNetwork') })
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      return
    }

    // Branch on the discriminated response
    if (body.ok) {
      posthog.capture('form_submitted', { form: 'volunteer', locale, area: values.area })
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

  // Render the volunteer form
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <SectionTitle>{t('sectionTitle')}</SectionTitle>
      <SectionDescription>{t('sectionDescription')}</SectionDescription>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8 space-y-8' noValidate>
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
                    maxLength={VOLUNTEER_LIMITS.NAME_MAX}
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
                    maxLength={VOLUNTEER_LIMITS.EMAIL_MAX}
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
                    maxLength={VOLUNTEER_LIMITS.PHONE_MAX}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='area'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('areaLabel')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('areaPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {areaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
                <FormLabel>{t('availabilityLabel')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('availabilityPlaceholder')}
                    className='min-h-24 resize-none'
                    maxLength={VOLUNTEER_LIMITS.AVAILABILITY_MAX}
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
                <FormLabel>{t('experienceLabel')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('experiencePlaceholder')}
                    className='min-h-24 resize-none'
                    maxLength={VOLUNTEER_LIMITS.EXPERIENCE_MAX}
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
                  <FormLabel>{t('termsLabel')}</FormLabel>
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
    </div>
  )
}
