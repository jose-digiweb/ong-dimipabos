import { ArrowRight, Heart, Home, Users } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * The {@link homeProjectIcon} constant
 * @description Allowed icon keys for the {@link HomeProjectCard} component
 */
const homeProjectIcon = {
  HOME: 'home',
  REAB: 'reab',
  EDU: 'edu',
} as const

/**
 * The {@link HomeProjectIcon} type
 * @description Union of allowed {@link homeProjectIcon} values
 */
type HomeProjectIcon = (typeof homeProjectIcon)[keyof typeof homeProjectIcon]

/**
 * The {@link homeProjectIconMap} constant
 * @description Mapping from icon key to lucide icon component
 */
const homeProjectIconMap = {
  [homeProjectIcon.HOME]: Home,
  [homeProjectIcon.REAB]: Users,
  [homeProjectIcon.EDU]: Heart,
} as const

/**
 * The {@link homeProjectCopy} constant
 * @description Static copy used by the {@link HomeProjectCard} component
 */
const homeProjectCopy = {
  LEARN_MORE: 'Saiba mais',
} as const

/**
 * The {@link HomeProjectCardProps} type
 * @description Props for the {@link HomeProjectCard} component
 */
type HomeProjectCardProps = {
  title: string
  children: ReactNode
  href: string
  icon: HomeProjectIcon
  className?: string
}

/**
 * @description Resolves the lucide icon component for a given key
 * @param {HomeProjectIcon} icon - The icon key
 * @returns The lucide icon component
 */
const getIcon = (icon: HomeProjectIcon) => {
  // Fall back to the home icon when an unknown key slips through
  return homeProjectIconMap[icon] ?? Home
}

/**
 * The {@link HomeProjectCard} component
 * @description Compact card used on the home page to preview a project area
 * @param {HomeProjectCardProps} props - The component props
 * @param {string} props.title - The card title
 * @param {ReactNode} props.children - The card description content
 * @param {string} props.href - The route for the "learn more" link
 * @param {HomeProjectIcon} props.icon - Which icon key to render
 * @param {string} [props.className] - Optional extra class names
 * @returns The rendered card
 */
export const HomeProjectCard = ({
  icon,
  title,
  children,
  href,
  className,
}: HomeProjectCardProps) => {
  // Memoise the icon component so it is not re-resolved on every render
  const Icon = useMemo(() => getIcon(icon), [icon])

  // Render the styled card with header icon/title, body copy and learn-more link
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Icon className='size-6 text-primary' />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground'>{children}</p>
        <Link
          href={href}
          className='mt-4 inline-flex items-center font-medium text-primary hover:text-secondary/90'
        >
          {homeProjectCopy.LEARN_MORE}
          <ArrowRight className='ml-1 size-4' />
        </Link>
      </CardContent>
    </Card>
  )
}
