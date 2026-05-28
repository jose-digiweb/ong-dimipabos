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
 * @description Ordered list of area keys used to build select options
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
 * The {@link VolunteerForm} component
 * @description Renders the volunteer application form in the active locale
 * @returns The rendered volunteer form section
 */
export function VolunteerForm() {
  // Read the locale-aware volunteer form translations
  const t = useTranslations('volunteerForm')

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
        area: z.string({ error: t('areaError') }),
        availability: z.string().min(MIN_NAME_LENGTH, { message: t('availabilityError') }),
        experience: z.string(),
        terms: z.boolean().refine((val) => val === true, { message: t('termsError') }),
      }),
    [t],
  )

  // Initialise the form with empty defaults
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      availability: '',
      experience: '',
      terms: false,
    },
  })

  // Voluntarily skip silencing — keep keys referenced for unused volunteerAreaKeys
  void volunteerAreaKeys

  // Render the centred title plus the multi-field form
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <SectionTitle>{t('sectionTitle')}</SectionTitle>
        <SectionDescription>{t('sectionDescription')}</SectionDescription>
      </div>

      <div className='mt-16'>
        <Form {...form}>
          <form className='space-y-8'>
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

            <div className='grid gap-8 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('emailLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('emailPlaceholder')} {...field} />
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
                      <Input placeholder={t('phonePlaceholder')} {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <Button type='submit' variant='secondary'>
              {t('submitLabel')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
