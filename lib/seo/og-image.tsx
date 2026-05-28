import { ImageResponse } from 'next/og'

import { SITE_NAME, SITE_URL } from './constants'

/**
 * The {@link OG_HEADLINE} constant
 * @description Headline overlaid on the social card image
 */
const OG_HEADLINE = 'Transformando vidas na Guiné-Bissau'

/**
 * The {@link OG_SUBTITLE} constant
 * @description Supporting line under the headline
 */
const OG_SUBTITLE =
  'Construindo o primeiro centro de tratamento e reabilitação para dependência química.'

/**
 * The {@link OG_CTA} constant
 * @description Call-to-action label rendered on the card
 */
const OG_CTA = 'Apoie o projeto →'

/**
 * The {@link OG_DOMAIN_LABEL} constant
 * @description Human-readable domain label rendered on the card
 */
const OG_DOMAIN_LABEL = SITE_URL.replace('https://', '')

/**
 * The {@link OG_BACKGROUND_URL} constant
 * @description Public URL of the background photograph composited behind the card content
 */
const OG_BACKGROUND_URL =
  'https://res.cloudinary.com/dg0lp0ga7/image/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/v1738606249/recup_utpsyv.jpg'

/**
 * The {@link OgImageOptions} type
 * @description Inputs accepted by the {@link renderOgImage} helper
 */
export type OgImageOptions = {
  width: number
  height: number
}

/**
 * The {@link renderOgImage} helper
 * @description Renders the shared social card with brand wordmark, headline, subtitle and CTA pill
 * @param {OgImageOptions} options - The output dimensions
 * @returns {ImageResponse} The generated image response
 */
export const renderOgImage = (options: OgImageOptions): ImageResponse => {
  // Return the composed ImageResponse using flex layout primitives understood by Satori
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Background photograph layer — Satori-rendered, not a DOM image */}
      {/* oxlint-disable-next-line jsx-a11y/alt-text next/no-img-element */}
      <img
        src={OG_BACKGROUND_URL}
        width={options.width}
        height={options.height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {/* Dark gradient overlay to preserve text contrast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundImage:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 58, 138, 0.78) 55%, rgba(37, 99, 235, 0.6) 100%)',
        }}
      />
      {/* Foreground content layer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          {SITE_NAME}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: '90%',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.45)',
            }}
          >
            {OG_HEADLINE}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: 'rgba(255, 255, 255, 0.92)',
              maxWidth: '90%',
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
            }}
          >
            {OG_SUBTITLE}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 28,
          }}
        >
          <div style={{ display: 'flex', color: 'rgba(255, 255, 255, 0.9)' }}>
            {OG_DOMAIN_LABEL}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 28px',
              borderRadius: 999,
              backgroundColor: '#ffffff',
              color: '#1e3a8a',
              fontWeight: 700,
            }}
          >
            {OG_CTA}
          </div>
        </div>
      </div>
    </div>,
    {
      width: options.width,
      height: options.height,
    },
  )
}
