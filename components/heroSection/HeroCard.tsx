import Image from 'next/image'

import { cn } from '@/lib/utils'

import { AjudarIcons } from './AjudarIcons'
import { heroCardImageAlt, heroCardVariant } from './constants'
import { HomeIcons } from './HomeIcons'
import { ProjetosIcons } from './ProjetosIcons'
import { SobreIcons } from './SobreIcons'
import type { HeroCardProps } from './types'

/**
 * The {@link HeroCard} component
 * @description Hero card featuring a cover image, title, description and a variant-specific icon trio
 * @param {HeroCardProps} props - The component props
 * @param {string} props.title - The card title
 * @param {ReactNode} props.children - The card description text
 * @param {ImageProps['src']} props.image - The cover image source
 * @param {HeroCardVariant} [props.variant] - Which icon trio to render (defaults to `home`)
 * @param {string} [props.className] - Optional extra class names for the card wrapper
 * @param {string} [props.imageClassName] - Optional extra class names for the cover image
 * @returns The rendered hero card
 */
export const HeroCard = ({
  variant = heroCardVariant.HOME,
  title,
  image,
  children,
  className,
  imageClassName,
}: HeroCardProps) => {
  // Render the card scaffold with image, copy and the chosen icon trio
  return (
    <div className={cn('z-10 max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl', className)}>
      <div className='relative aspect-video w-full'>
        <Image
          fill
          priority
          src={image}
          alt={heroCardImageAlt[variant]}
          className={cn('h-full w-full object-cover', imageClassName)}
        />
      </div>
      <div className='p-8'>
        <h2 className='font-bold text-xl'>{title}</h2>
        <p className='mt-2 text-muted-foreground'>{children}</p>

        {variant === heroCardVariant.HOME && <HomeIcons />}
        {variant === heroCardVariant.SOBRE && <SobreIcons />}
        {variant === heroCardVariant.PROJETOS && <ProjetosIcons />}
        {variant === heroCardVariant.AJUDAR && <AjudarIcons />}
      </div>
    </div>
  )
}
