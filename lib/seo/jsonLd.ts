import { localeBcp47Codes, type Locale } from '@/i18n/config'

import { SITE_ALTERNATE_NAMES, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './constants'
import { buildLocalizedUrl } from './metadata'

/**
 * The {@link organizationLegalData} constant
 * @description Legal identification of the responsible NGO used across structured data
 */
const organizationLegalData = {
  LEGAL_NAME: 'ONG DI MI PA BÔS',
  TAX_ID: '910324840',
  FOUNDING_DATE: '2021',
  EMAIL: 'contact@ongdimipabos.org',
  PHONE: '+31631791165',
  LOCALITY: 'Bissau',
  COUNTRY: 'GW',
  FACEBOOK_URL: 'https://www.facebook.com/profile.php?id=100090763747200',
} as const

/**
 * The {@link PostalAddressSchema} type
 * @description Schema.org PostalAddress payload
 */
export type PostalAddressSchema = {
  '@type': 'PostalAddress'
  addressLocality: string
  addressCountry: string
}

/**
 * The {@link ContactPointSchema} type
 * @description Schema.org ContactPoint payload
 */
export type ContactPointSchema = {
  '@type': 'ContactPoint'
  contactType: string
  email: string
  telephone: string
  areaServed: string
  availableLanguage: readonly string[]
}

/**
 * The {@link OrganizationSchema} type
 * @description Schema.org NGO payload used site-wide
 */
export type OrganizationSchema = {
  '@context': 'https://schema.org'
  '@type': 'NGO'
  '@id': string
  name: string
  alternateName: readonly string[]
  legalName: string
  url: string
  logo: string
  image: string
  description: string
  foundingDate: string
  taxID: string
  email: string
  telephone: string
  address: PostalAddressSchema
  sameAs: readonly string[]
  contactPoint: readonly ContactPointSchema[]
}

/**
 * The {@link WebsiteSchema} type
 * @description Schema.org WebSite payload used site-wide
 */
export type WebsiteSchema = {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  '@id': string
  name: string
  url: string
  description: string
  inLanguage: string
  publisher: { '@id': string }
}

/**
 * The {@link BreadcrumbItem} type
 * @description Single breadcrumb item input for {@link buildBreadcrumbSchema}
 */
export type BreadcrumbItem = {
  name: string
  path: string
}

/**
 * The {@link BreadcrumbListItemSchema} type
 * @description Schema.org ListItem payload nested inside a BreadcrumbList
 */
export type BreadcrumbListItemSchema = {
  '@type': 'ListItem'
  position: number
  name: string
  item: string
}

/**
 * The {@link BreadcrumbListSchema} type
 * @description Schema.org BreadcrumbList payload
 */
export type BreadcrumbListSchema = {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: readonly BreadcrumbListItemSchema[]
}

/**
 * The {@link ArticleSchemaInput} type
 * @description Inputs accepted by {@link buildArticleSchema}
 */
export type ArticleSchemaInput = {
  title: string
  description: string
  path: string
  image: string
  locale: Locale
}

/**
 * The {@link ArticleSchema} type
 * @description Schema.org Article payload used on the project detail route
 */
export type ArticleSchema = {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description: string
  url: string
  image: string
  author: { '@type': 'NGO'; name: string }
  publisher: { '@id': string }
}

/**
 * The {@link ContactPageSchema} type
 * @description Schema.org ContactPage payload used on the contact route
 */
export type ContactPageSchema = {
  '@context': 'https://schema.org'
  '@type': 'ContactPage'
  name: string
  url: string
  description: string
  inLanguage: string
  about: { '@id': string }
}

/**
 * The {@link ORGANIZATION_ID} constant
 * @description Stable identifier used to cross-reference the Organization schema from other nodes
 */
const ORGANIZATION_ID = `${SITE_URL}#organization`

/**
 * The {@link WEBSITE_ID} constant
 * @description Stable identifier used to cross-reference the WebSite schema from other nodes
 */
const WEBSITE_ID = `${SITE_URL}#website`

/**
 * The {@link buildOrganizationSchema} helper
 * @description Builds the NGO Organization schema describing the publisher of every page
 * @returns {OrganizationSchema} The Organization schema
 */
export function buildOrganizationSchema(): OrganizationSchema {
  // Build a single Organization node referenced site-wide via @id
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    legalName: organizationLegalData.LEGAL_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/opengraph-image.jpg`,
    description: SITE_DESCRIPTION,
    foundingDate: organizationLegalData.FOUNDING_DATE,
    taxID: organizationLegalData.TAX_ID,
    email: organizationLegalData.EMAIL,
    telephone: organizationLegalData.PHONE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: organizationLegalData.LOCALITY,
      addressCountry: organizationLegalData.COUNTRY,
    },
    sameAs: [organizationLegalData.FACEBOOK_URL],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: organizationLegalData.EMAIL,
        telephone: organizationLegalData.PHONE,
        areaServed: organizationLegalData.COUNTRY,
        availableLanguage: ['Portuguese'],
      },
    ],
  }
}

/**
 * The {@link buildWebsiteSchema} helper
 * @description Builds the WebSite schema describing this site as a publication
 * @param {Locale} locale - The active locale, used for the `inLanguage` tag
 * @returns {WebsiteSchema} The WebSite schema
 */
export function buildWebsiteSchema(locale: Locale): WebsiteSchema {
  // Build the WebSite node linked back to the Organization as publisher
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: localeBcp47Codes[locale],
    publisher: { '@id': ORGANIZATION_ID },
  }
}

/**
 * The {@link buildBreadcrumbSchema} helper
 * @description Builds a BreadcrumbList schema from an ordered list of crumbs
 * @param {readonly BreadcrumbItem[]} items - The ordered crumbs from root to current page
 * @param {Locale} locale - The active locale, used to build locale-aware crumb URLs
 * @returns {BreadcrumbListSchema} The BreadcrumbList schema
 */
export function buildBreadcrumbSchema(
  items: readonly BreadcrumbItem[],
  locale: Locale,
): BreadcrumbListSchema {
  // Map each crumb to a positioned ListItem entry with a locale-aware URL
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: item.name,
    item: buildLocalizedUrl(locale, item.path),
  }))

  // Return the BreadcrumbList wrapper
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

/**
 * The {@link buildArticleSchema} helper
 * @description Builds an Article schema for project detail pages
 * @param {ArticleSchemaInput} input - The article inputs
 * @returns {ArticleSchema} The Article schema
 */
export function buildArticleSchema(input: ArticleSchemaInput): ArticleSchema {
  // Build the Article node linked back to the Organization as publisher
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: buildLocalizedUrl(input.locale, input.path),
    image: input.image,
    author: { '@type': 'NGO', name: SITE_NAME },
    publisher: { '@id': ORGANIZATION_ID },
  }
}

/**
 * The {@link ContactPageInput} type
 * @description Inputs accepted by {@link buildContactPageSchema}
 */
export type ContactPageInput = {
  name: string
  description: string
  path: string
  locale: Locale
}

/**
 * The {@link buildContactPageSchema} helper
 * @description Builds a ContactPage schema for the /contato route
 * @param {ContactPageInput} input - The contact page inputs
 * @returns {ContactPageSchema} The ContactPage schema
 */
export function buildContactPageSchema(input: ContactPageInput): ContactPageSchema {
  // Build the ContactPage node linked back to the Organization via about
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: input.name,
    url: buildLocalizedUrl(input.locale, input.path),
    description: input.description,
    inLanguage: localeBcp47Codes[input.locale],
    about: { '@id': ORGANIZATION_ID },
  }
}
