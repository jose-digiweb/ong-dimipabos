import type { ReactNode } from 'react'
import type { ImageProps } from 'next/image'

import type { HeroCardVariant } from './constants'

/**
 * The {@link ChildrenWithClassName} type
 * @description Shared shape for hero sub-components that accept children and an optional className
 */
export type ChildrenWithClassName = {
  children: ReactNode
  className?: string
}

/**
 * The {@link HeroStatsProps} type
 * @description Props for the {@link HeroStats} component
 */
export type HeroStatsProps = {
  value: number | string
  label: string
  className?: string
}

/**
 * The {@link HeroCardProps} type
 * @description Props for the {@link HeroCard} component
 */
export type HeroCardProps = {
  title: string
  children: ReactNode
  image: ImageProps['src']
  variant: HeroCardVariant
  className?: string
  imageClassName?: string
}

/**
 * The {@link IconWrapperProps} type
 * @description Props for the {@link IconWrapper} component
 */
export type IconWrapperProps = {
  className?: string
  children: ReactNode
}
