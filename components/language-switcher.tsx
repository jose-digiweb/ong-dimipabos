'use client'

import { useTransition } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Locale } from '@/i18n/config'
import { localeFlags, localeLabels, locales } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'

/**
 * The {@link LanguageSwitcher} component
 * @description Locale dropdown shown in the header. Navigates to the same
 * pathname under the selected locale, preserving search params.
 * @returns The rendered switcher
 */
export function LanguageSwitcher() {
  // Read i18n state and routing helpers
  const t = useTranslations('languageSwitcher')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  // Track router pushes so we can disable the trigger while transitioning
  const [isPending, startTransition] = useTransition()

  // Handle a locale change by replacing the current route under the new locale
  const onLocaleChange = (next: Locale | null) => {
    // Ignore null clears emitted by the underlying select primitive
    if (next === null) return

    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  // Render the select with one option per supported locale
  return (
    <Select value={locale} onValueChange={onLocaleChange}>
      <SelectTrigger
        size='sm'
        aria-label={t('select')}
        disabled={isPending}
        className='border-white/30 bg-transparent text-white hover:bg-white/10'
      >
        <SelectValue>
          <span aria-hidden='true'>{localeFlags[locale]}</span>
          <span className='font-medium uppercase'>{locale}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((code) => (
          <SelectItem key={code} value={code}>
            <span aria-hidden='true' className='mr-2'>
              {localeFlags[code]}
            </span>
            {localeLabels[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
