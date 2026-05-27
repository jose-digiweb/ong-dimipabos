/**
 * The {@link R2Image} type
 * @description Represents a single object stored in the R2 bucket as exposed to UI consumers
 */
export type R2Image = {
  key: string | undefined
  size: number | undefined
  lastModified: Date | undefined
  url: string
}
