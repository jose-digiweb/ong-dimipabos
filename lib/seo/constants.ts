/**
 * The {@link SITE_URL} constant
 * @description Canonical production origin used by metadata, sitemap, robots and JSON-LD
 */
export const SITE_URL = 'https://ongdimipabos.org'

/**
 * The {@link SITE_NAME} constant
 * @description Short brand name used in social cards and structured data
 */
export const SITE_NAME = 'DI MI PA BÔS'

/**
 * The {@link SITE_TITLE} constant
 * @description Default browser tab title for the home route
 */
export const SITE_TITLE = 'DI MI PA BÔS - Transformando vidas na Guiné-Bissau'

/**
 * The {@link SITE_DESCRIPTION} constant
 * @description Default meta description used as fallback when a page does not provide its own
 */
export const SITE_DESCRIPTION =
  'DI MI PA BÔS: ONG na Guiné-Bissau a construir o primeiro centro de tratamento e reabilitação para dependência química. Apoie saúde e esperança.'

/**
 * The {@link SITE_LOCALE} constant
 * @description Open Graph locale tag used site-wide
 */
export const SITE_LOCALE = 'pt_PT'

/**
 * The {@link SITE_OG_IMAGE} constant
 * @description Default social card image served as a static asset from `public/`.
 * Used for Open Graph and Twitter cards on every route that does not supply its own image.
 */
export const SITE_OG_IMAGE = {
  URL: '/opengraph-image.jpg',
  TWITTER_URL: '/twitter-image.jpg',
  WIDTH: 1200,
  HEIGHT: 630,
  ALT: 'DI MI PA BÔS — Transformando vidas na Guiné-Bissau. Construindo o primeiro centro de tratamento e reabilitação.',
} as const

/**
 * The {@link SITE_ALTERNATE_NAMES} constant
 * @description Brand name variants used by Organization JSON-LD `alternateName`
 * to help search engines match common user spellings (no accents, no spaces,
 * lowercase, with/without "ONG" prefix).
 */
export const SITE_ALTERNATE_NAMES = [
  'dimipabos',
  'Dimipabos',
  'DiMiPaBos',
  'DI MI PA BOS',
  'Di Mi Pa Bos',
  'ONG DI MI PA BÔS',
  'ONG DI MI PA BOS',
  'ONG Dimipabos',
  'ONG dimipabos',
] as const

/**
 * The {@link SITE_KEYWORDS} constant
 * @description Keyword variants surfaced via the default `keywords` meta tag.
 * Covers brand spellings plus the common "ONG na Guiné-Bissau / Bissau ong"
 * queries users actually type into Google.
 */
export const SITE_KEYWORDS = [
  'dimipabos',
  'di mi pa bos',
  'DI MI PA BÔS',
  'ONG DI MI PA BÔS',
  'ONG dimipabos',
  'ONG na Guiné-Bissau',
  'ONG na Guine-Bissau',
  'ONG na Guine Bissau',
  'ONG em Bissau',
  'ONG Bissau',
  'Bissau ONG',
  'ONG guineense',
  'centro de reabilitação Guiné-Bissau',
  'tratamento dependência química Guiné-Bissau',
  'doar ONG Guiné-Bissau',
  'voluntariado Guiné-Bissau',
] as const
