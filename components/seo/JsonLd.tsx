import type {
  ArticleSchema,
  BreadcrumbListSchema,
  ContactPageSchema,
  OrganizationSchema,
  WebsiteSchema,
} from '@/lib/seo/jsonLd'

/**
 * The {@link JsonLdData} type
 * @description Union of all supported Schema.org payloads renderable by {@link JsonLd}
 */
export type JsonLdData =
  | OrganizationSchema
  | WebsiteSchema
  | BreadcrumbListSchema
  | ArticleSchema
  | ContactPageSchema

/**
 * The {@link JsonLdProps} type
 * @description Props for the {@link JsonLd} component
 */
type JsonLdProps = {
  data: JsonLdData | readonly JsonLdData[]
}

/**
 * The {@link serializeJsonLd} helper
 * @description Serializes a Schema.org payload to a JSON string with angle brackets escaped to prevent script-tag breakout
 * @param {JsonLdData | readonly JsonLdData[]} data - The schema payload (single or array)
 * @returns {string} The escaped JSON string
 */
const serializeJsonLd = (data: JsonLdData | readonly JsonLdData[]): string => {
  // Stringify then escape < to prevent breaking out of the script tag
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * The {@link JsonLd} component
 * @description Renders a JSON-LD `<script>` tag with the provided Schema.org payload
 * @param {JsonLdProps} props - The component props
 * @param {JsonLdData | readonly JsonLdData[]} props.data - The Schema.org payload to embed
 * @returns The rendered script element
 */
export function JsonLd({ data }: JsonLdProps) {
  // Render a script tag with the serialized JSON-LD payload
  return (
    <script
      type='application/ld+json'
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
