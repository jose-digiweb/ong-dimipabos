'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { cfImage } from '@/lib/img'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { buildProjectHref } from './constants'
import type { ProjectCardProps } from './types'

/**
 * The {@link ProjectCard} component
 * @description Renders a project preview card with cover image, translated title,
 * description and CTA button. Title and description are read from messages
 * under `projects.items.<slug>`.
 * @param {ProjectCardProps} props - The component props
 * @param {ProjectType} props.project - The project data shell (slug + image)
 * @param {string} [props.className] - Optional extra class names for the card wrapper
 * @returns The rendered project card
 */
export const ProjectCard = ({ project, className }: ProjectCardProps) => {
  // Pre-compute the href for the project detail page
  const href = buildProjectHref(project.slug)

  // Read the per-project translations and the shared card copy
  const tItem = useTranslations(`projects.items.${project.slug}`)
  const tCard = useTranslations('projects.card')

  // Resolve the translated title once for reuse in alt text and aria-label
  const title = tItem('title')

  // Render the card with header image, body copy and footer CTA
  return (
    <Card
      className={cn(
        'hover:-translate-y-1 overflow-hidden rounded-lg bg-white shadow-lg transition-transform',
        className,
      )}
    >
      <CardHeader className='relative aspect-video w-full overflow-hidden'>
        <Image
          fill
          src={cfImage(project.image, { width: 800 })}
          alt={title}
          sizes='(min-width: 768px) 50vw, 100vw'
          className='h-full w-full object-cover'
        />
      </CardHeader>

      <CardContent className='p-0'>
        <div className='p-6'>
          <h3 className='font-bold text-foreground text-xl'>{title}</h3>
          <p className='mt-2 text-pretty text-muted-foreground'>{tItem('description')}</p>
        </div>
      </CardContent>

      <CardFooter className=''>
        <Button
          render={
            <Link
              href={href}
              className='group inline-flex items-center'
              aria-label={`${tCard('readMoreAriaPrefix')} ${title}`}
            />
          }
          nativeButton={false}
          variant='CTA'
          className='group'
        >
          {tCard('readMore')}
          <ArrowRight className='ml-2 size-4 transition-all group-hover:translate-x-1 group-hover:scale-125' />
        </Button>
      </CardFooter>
    </Card>
  )
}
