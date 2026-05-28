'use client'

import { useTransition } from 'react'

import type { Locale } from '@/i18n/config'
import { locales } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

/**
 * The {@link languageSwitcherTone} constant
 * @description Visual tones the {@link LanguageSwitcher} supports
 */
export const languageSwitcherTone = {
  ON_DARK: 'onDark',
  ON_LIGHT: 'onLight',
} as const

/**
 * The {@link LanguageSwitcherTone} type
 * @description Union of values from {@link languageSwitcherTone}
 */
export type LanguageSwitcherTone = (typeof languageSwitcherTone)[keyof typeof languageSwitcherTone]

/**
 * The {@link toneClasses} constant
 * @description Tone-specific class fragments for the container and active pill
 */
const toneClasses = {
  [languageSwitcherTone.ON_DARK]: {
    container: 'border border-white/20 bg-white/5 backdrop-blur-sm',
    inactive: 'text-white/70 hover:text-white',
    active: 'text-primary',
    indicator: 'bg-white shadow-sm',
  },
  [languageSwitcherTone.ON_LIGHT]: {
    container: 'border border-foreground/10 bg-foreground/5',
    inactive: 'text-foreground/60 hover:text-foreground',
    active: 'text-white',
    indicator: 'bg-primary shadow-sm',
  },
} as const satisfies Record<LanguageSwitcherTone, Record<string, string>>

/**
 * The {@link Props} type
 * @description Props for the {@link LanguageSwitcher} component
 */
type Props = {
  tone?: LanguageSwitcherTone
  className?: string
}

/**
 * The {@link LanguageSwitcher} component
 * @description Segmented pill toggle that swaps between supported locales while
 * preserving the current pathname. Renders one button per locale with an
 * animated indicator behind the active option.
 * @param {Props} props - The component props
 * @param {LanguageSwitcherTone} [props.tone] - Visual tone for dark or light surfaces
 * @param {string} [props.className] - Optional className for the outer container
 * @returns The rendered switcher
 */
export function LanguageSwitcher({ tone = languageSwitcherTone.ON_DARK, className }: Props) {
  // Read i18n state and routing helpers
  const t = useTranslations('languageSwitcher')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  // Track router pushes so we can dim the control while transitioning
  const [isPending, startTransition] = useTransition()

  // Compute the index of the active locale to position the sliding indicator
  const activeIndex = locales.indexOf(locale)

  // Resolve the tone-specific classes once per render
  const styles = toneClasses[tone]

  // Handle a locale change by replacing the current route under the new locale
  const onSelect = (next: Locale) => {
    // Skip when the user clicks the already-active locale
    if (next === locale) return

    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  // Render the segmented control
  return (
    <div
      role='radiogroup'
      aria-label={t('select')}
      className={cn(
        'relative inline-flex items-center rounded-full p-0.5 text-xs transition-opacity',
        styles.container,
        isPending && 'opacity-60',
        className,
      )}
    >
      <span
        aria-hidden='true'
        className={cn(
          'absolute top-0.5 bottom-0.5 rounded-full transition-transform duration-300 ease-out',
          styles.indicator,
        )}
        style={{
          width: `calc((100% - 0.25rem) / ${locales.length})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
        }}
      />
      {locales.map((code) => {
        // Compute whether this entry is the active locale
        const isActive = code === locale

        // Render one pill per locale
        return (
          <button
            key={code}
            type='button'
            role='radio'
            aria-checked={isActive}
            aria-label={code}
            disabled={isPending}
            onClick={() => onSelect(code)}
            className={cn(
              'relative z-10 inline-flex min-w-9 cursor-pointer items-center justify-center rounded-full px-3 py-1 font-semibold uppercase tracking-wide transition-colors duration-200',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/60',
              'disabled:cursor-not-allowed',
              isActive ? styles.active : styles.inactive,
            )}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}
