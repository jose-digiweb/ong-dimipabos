'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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

import { SectionDescription } from './ui/section/SectionDescription'
import { SectionTitle } from './ui/section/SectionTitle'

/**
 * The {@link partnershipCopy} constant
 * @description Static Portuguese copy for the partnership form section
 */
const partnershipCopy = {
  SECTION_TITLE: 'Seja Nosso Parceiro',
  SECTION_DESCRIPTION:
    'Sua empresa pode fazer parte desta transformação social. Entre em contato conosco.',
  WHY_TITLE: 'Por que ser nosso parceiro?',
  TYPES_TITLE: 'Tipos de Parceria',
  COMPANY_LABEL: 'Nome da Empresa',
  COMPANY_PLACEHOLDER: 'Digite o nome da empresa',
  CONTACT_LABEL: 'Nome do Contato',
  CONTACT_PLACEHOLDER: 'Digite o nome do contato',
  EMAIL_LABEL: 'E-mail',
  EMAIL_PLACEHOLDER: 'Digite seu e-mail',
  PHONE_LABEL: 'Telefone',
  PHONE_PLACEHOLDER: 'Digite seu telefone',
  MESSAGE_LABEL: 'Mensagem',
  MESSAGE_PLACEHOLDER: 'Conte-nos sobre seu interesse em ser parceiro',
  SUBMIT_LABEL: 'Enviar Mensagem',
  COMPANY_ERROR: 'O nome da empresa deve ter pelo menos 2 caracteres.',
  CONTACT_ERROR: 'O nome do contato deve ter pelo menos 2 caracteres.',
  EMAIL_ERROR: 'Digite um e-mail válido.',
  PHONE_ERROR: 'Digite um número de telefone válido.',
  MESSAGE_ERROR: 'A mensagem deve ter pelo menos 10 caracteres.',
} as const

/**
 * The {@link partnershipBenefits} constant
 * @description Bullet list explaining why companies should partner with us
 */
const partnershipBenefits = [
  'Impacto social direto na Guiné-Bissau',
  'Visibilidade e reconhecimento como empresa socialmente responsável',
  'Relatórios detalhados sobre o impacto das ações',
  'Oportunidades de engajamento dos colaboradores',
] as const

/**
 * The {@link partnershipTypes} constant
 * @description Bullet list with the available partnership formats
 */
const partnershipTypes = [
  'Doações financeiras regulares',
  'Doações de materiais e equipamentos',
  'Voluntariado corporativo',
  'Projetos específicos e patrocínios',
] as const

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
 * The {@link partnershipSchema} constant
 * @description Zod schema for the partnership form payload
 */
const partnershipSchema = z.object({
  companyName: z.string().min(MIN_NAME_LENGTH, { message: partnershipCopy.COMPANY_ERROR }),
  contactName: z.string().min(MIN_NAME_LENGTH, { message: partnershipCopy.CONTACT_ERROR }),
  email: z.string().email({ message: partnershipCopy.EMAIL_ERROR }),
  phone: z.string().min(MIN_PHONE_LENGTH, { message: partnershipCopy.PHONE_ERROR }),
  message: z.string().min(MIN_MESSAGE_LENGTH, { message: partnershipCopy.MESSAGE_ERROR }),
})

/**
 * The {@link PartnershipFormValues} type
 * @description Inferred shape of the partnership form values
 */
type PartnershipFormValues = z.infer<typeof partnershipSchema>

/**
 * The {@link PartnershipForm} component
 * @description Renders the partnership pitch alongside its contact form
 * @returns The rendered partnership section
 */
export function PartnershipForm() {
  // Initialise the form with empty defaults
  const form = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: { companyName: '', contactName: '', email: '', phone: '', message: '' },
  })

  // Render the two-column partnership pitch and form
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <SectionTitle>{partnershipCopy.SECTION_TITLE}</SectionTitle>
        <SectionDescription>{partnershipCopy.SECTION_DESCRIPTION}</SectionDescription>
      </div>

      <div className='mt-16 grid gap-12 lg:grid-cols-2'>
        <div>
          <h3 className='font-bold text-xl'>{partnershipCopy.WHY_TITLE}</h3>

          <ul className='mt-6 space-y-4'>
            {partnershipBenefits.map((benefit) => (
              <li key={benefit} className='flex items-start'>
                <span className='mr-2 text-primary'>•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <h3 className='mt-12 font-bold text-xl'>{partnershipCopy.TYPES_TITLE}</h3>

          <ul className='mt-6 space-y-4'>
            {partnershipTypes.map((type) => (
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
                    <FormLabel>{partnershipCopy.COMPANY_LABEL}</FormLabel>
                    <FormControl>
                      <Input placeholder={partnershipCopy.COMPANY_PLACEHOLDER} {...field} />
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
                    <FormLabel>{partnershipCopy.CONTACT_LABEL}</FormLabel>
                    <FormControl>
                      <Input placeholder={partnershipCopy.CONTACT_PLACEHOLDER} {...field} />
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
                      <FormLabel>{partnershipCopy.EMAIL_LABEL}</FormLabel>
                      <FormControl>
                        <Input placeholder={partnershipCopy.EMAIL_PLACEHOLDER} {...field} />
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
                      <FormLabel>{partnershipCopy.PHONE_LABEL}</FormLabel>
                      <FormControl>
                        <Input placeholder={partnershipCopy.PHONE_PLACEHOLDER} {...field} />
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
                    <FormLabel>{partnershipCopy.MESSAGE_LABEL}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={partnershipCopy.MESSAGE_PLACEHOLDER}
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' variant='secondary'>
                {partnershipCopy.SUBMIT_LABEL}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
