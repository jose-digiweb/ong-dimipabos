'use client'

import { useEffect, useImperativeHandle, useRef } from 'react'

/**
 * The {@link TURNSTILE_SCRIPT_SRC} constant
 * @description Cloudflare Turnstile JS API entry point (explicit render mode)
 */
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/**
 * The {@link TURNSTILE_SCRIPT_ID} constant
 * @description DOM id used to dedupe the Turnstile script tag across mounts
 */
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script'

/**
 * The {@link TurnstileRenderOptions} type
 * @description Subset of the Turnstile render options we use
 */
type TurnstileRenderOptions = {
  sitekey: string
  callback: (token: string) => void
  'error-callback'?: () => void
  'expired-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'flexible' | 'compact' | 'invisible'
  appearance?: 'always' | 'execute' | 'interaction-only'
}

/**
 * The {@link TurnstileApi} type
 * @description Minimal shape of the global `turnstile` object
 */
type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    __turnstileScriptPromise?: Promise<void>
  }
}

/**
 * The {@link loadTurnstileScript} helper
 * @description Loads the Turnstile script exactly once and resolves when ready
 * @returns {Promise<void>} Resolves once `window.turnstile` is available
 */
function loadTurnstileScript(): Promise<void> {
  // Reuse the in-flight promise so concurrent mounts share one script load
  if (window.__turnstileScriptPromise) return window.__turnstileScriptPromise

  // Construct and cache the load promise
  window.__turnstileScriptPromise = new Promise((resolve, reject) => {
    // If the API is already attached, resolve immediately
    if (window.turnstile) {
      resolve()
      return
    }

    // Reuse an existing script tag if one is already in the document
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('turnstile_script_failed')))
      return
    }

    // Inject the script tag with async + defer for non-blocking load
    const script = document.createElement('script')
    script.id = TURNSTILE_SCRIPT_ID
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => reject(new Error('turnstile_script_failed')))
    document.head.appendChild(script)
  })

  return window.__turnstileScriptPromise
}

/**
 * The {@link TurnstileHandle} type
 * @description Imperative API exposed to parents through `ref`
 */
export type TurnstileHandle = {
  reset: () => void
}

/**
 * The {@link TurnstileProps} type
 * @description Props consumed by {@link Turnstile}
 */
export type TurnstileProps = {
  siteKey: string
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark' | 'auto'
  appearance?: 'always' | 'execute' | 'interaction-only'
  className?: string
  ref?: React.Ref<TurnstileHandle>
}

/**
 * The {@link Turnstile} component
 * @description Cloudflare Turnstile widget rendered via the explicit JS API.
 * Use `ref.reset()` to recycle the token after a submission attempt.
 * @param {TurnstileProps} props - The widget props
 * @returns The container that hosts the Turnstile iframe
 */
export function Turnstile({
  siteKey,
  onVerify,
  onExpire,
  onError,
  theme = 'auto',
  appearance = 'interaction-only',
  className,
  ref,
}: TurnstileProps) {
  // Container ref the widget mounts into
  const containerRef = useRef<HTMLDivElement>(null)

  // Widget id returned by the Turnstile API, kept across renders for reset/remove
  const widgetIdRef = useRef<string | null>(null)

  // Keep the latest callbacks in refs so the mount effect can stay dependency-free
  const onVerifyRef = useRef(onVerify)
  const onExpireRef = useRef(onExpire)
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onVerifyRef.current = onVerify
    onExpireRef.current = onExpire
    onErrorRef.current = onError
  }, [onVerify, onExpire, onError])

  // Mount the widget exactly once per (siteKey, theme, appearance)
  useEffect(() => {
    // Capture the container synchronously for cleanup safety
    const container = containerRef.current
    if (!container) return

    // Cancellation flag for the async script load
    let cancelled = false

    // Load the script then render the widget
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: siteKey,
          theme,
          appearance,
          callback: (token) => onVerifyRef.current(token),
          'expired-callback': () => onExpireRef.current?.(),
          'error-callback': () => onErrorRef.current?.(),
        })
      })
      .catch(() => onErrorRef.current?.())

    // Cleanup: remove the widget when the component unmounts
    return () => {
      cancelled = true
      const id = widgetIdRef.current
      if (id && window.turnstile) {
        window.turnstile.remove(id)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, theme, appearance])

  // Expose imperative reset to parents through the forwarded ref
  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        const id = widgetIdRef.current
        if (id && window.turnstile) window.turnstile.reset(id)
      },
    }),
    [],
  )

  return <div ref={containerRef} className={className} />
}
