import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * The locale-aware navigation APIs from next-intl
 * @description Drop-in typed replacements for `next/link` and the navigation hooks
 * that automatically preserve the active locale prefix.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
