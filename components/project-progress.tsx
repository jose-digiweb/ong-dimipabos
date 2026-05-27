import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { CTAButton } from './cta'

/**
 * The {@link projectProgressCopy} constant
 * @description Static Portuguese copy for the project progress card
 */
const projectProgressCopy = {
  GOAL_LABEL: 'Meta',
  GOAL_VALUE: '€500.000',
  RAISED_LABEL: 'Arrecadado',
  RAISED_VALUE: '€75.000',
  DONORS_LABEL: 'Doadores',
  DONORS_VALUE: '42',
  CTA_LABEL: 'Contribua com o Projeto',
} as const

/**
 * The {@link ProjectProgressProps} type
 * @description Props for the {@link ProjectProgress} component
 */
type ProjectProgressProps = {
  title: string
  description: string
}

/**
 * The {@link ProjectProgress} component
 * @description Card showing the funding goal, raised amount and donor count for a project
 * @param {ProjectProgressProps} props - The component props
 * @param {string} props.title - The card title
 * @param {string} props.description - The card description
 * @returns The rendered progress card
 */
export function ProjectProgress({ title, description }: ProjectProgressProps) {
  // Render the progress card with the three metric columns and CTA
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='rounded-lg bg-muted p-6'>
          <div className='flex flex-wrap gap-8'>
            <div className='flex-1'>
              <div className='font-medium text-muted-foreground text-sm'>
                {projectProgressCopy.GOAL_LABEL}
              </div>
              <div className='mt-1 font-bold text-2xl'>{projectProgressCopy.GOAL_VALUE}</div>
            </div>
            <div className='flex-1'>
              <div className='font-medium text-muted-foreground text-sm'>
                {projectProgressCopy.RAISED_LABEL}
              </div>
              <div className='mt-1 font-bold text-2xl'>{projectProgressCopy.RAISED_VALUE}</div>
            </div>
            <div className='flex-1'>
              <div className='font-medium text-muted-foreground text-sm'>
                {projectProgressCopy.DONORS_LABEL}
              </div>
              <div className='mt-1 font-bold text-2xl'>{projectProgressCopy.DONORS_VALUE}</div>
            </div>
          </div>
        </div>

        <CTAButton text={projectProgressCopy.CTA_LABEL} size='lg' />
      </CardContent>
    </Card>
  )
}
