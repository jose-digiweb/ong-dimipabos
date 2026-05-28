import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cfImage } from '@/lib/img'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { buildProjectHref, projectCardCopy } from './constants'
import type { ProjectCardProps } from './types'

/**
 * The {@link ProjectCard} component
 * @description Renders a project preview card with cover image, title, description and CTA button
 * @param {ProjectCardProps} props - The component props
 * @param {ProjectType} props.project - The project data to render
 * @param {string} [props.className] - Optional extra class names for the card wrapper
 * @returns The rendered project card
 */
export const ProjectCard = ({ project, className }: ProjectCardProps) => {
  // Pre-compute the href for the project detail page
  const href = buildProjectHref(project.slug)

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
          alt={project.title}
          sizes='(min-width: 768px) 50vw, 100vw'
          className='h-full w-full object-cover'
        />
      </CardHeader>

      <CardContent className='p-0'>
        <div className='p-6'>
          <h3 className='font-bold text-foreground text-xl'>{project.title}</h3>
          <p className='mt-2 text-pretty text-muted-foreground'>{project.description}</p>
        </div>
      </CardContent>

      <CardFooter className=''>
        <Button
          render={
            <Link
              href={href}
              className='group inline-flex items-center'
              aria-label={`${projectCardCopy.READ_MORE} sobre ${project.title}`}
            />
          }
          nativeButton={false}
          variant='CTA'
          className='group'
        >
          {projectCardCopy.READ_MORE}
          <ArrowRight className='ml-2 size-4 transition-all group-hover:translate-x-1 group-hover:scale-125' />
        </Button>
      </CardFooter>
    </Card>
  )
}
