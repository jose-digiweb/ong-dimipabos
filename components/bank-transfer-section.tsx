'use client'

import { Check, Copy, Landmark, Mail, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { SectionDescription, SectionTitle } from '@/components/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

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
 * The {@link BankAccountValueRow} type
 * @description Locale-independent value row used by the bank account list
 */
type BankAccountValueRow = {
  id: BankAccountField
  value: string
}

/**
 * The {@link bankAccountValueRows} constant
 * @description Locale-independent account values. Labels and the placeholder
 * bank name come from translations.
 */
const bankAccountValueRows: readonly BankAccountValueRow[] = [
  { id: bankAccountField.HOLDER, value: 'ONG DI MI PA BÔS' },
  { id: bankAccountField.BANK, value: '' },
  { id: bankAccountField.IBAN, value: 'PT50 0000 0000 0000 0000 0000 0' },
  { id: bankAccountField.BIC, value: 'XXXXPTPL' },
] as const

/**
 * The {@link COPY_FEEDBACK_MS} constant
 * @description How long the "copied" feedback state remains visible, in milliseconds
 */
const COPY_FEEDBACK_MS = 2000

/**
 * The {@link REFERENCE_FIELD_ID} constant
 * @description Identifier used to track the reference copy state separately from
 * the account rows
 */
const REFERENCE_FIELD_ID = 'reference'

/**
 * The {@link BankTransferSection} component
 * @description Renders the manual bank-transfer donation details with
 * copy-to-clipboard in the active locale
 * @returns The rendered bank-transfer section
 */
export function BankTransferSection() {
  // Read the locale-aware bank transfer translations
  const t = useTranslations('bankTransfer')

  // Track which field has just been copied so we can show transient feedback
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Resolve the labels for every account row
  const rowLabels = {
    [bankAccountField.HOLDER]: t('rowHolder'),
    [bankAccountField.BANK]: t('rowBank'),
    [bankAccountField.IBAN]: t('rowIban'),
    [bankAccountField.BIC]: t('rowBic'),
  } as const satisfies Record<BankAccountField, string>

  // Resolve the placeholder bank name for the active locale
  const bankPlaceholder = t('rowBankValue')

  // Resolve the suggested donation reference for the active locale
  const donationReference = t('donationReference')

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
        <SectionTitle>{t('sectionTitle')}</SectionTitle>
        <SectionDescription>{t('sectionDescription')}</SectionDescription>
      </div>

      <div className='mx-auto mt-16 max-w-2xl'>
        <Card>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <span className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <Landmark className='size-5' />
              </span>
              <div>
                <h3 className='font-medium text-base leading-snug'>{t('cardTitle')}</h3>
                <CardDescription>{t('cardDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            <dl className='divide-y divide-border rounded-lg border border-border'>
              {bankAccountValueRows.map((row) => {
                // Resolve the locale-aware label for the row
                const label = rowLabels[row.id]

                // Use the localized bank placeholder when the row value is empty
                const value = row.id === bankAccountField.BANK ? bankPlaceholder : row.value

                // Track whether this row was just copied
                const isCopied = copiedField === row.id

                // Render the account row with a copy button
                return (
                  <div
                    key={row.id}
                    className='flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between'
                  >
                    <div className='flex flex-col'>
                      <dt className='text-muted-foreground text-xs uppercase tracking-wide'>
                        {label}
                      </dt>
                      <dd className='font-mono font-medium text-foreground text-sm'>{value}</dd>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => handleCopy(row.id, value)}
                      aria-label={`${t('copyLabel')} ${label}`}
                    >
                      {isCopied ? <Check className='size-4' /> : <Copy className='size-4' />}
                      <span>{isCopied ? t('copiedLabel') : t('copyLabel')}</span>
                    </Button>
                  </div>
                )
              })}
            </dl>

            <div className='rounded-lg border border-border bg-muted/40 p-4'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex flex-col'>
                  <p className='font-semibold text-foreground text-sm'>{t('referenceTitle')}</p>
                  <p className='font-mono text-foreground text-sm'>{donationReference}</p>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => handleCopy(REFERENCE_FIELD_ID, donationReference)}
                  aria-label={`${t('copyLabel')} ${t('referenceTitle')}`}
                >
                  {copiedField === REFERENCE_FIELD_ID ? (
                    <Check className='size-4' />
                  ) : (
                    <Copy className='size-4' />
                  )}
                  <span>
                    {copiedField === REFERENCE_FIELD_ID ? t('copiedLabel') : t('copyLabel')}
                  </span>
                </Button>
              </div>
              <p className='mt-3 text-muted-foreground text-sm'>{t('referenceHint')}</p>
            </div>

            <div className='rounded-lg bg-muted p-4'>
              <div className='flex items-center gap-2'>
                <Mail className='size-5 text-primary' />
                <h4 className='font-semibold text-foreground'>{t('instructionsTitle')}</h4>
              </div>
              <p className='mt-2 text-foreground/80 text-sm'>{t('instructionsBody')}</p>
            </div>

            <div className='rounded-lg border border-border p-4'>
              <div className='flex items-center gap-2'>
                <ShieldCheck className='size-5 text-green-600' />
                <h4 className='font-semibold text-foreground'>{t('trustHeading')}</h4>
              </div>
              <ul className='mt-3 space-y-2 text-foreground/80 text-sm'>
                <li>• {t('trustFunds')}</li>
                <li>• {t('trustTransparency')}</li>
                <li>• {t('trustReceipt')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
