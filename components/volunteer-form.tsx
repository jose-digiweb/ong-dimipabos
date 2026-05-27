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
 * The {@link volunteerCopy} constant
 * @description Static Portuguese copy for the volunteer form
 */
const volunteerCopy = {
  SECTION_TITLE: 'Seja um Voluntário',
  SECTION_DESCRIPTION: 'Dedique seu tempo e habilidades para fazer a diferença na vida de alguém.',
  NAME_LABEL: 'Nome Completo',
  NAME_PLACEHOLDER: 'Digite seu nome',
  EMAIL_LABEL: 'E-mail',
  EMAIL_PLACEHOLDER: 'Digite seu e-mail',
  PHONE_LABEL: 'Telefone',
  PHONE_PLACEHOLDER: 'Digite seu telefone',
  AREA_LABEL: 'Área de Interesse',
  AREA_PLACEHOLDER: 'Selecione uma área',
  AREA_CONSTRUCTION: 'Construção',
  AREA_EDUCATION: 'Educação',
  AREA_HEALTH: 'Saúde',
  AREA_SOCIAL: 'Assistência Social',
  AREA_ADMIN: 'Administrativo',
  AVAILABILITY_LABEL: 'Disponibilidade',
  AVAILABILITY_PLACEHOLDER: 'Descreva sua disponibilidade (dias e horários)',
  EXPERIENCE_LABEL: 'Experiência',
  EXPERIENCE_PLACEHOLDER: 'Conte-nos sobre suas experiências relevantes (opcional)',
  TERMS_LABEL:
    'Concordo em receber comunicações da DI MI PA BÔS e aceito os termos de uso e política de privacidade.',
  SUBMIT_LABEL: 'Enviar Inscrição',
  NAME_ERROR: 'O nome deve ter pelo menos 2 caracteres.',
  EMAIL_ERROR: 'Digite um e-mail válido.',
  PHONE_ERROR: 'Digite um número de telefone válido.',
  AREA_ERROR: 'Selecione uma área de interesse.',
  AVAILABILITY_ERROR: 'Descreva sua disponibilidade.',
  TERMS_ERROR: 'Você deve aceitar os termos.',
} as const

/**
 * The {@link volunteerAreaOptions} constant
 * @description Renderable area-of-interest options for the volunteer select
 */
const volunteerAreaOptions = [
  { value: volunteerArea.CONSTRUCTION, label: volunteerCopy.AREA_CONSTRUCTION },
  { value: volunteerArea.EDUCATION, label: volunteerCopy.AREA_EDUCATION },
  { value: volunteerArea.HEALTH, label: volunteerCopy.AREA_HEALTH },
  { value: volunteerArea.SOCIAL, label: volunteerCopy.AREA_SOCIAL },
  { value: volunteerArea.ADMIN, label: volunteerCopy.AREA_ADMIN },
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
 * The {@link volunteerSchema} constant
 * @description Zod schema for the volunteer form payload
 */
const volunteerSchema = z.object({
  name: z.string().min(MIN_NAME_LENGTH, { message: volunteerCopy.NAME_ERROR }),
  email: z.string().email({ message: volunteerCopy.EMAIL_ERROR }),
  phone: z.string().min(MIN_PHONE_LENGTH, { message: volunteerCopy.PHONE_ERROR }),
  area: z.string({ error: volunteerCopy.AREA_ERROR }),
  availability: z.string().min(MIN_NAME_LENGTH, { message: volunteerCopy.AVAILABILITY_ERROR }),
  experience: z.string(),
  terms: z.boolean().refine((val) => val === true, { message: volunteerCopy.TERMS_ERROR }),
})

/**
 * The {@link VolunteerFormValues} type
 * @description Inferred shape of the volunteer form values
 */
type VolunteerFormValues = z.infer<typeof volunteerSchema>

/**
 * The {@link VolunteerForm} component
 * @description Renders the volunteer application form
 * @returns The rendered volunteer form section
 */
export function VolunteerForm() {
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

  // Render the centred title plus the multi-field form
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <SectionTitle>{volunteerCopy.SECTION_TITLE}</SectionTitle>
        <SectionDescription>{volunteerCopy.SECTION_DESCRIPTION}</SectionDescription>
      </div>

      <div className='mt-16'>
        <Form {...form}>
          <form className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{volunteerCopy.NAME_LABEL}</FormLabel>
                  <FormControl>
                    <Input placeholder={volunteerCopy.NAME_PLACEHOLDER} {...field} />
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
                    <FormLabel>{volunteerCopy.EMAIL_LABEL}</FormLabel>
                    <FormControl>
                      <Input placeholder={volunteerCopy.EMAIL_PLACEHOLDER} {...field} />
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
                    <FormLabel>{volunteerCopy.PHONE_LABEL}</FormLabel>
                    <FormControl>
                      <Input placeholder={volunteerCopy.PHONE_PLACEHOLDER} {...field} />
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
                  <FormLabel>{volunteerCopy.AREA_LABEL}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={volunteerCopy.AREA_PLACEHOLDER} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {volunteerAreaOptions.map((option) => (
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
                  <FormLabel>{volunteerCopy.AVAILABILITY_LABEL}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={volunteerCopy.AVAILABILITY_PLACEHOLDER}
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
                  <FormLabel>{volunteerCopy.EXPERIENCE_LABEL}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={volunteerCopy.EXPERIENCE_PLACEHOLDER}
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
                    <FormLabel>{volunteerCopy.TERMS_LABEL}</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type='submit' variant='secondary'>
              {volunteerCopy.SUBMIT_LABEL}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
