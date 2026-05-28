import type { projectStatus } from './constants'

/**
 * The {@link ProjectStatus} type
 * @description Union of the canonical project lifecycle status values
 */
export type ProjectStatus = (typeof projectStatus)[keyof typeof projectStatus]

/**
 * The {@link ProjectContact} type
 * @description The locale-independent contact information attached to a project.
 * The contact role label is read from translations under
 * `projects.items.<slug>.contactRole`.
 */
export type ProjectContact = {
  name: string
  email: string
  phone: string
}

/**
 * The {@link ProjectType} type
 * @description The locale-independent shape of a single project entry rendered on
 * the projetos pages. Translatable fields (title, descriptions, team, contact
 * role, location, capacity) live in messages under `projects.items.<slug>`.
 */
export type ProjectType = {
  id: string
  slug: string
  status: ProjectStatus
  startDate: string
  image: string
  images: string[]
  contact: ProjectContact
}
