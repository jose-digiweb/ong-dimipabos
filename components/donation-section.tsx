'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Info, Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { CTAButton } from './cta'
import { SectionDescription } from './ui/section/SectionDescription'
import { SectionTitle } from './ui/section/SectionTitle'

/**
 * The {@link donationFrequency} constant
 * @description Donation frequency values used by the form radio group
 */
const donationFrequency = {
  SINGLE: 'single',
  MONTHLY: 'monthly',
} as const

/**
 * The {@link DonationFrequency} type
 * @description Allowed donation frequency values
 */
type DonationFrequency = (typeof donationFrequency)[keyof typeof donationFrequency]

/**
 * The {@link donationCopy} constant
 * @description Static Portuguese copy for the donation section
 */
const donationCopy = {
  SECTION_TITLE: 'Faça Sua Doação',
  SECTION_DESCRIPTION:
    'Sua contribuição é fundamental para construirmos o centro de acolhimento. Cada euro doado é investido diretamente na construção.',
  CARD_TITLE: 'Valor da Doação',
  CARD_DESCRIPTION: 'Escolha quanto e como deseja doar',
  AMOUNT_PLACEHOLDER: '50,00',
  CURRENCY_SYMBOL: '€',
  AMOUNT_TOOLTIP: 'Qualquer valor é bem-vindo e faz a diferença!',
  SINGLE_LABEL: 'Doação Única',
  MONTHLY_LABEL: 'Doação Mensal',
  MONTHLY_HINT: '💫 Doe mensalmente e seja um agente de mudança contínua',
  TRUST_HEADING: 'Sua doação em boas mãos:',
  TRUST_FUNDS: '100% dos fundos são destinados à construção do centro de acolhimento',
  TRUST_SECURITY: 'Pagamentos processados com segurança e criptografia',
  TRUST_RECEIPT: 'Recibo enviado automaticamente para seu e-mail',
  SUBMIT_LABEL: 'Prosseguir para Pagamento',
  AMOUNT_REQUIRED: 'Por favor, insira um valor para doação.',
} as const

/**
 * The {@link donationSchema} constant
 * @description Zod schema for the donation form payload
 */
const donationSchema = z.object({
  amount: z.string().min(1, { message: donationCopy.AMOUNT_REQUIRED }),
  frequency: z.enum([donationFrequency.SINGLE, donationFrequency.MONTHLY]),
})

/**
 * The {@link DonationFormValues} type
 * @description Inferred shape of the donation form values
 */
type DonationFormValues = z.infer<typeof donationSchema>

/**
 * The {@link DonationSection} component
 * @description Renders the donation amount/frequency selection card
 * @returns The rendered donation section
 */
export function DonationSection() {
  // Initialise the donation form with a default monthly frequency
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: { frequency: donationFrequency.MONTHLY },
  })

  // Render the donation section content
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <SectionTitle>{donationCopy.SECTION_TITLE}</SectionTitle>
        <SectionDescription>{donationCopy.SECTION_DESCRIPTION}</SectionDescription>
      </div>

      <div className='mt-16'>
        <form className='space-y-8'>
          <Card>
            <CardHeader>
              <CardTitle>{donationCopy.CARD_TITLE}</CardTitle>
              <CardDescription>{donationCopy.CARD_DESCRIPTION}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                  <div className='relative flex-1'>
                    <Input
                      type='text'
                      placeholder={donationCopy.AMOUNT_PLACEHOLDER}
                      className='pl-6'
                      {...form.register('amount')}
                    />
                    <span className='-translate-y-1/2 absolute top-1/2 left-2 text-muted-foreground'>
                      {donationCopy.CURRENCY_SYMBOL}
                    </span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<Button variant='ghost' size='icon' />}>
                        <Info className='h-4 w-4' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{donationCopy.AMOUNT_TOOLTIP}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className='space-y-4'>
                  <RadioGroup
                    defaultValue={donationFrequency.MONTHLY}
                    onValueChange={(value) =>
                      form.setValue('frequency', value as DonationFrequency)
                    }
                  >
                    <div className='flex flex-col gap-4 sm:flex-row'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          value={donationFrequency.SINGLE}
                          id={donationFrequency.SINGLE}
                        />
                        <Label htmlFor={donationFrequency.SINGLE}>
                          {donationCopy.SINGLE_LABEL}
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          value={donationFrequency.MONTHLY}
                          id={donationFrequency.MONTHLY}
                        />
                        <Label htmlFor={donationFrequency.MONTHLY}>
                          {donationCopy.MONTHLY_LABEL}
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <p className='text-muted-foreground text-sm'>{donationCopy.MONTHLY_HINT}</p>
                </div>

                <div className='rounded-lg bg-muted p-4'>
                  <div className='flex items-start gap-2 sm:items-center'>
                    <Shield className='mt-1 size-5 shrink-0 text-green-500 sm:mt-0' />
                    <h4 className='font-semibold'>{donationCopy.TRUST_HEADING}</h4>
                  </div>
                  <ul className='mt-4 space-y-2'>
                    <li className='flex items-start gap-2 sm:items-center'>
                      <CheckCircle2 className='mt-1 size-4 shrink-0 text-green-500 sm:mt-0' />
                      <span className='text-sm'>{donationCopy.TRUST_FUNDS}</span>
                    </li>
                    <li className='flex items-start gap-2 sm:items-center'>
                      <CheckCircle2 className='mt-1 size-4 shrink-0 text-green-500 sm:mt-0' />
                      <span className='text-sm'>{donationCopy.TRUST_SECURITY}</span>
                    </li>
                    <li className='flex items-start gap-2 sm:items-center'>
                      <CheckCircle2 className='mt-1 size-4 shrink-0 text-green-500 sm:mt-0' />
                      <span className='text-sm'>{donationCopy.TRUST_RECEIPT}</span>
                    </li>
                  </ul>
                </div>

                <CTAButton
                  text={donationCopy.SUBMIT_LABEL}
                  className='mt-6 max-w-min py-6 text-[1em]'
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
