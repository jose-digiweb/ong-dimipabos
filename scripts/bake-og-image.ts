import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import sharp from 'sharp'

/**
 * The {@link CARD_WIDTH} constant
 * @description Width of the Open Graph / Twitter social card in pixels
 */
const CARD_WIDTH = 1200

/**
 * The {@link CARD_HEIGHT} constant
 * @description Height of the Open Graph / Twitter social card in pixels
 */
const CARD_HEIGHT = 630

/**
 * The {@link SOURCE_IMAGE} constant
 * @description Path to the source hero photograph used as the background
 */
const SOURCE_IMAGE = join(process.cwd(), 'assets', 'heroSection', 'hero_image.jpg')

/**
 * The {@link OUTPUT_TARGETS} constant
 * @description File paths the baked card should be written to
 */
const OUTPUT_TARGETS = [
  join(process.cwd(), 'public', 'opengraph-image.jpg'),
  join(process.cwd(), 'public', 'twitter-image.jpg'),
] as const

/**
 * The {@link OVERLAY_SVG} constant
 * @description SVG overlay with the gradient, wordmark, headline, subtitle, domain and CTA pill
 */
const OVERLAY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}">
  <defs>
    <linearGradient id="shade" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgb(15,23,42)" stop-opacity="0.92"/>
      <stop offset="55%" stop-color="rgb(30,58,138)" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="rgb(37,99,235)" stop-opacity="0.62"/>
    </linearGradient>
    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="rgb(0,0,0)" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#shade)"/>
  <g font-family="Helvetica, Arial, sans-serif" fill="#ffffff" filter="url(#textShadow)">
    <text x="64" y="100" font-size="28" font-weight="700" letter-spacing="3">DI MI PA BÔS</text>
    <text x="64" y="320" font-size="72" font-weight="800" letter-spacing="-1.5">Transformando vidas</text>
    <text x="64" y="395" font-size="72" font-weight="800" letter-spacing="-1.5">na Guiné-Bissau</text>
    <text x="64" y="455" font-size="30" font-weight="400" fill="rgba(255,255,255,0.92)">Construindo o primeiro centro de tratamento</text>
    <text x="64" y="495" font-size="30" font-weight="400" fill="rgba(255,255,255,0.92)">e reabilitação para dependência química.</text>
    <text x="64" y="585" font-size="28" font-weight="500" fill="rgba(255,255,255,0.9)">ongdimipabos.org</text>
  </g>
  <g>
    <rect x="900" y="552" width="236" height="58" rx="29" fill="#ffffff"/>
    <text x="1018" y="589" font-size="26" font-weight="700" fill="#1e3a8a" text-anchor="middle" font-family="Helvetica, Arial, sans-serif">Apoie o projeto →</text>
  </g>
</svg>
`

/**
 * The {@link bakeOgImage} helper
 * @description Composes the hero photograph with the designed overlay and writes a JPEG card
 * @returns A promise that resolves when both card files are written
 */
const bakeOgImage = async (): Promise<void> => {
  // Resize and crop the photograph to the OG aspect ratio
  const background = await sharp(readFileSync(SOURCE_IMAGE))
    .resize(CARD_WIDTH, CARD_HEIGHT, { fit: 'cover', position: 'center' })
    .toBuffer()

  // Composite the SVG overlay on top and encode as a tight JPEG
  const composed = await sharp(background)
    .composite([{ input: Buffer.from(OVERLAY_SVG), top: 0, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer()

  // Write the same buffer to every target path so OG and Twitter cards stay in sync
  for (const target of OUTPUT_TARGETS) {
    writeFileSync(target, composed)
    console.log(`wrote ${target} — ${(composed.length / 1024).toFixed(1)} KB`)
  }
}

// Kick off the bake on direct execution
bakeOgImage().catch((error) => {
  console.error(error)
  process.exit(1)
})
