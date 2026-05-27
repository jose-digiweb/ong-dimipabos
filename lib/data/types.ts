import type { projectStatus } from './constants'

/**
 * The {@link ProjectStatus} type
 * @description Union of the canonical project lifecycle status values
 */
export type ProjectStatus = (typeof projectStatus)[keyof typeof projectStatus]

/**
 * The {@link ProjectContact} type
 * @description The contact information attached to a project
 */
export type ProjectContact = {
  name: string
  role: string
  email: string
  phone: string
}

/**
 * The {@link ProjectType} type
 * @description The shape of a single project entry rendered on the projetos pages
 */
export type ProjectType = {
  id: string
  slug: string
  title: string
  status: ProjectStatus
  description: string
  shortDescription: string
  longDescription: string
  location: string
  startDate: string
  capacity: string
  image: string
  images: string[]
  team: string[]
  contact: ProjectContact
}
