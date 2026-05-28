/**
 * The {@link projectRoute} constant
 * @description Route helpers for project pages
 */
export const projectRoute = {
  BASE: '/projetos',
} as const

/**
 * @description Builds the URL for a single project page
 * @param {string} slug - The project slug
 * @returns {string} The project route
 */
export const buildProjectHref = (slug: string): string => {
  // Concatenate the projects base route with the supplied slug
  return `${projectRoute.BASE}/${slug}`
}
