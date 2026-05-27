'use client'

import { Check, Copy, Landmark, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionDescription, SectionTitle } from '@/components/ui/section'

/**
 * The {@link bankTransferCopy} constant
 * @description Static Portuguese copy for the bank-transfer donation section
 */
const bankTransferCopy = {
  SECTION_TITLE: 'Faça Sua Doação',
  SECTION_DESCRIPTION:
    'No momento, recebemos doações por transferência bancária. Utilize os dados abaixo para contribuir e ajudar a construir o centro de acolhimento.',
  CARD_TITLE: 'Dados Bancários',
  CARD_DESCRIPTION: 'Use estes dados para realizar a sua transferência.',
  COPY_LABEL: 'Copiar',
  COPIED_LABEL: 'Copiado',
  REFERENCE_TITLE: 'Sugestão de referência',
  REFERENCE_HINT:
    'Inclua a referência abaixo, substituindo "Seu Nome" pelo seu nome, para que possamos identificar e agradecer a sua doação.',
  INSTRUCTIONS_TITLE: 'Após a transferência',
  INSTRUCTIONS_BODY:
    'Envie o comprovativo para donativos@ongdimipabos.org para receber o nosso agradecimento e, se desejar, um recibo da contribuição.',
  CONTACT_EMAIL: 'donativos@ongdimipabos.org',
  TRUST_HEADING: 'A sua contribuição em boas mãos:',
  TRUST_FUNDS: '100% dos fundos são destinados aos projetos da ONG.',
  TRUST_TRANSPARENCY: 'Prestação de contas transparente aos doadores e parceiros.',
  TRUST_RECEIPT: 'Recibo enviado a pedido, após confirmação da transferência.',
} as const

/**
 * The {@link bankAccountField} constant
 * @description Field identifiers for the bank account details
 */
const bankAccountField = {
  HOLDER: 'holder',
  BANK: 'bank',
  IBAN: 'iban',
  BIC: 'bic',
} as const

/**
 * The {@link BankAccountField} type
 * @description Allowed bank account field identifiers
 */
type BankAccountField = (typeof bankAccountField)[keyof typeof bankAccountField]

/**
 * The {@link BankAccountRow} type
 * @description Shape of a row rendered in the bank account details list
 */
type BankAccountRow = {
  id: BankAccountField
  label: string
  value: string
}

/**
 * The {@link bankAccountRows} constant
 * @description Mock bank account rows shown until real details are provided
 */
const bankAccountRows: readonly BankAccountRow[] = [
  { id: bankAccountField.HOLDER, label: 'Titular', value: 'ONG DI MI PA BÔS' },
  { id: bankAccountField.BANK, label: 'Banco', value: 'Banco a definir' },
  { id: bankAccountField.IBAN, label: 'IBAN', value: 'PT50 0000 0000 0000 0000 0000 0' },
  { id: bankAccountField.BIC, label: 'BIC / SWIFT', value: 'XXXXPTPL' },
] as const

/**
 * The {@link DONATION_REFERENCE} constant
 * @description Suggested reference text donors should include in their transfer
 */
const DONATION_REFERENCE = 'Donativo - Seu Nome'

/**
 * The {@link COPY_FEEDBACK_MS} constant
 * @description How long the "copied" feedback state remains visible, in milliseconds
 */
const COPY_FEEDBACK_MS = 2000

/**
 * The {@link BankTransferSection} component
 * @description Renders the manual bank-transfer donation details with copy-to-clipboard
 * @returns The rendered bank-transfer section
 */
export function BankTransferSection() {
  // Track which field has just been copied so we can show transient feedback
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Copy the given value to the clipboard and surface transient feedback
  const handleCopy = async (id: string, value: string) => {
    // Guard against environments without clipboard access
    if (!navigator.clipboard) return

    // Write the value and toggle the copied indicator
    await navigator.clipboard.writeText(value)
    setCopiedField(id)

    // Reset the indicator after the feedback window
    setTimeout(() => setCopiedField(null), COPY_FEEDBACK_MS)
  }

  // Render the bank-transfer card and trust block
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <SectionTitle>{bankTransferCopy.SECTION_TITLE}</SectionTitle>
        <SectionDescription>{bankTransferCopy.SECTION_DESCRIPTION}</SectionDescription>
      </div>

      <div className='mx-auto mt-16 max-w-2xl'>
        <Card>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <span className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <Landmark className='size-5' />
              </span>
              <div>
                <CardTitle>{bankTransferCopy.CARD_TITLE}</CardTitle>
                <CardDescription>{bankTransferCopy.CARD_DESCRIPTION}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            <dl className='divide-y divide-border rounded-lg border border-border'>
              {bankAccountRows.map((row) => {
                const isCopied = copiedField === row.id

                return (
                  <div
                    key={row.id}
                    className='flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between'
                  >
                    <div className='flex flex-col'>
                      <dt className='text-muted-foreground text-xs uppercase tracking-wide'>
                        {row.label}
                      </dt>
                      <dd className='font-mono font-medium text-foreground text-sm'>{row.value}</dd>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => handleCopy(row.id, row.value)}
                      aria-label={`${bankTransferCopy.COPY_LABEL} ${row.label}`}
                    >
                      {isCopied ? <Check className='size-4' /> : <Copy className='size-4' />}
                      <span>
                        {isCopied ? bankTransferCopy.COPIED_LABEL : bankTransferCopy.COPY_LABEL}
                      </span>
                    </Button>
                  </div>
                )
              })}
            </dl>

            <div className='rounded-lg border border-border bg-muted/40 p-4'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex flex-col'>
                  <p className='font-semibold text-foreground text-sm'>
                    {bankTransferCopy.REFERENCE_TITLE}
                  </p>
                  <p className='font-mono text-foreground text-sm'>{DONATION_REFERENCE}</p>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => handleCopy('reference', DONATION_REFERENCE)}
                  aria-label={`${bankTransferCopy.COPY_LABEL} ${bankTransferCopy.REFERENCE_TITLE}`}
                >
                  {copiedField === 'reference' ? (
                    <Check className='size-4' />
                  ) : (
                    <Copy className='size-4' />
                  )}
                  <span>
                    {copiedField === 'reference'
                      ? bankTransferCopy.COPIED_LABEL
                      : bankTransferCopy.COPY_LABEL}
                  </span>
                </Button>
              </div>
              <p className='mt-3 text-muted-foreground text-sm'>
                {bankTransferCopy.REFERENCE_HINT}
              </p>
            </div>

            <div className='rounded-lg bg-muted p-4'>
              <div className='flex items-center gap-2'>
                <Mail className='size-5 text-primary' />
                <h4 className='font-semibold text-foreground'>
                  {bankTransferCopy.INSTRUCTIONS_TITLE}
                </h4>
              </div>
              <p className='mt-2 text-foreground/80 text-sm'>
                {bankTransferCopy.INSTRUCTIONS_BODY}
              </p>
            </div>

            <div className='rounded-lg border border-border p-4'>
              <div className='flex items-center gap-2'>
                <ShieldCheck className='size-5 text-green-600' />
                <h4 className='font-semibold text-foreground'>{bankTransferCopy.TRUST_HEADING}</h4>
              </div>
              <ul className='mt-3 space-y-2 text-foreground/80 text-sm'>
                <li>• {bankTransferCopy.TRUST_FUNDS}</li>
                <li>• {bankTransferCopy.TRUST_TRANSPARENCY}</li>
                <li>• {bankTransferCopy.TRUST_RECEIPT}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
