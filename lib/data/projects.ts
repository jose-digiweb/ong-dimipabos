import { getGalleryImageUrl } from '@/lib/gallery-images'

import { projectStatus } from './constants'
import type { ProjectType } from './types'

/**
 * The {@link projects} constant
 * @description Static, locale-independent project content rendered on the
 * projetos pages. Translatable fields are sourced from messages.
 */
export const projects: ProjectType[] = [
  {
    id: 'centro-tratamento',
    slug: 'centro-tratamento',
    status: projectStatus.CAPTACAO,
    startDate: '2023',
    image: getGalleryImageUrl('2.jpeg'),
    images: [],
    contact: {
      name: 'Cesaltina Pereira',
      email: 'projeto@dimipabos.org',
      phone: '+31 631 791 165',
    },
  },
]
