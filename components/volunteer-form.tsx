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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { SectionDescription } from './section/SectionDescription'
import { SectionTitle } from './section/SectionTitle'

/**
 * The {@link volunteerArea} constant
 * @description Available areas of interest for volunteer applications
 */
const volunteerArea = {
  CONSTRUCTION: 'construction',
  EDUCATION: 'education',
  HEALTH: 'health',
  SOCIAL: 'social',
  ADMIN: 'admin',
} as const

/**
 * The {@link VolunteerArea} type
 * @description Allowed volunteer area values
 */
type VolunteerArea = (typeof volunteerArea)[keyof typeof volunteerArea]

/**
 * The {@link volunteerAreaKeys} constant
 * @description Ordered list of area keys used to build select options and the schema enum
 */
const volunteerAreaKeys = [
  volunteerArea.CONSTRUCTION,
  volunteerArea.EDUCATION,
  volunteerArea.HEALTH,
  volunteerArea.SOCIAL,
  volunteerArea.ADMIN,
] as const

/**
 * The {@link MIN_NAME_LENGTH} constant
 * @description Minimum length for the name and availability fields
 */
const MIN_NAME_LENGTH = 2

/**
 * The {@link MIN_PHONE_LENGTH} constant
 * @description Minimum length for the phone field
 */
const MIN_PHONE_LENGTH = 8

/**
 * The {@link MAX_NAME_LENGTH} constant
 * @description Maximum length for the name field
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
 * The {@link MAX_AVAILABILITY_LENGTH} constant
 * @description Maximum length for the availability field
 */
const MAX_AVAILABILITY_LENGTH = 500

/**
 * The {@link MAX_EXPERIENCE_LENGTH} constant
 * @description Maximum length for the experience field
 */
const MAX_EXPERIENCE_LENGTH = 1500

/**
 * The {@link VolunteerFormValues} type
 * @description Shape of the volunteer form values
 */
type VolunteerFormValues = {
  name: string
  email: string
  phone: string
  area: string
  availability: string
  experience: string
  terms: boolean
}

/**
 * The {@link VOLUNTEER_DEFAULTS} constant
 * @description Empty initial values for every controlled field
 */
const VOLUNTEER_DEFAULTS: VolunteerFormValues = {
  name: '',
  email: '',
  phone: '',
  area: '',
  availability: '',
  experience: '',
  terms: false,
}

/**
 * The {@link VolunteerForm} component
 * @description Renders the volunteer application form in the active locale.
 * Submission is not yet wired to a backend; the handler surfaces a friendly
 * notice via `setError('root.serverError', ...)`.
 * @returns The rendered volunteer form section
 */
export function VolunteerForm() {
  // Read the locale-aware copy
  const t = useTranslations('volunteerForm')
  const tCommon = useTranslations('common')

  // Build the area options for the select using locale-aware labels
  const areaOptions = useMemo(
    () =>
      [
        { value: volunteerArea.CONSTRUCTION, label: t('areaConstruction') },
        { value: volunteerArea.EDUCATION, label: t('areaEducation') },
        { value: volunteerArea.HEALTH, label: t('areaHealth') },
        { value: volunteerArea.SOCIAL, label: t('areaSocial') },
        { value: volunteerArea.ADMIN, label: t('areaAdmin') },
      ] as const satisfies readonly { value: VolunteerArea; label: string }[],
    [t],
  )

  // Build the schema bound to the active locale messages
  const volunteerSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(MIN_NAME_LENGTH, { message: t('nameError') }),
        email: z.string().email({ message: t('emailError') }),
        phone: z.string().min(MIN_PHONE_LENGTH, { message: t('phoneError') }),
        area: z
          .string()
          .refine((value) => (volunteerAreaKeys as readonly string[]).includes(value), {
            message: t('areaError'),
          }),
        availability: z.string().min(MIN_NAME_LENGTH, { message: t('availabilityError') }),
        experience: z.string(),
        terms: z.boolean().refine((val) => val === true, { message: t('termsError') }),
      }),
    [t],
  )

  // Initialise the form with empty defaults
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: VOLUNTEER_DEFAULTS,
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

  // Render the centred title plus the multi-field form
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <SectionTitle>{t('sectionTitle')}</SectionTitle>
        <SectionDescription>{t('sectionDescription')}</SectionDescription>
      </div>

      <div className='mt-16'>
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
              name='area'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('areaLabel')}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={(open) => {
                      if (!open) field.onBlur()
                    }}
                  >
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
                      className='resize-none'
                      maxLength={MAX_AVAILABILITY_LENGTH}
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
                      className='resize-none'
                      maxLength={MAX_EXPERIENCE_LENGTH}
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

            <Button type='submit' variant='secondary' disabled={isSubmitting}>
              {isSubmitting ? tCommon('formSubmitting') : t('submitLabel')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
