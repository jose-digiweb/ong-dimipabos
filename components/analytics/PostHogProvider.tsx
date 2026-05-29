'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { Suspense, useEffect, type ReactNode } from 'react'

/**
 * The {@link POSTHOG_HOST} constant
 * @description Default ingestion host when {@link process.env.NEXT_PUBLIC_POSTHOG_HOST} is unset
 */
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'

/**
 * The {@link PostHogProviderProps} type
 * @description Props consumed by {@link PostHogProvider}
 */
type PostHogProviderProps = {
  children: ReactNode
}

/**
 * The {@link PostHogProvider} component
 * @description Initialises PostHog in cookie-less mode (memory persistence,
 * no GDPR banner needed) and wires manual pageview tracking for the App Router.
 * Renders children untouched when the public key is not configured.
 * @param {PostHogProviderProps} props - The component props
 * @returns The provider tree wrapping its children
 */
export function PostHogProvider({ children }: PostHogProviderProps) {
  // Read the public ingestion key (inlined by Next at build time)
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

  // Initialise PostHog exactly once on the client
  useEffect(() => {
    // Skip when the key is missing (local dev or unconfigured envs)
    if (!key) return
    if (posthog.__loaded) return

    posthog.init(key, {
      api_host: POSTHOG_HOST,
      // Cookie-less mode — no localStorage, no cookies, no banner required
      persistence: 'memory',
      // Event-based only — never create anonymous person profiles
      person_profiles: 'identified_only',
      // App Router needs manual pageview capture (see PageviewTracker)
      capture_pageview: false,
      capture_pageleave: true,
      // Anonymous-only — never identify by IP
      ip: false,
      disable_session_recording: true,
      autocapture: false,
    })
  }, [key])

  // Render children untouched when PostHog is not configured
  if (!key) return <>{children}</>

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  )
}

/**
 * The {@link PageviewTracker} component
 * @description Emits a `$pageview` event on every App Router navigation. Lives
 * inside a Suspense boundary because `useSearchParams` opts the tree into CSR.
 * @returns Null — this component only emits side effects
 */
function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()

  useEffect(() => {
    // Bail when PostHog is not ready
    if (!ph || !pathname) return

    // Rebuild the URL the user actually saw
    const query = searchParams?.toString()
    const url = query ? `${pathname}?${query}` : pathname

    ph.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams, ph])

  return null
}
