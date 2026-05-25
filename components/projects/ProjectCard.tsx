import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
// Dependencies
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'

// Types
import type { ProjectType } from '@/lib/data'
import Link from 'next/link'
type Props = {
  project: ProjectType
  className?: string
}

/**
 * The ProjectCard component
 * @description Will render the ProjectCard
 * @param {Props} props The component props
 * @param {Project} props.project The component project
 * @param {string} props.className The component class name
 * @returns {JSX.Element} The ProjectCard component
 */
export const ProjectCard = ({ project, className }: Props) => {
  return (
    <Card
      className={cn(
        'hover:-translate-y-1 overflow-hidden rounded-lg bg-white shadow-lg transition-transform',
        className
      )}
    >
      <CardHeader className='relative aspect-video w-full overflow-hidden'>
        <Image
          fill
          src={project.image}
          alt={project.title}
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
            <Link href={`/projetos/${project.slug}`} className='group inline-flex items-center' />
          }
          nativeButton={false}
          variant='CTA'
          className='group'
        >
          Leia Mais
          <ArrowRight className='ml-2 size-4 transition-all group-hover:translate-x-1 group-hover:scale-125' />
        </Button>
      </CardFooter>
    </Card>
  )
}
