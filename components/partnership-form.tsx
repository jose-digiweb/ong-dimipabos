'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
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
 * The {@link PartnershipForm} component
 * @description Renders the partnership pitch alongside its contact form in the
 * active locale
 * @returns The rendered partnership section
 */
export function PartnershipForm() {
  // Read the locale-aware partnership form translations
  const t = useTranslations('partnershipForm')

  // Read the benefits and types as typed string arrays
  const benefits = t.raw('benefits') as readonly string[]
  const types = t.raw('types') as readonly string[]

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
    defaultValues: { companyName: '', contactName: '', email: '', phone: '', message: '' },
  })

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
            {benefits.map((benefit) => (
              <li key={benefit} className='flex items-start'>
                <span className='mr-2 text-primary'>•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <h3 className='mt-12 font-bold text-xl'>{t('typesTitle')}</h3>

          <ul className='mt-6 space-y-4'>
            {types.map((type) => (
              <li key={type} className='flex items-start'>
                <span className='mr-2 text-primary'>•</span>
                <span>{type}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Form {...form}>
            <form className='space-y-8'>
              <FormField
                control={form.control}
                name='companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('companyLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('companyPlaceholder')} {...field} />
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
                      <Input placeholder={t('contactPlaceholder')} {...field} />
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
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('messageLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('messagePlaceholder')}
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
    </div>
  )
}
