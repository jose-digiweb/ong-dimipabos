import type { ButtonProps } from '../ui/button'

/**
 * The {@link CTAButtonProps} type
 * @description Props for the {@link CTAButton} component
 */
export type CTAButtonProps = {
  text?: string
  onClick?: () => void
} & Omit<ButtonProps, 'variant'>

/**
 * The {@link CTASectionProps} type
 * @description Props for the {@link CTASection} component
 */
export type CTASectionProps = {
  className?: string
}
