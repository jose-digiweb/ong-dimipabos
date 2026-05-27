import { contactRoles, projectStatus } from './constants'
import type { ProjectType } from './types'

/**
 * The {@link projects} constant
 * @description Static project content rendered on the projetos pages
 */
export const projects: ProjectType[] = [
  {
    id: 'centro-tratamento',
    slug: 'centro-tratamento',
    title: 'Centro de Tratamento e Reabilitação',
    status: projectStatus.CAPTACAO,
    description:
      'O primeiro centro especializado em tratamento e reabilitação para pessoas em situação de dependência química na Guiné-Bissau.',
    shortDescription: 'Tratamento especializado com equipe multidisciplinar.',
    longDescription:
      'Nosso projeto principal consiste na construção de um centro de tratamento moderno e humanizado. Com o terreno já adquirido em 2023, estamos na fase de captação de recursos para iniciar a construção.\n\nO centro será equipado com:\n• Dormitórios para até 20 pessoas\n• Áreas de convivência e lazer\n• Salas para atendimento individual e em grupo\n• Refeitório e cozinha industrial\n• Espaço para atividades terapêuticas',
    location: 'Bissau, Guiné-Bissau',
    startDate: '2023',
    capacity: '20 pessoas',
    image: 'https://res.cloudinary.com/dg0lp0ga7/image/upload/v1738606249/recup_utpsyv.jpg',
    images: [],
    team: [
      'Equipe médica especializada',
      'Psicólogos',
      'Assistentes sociais',
      'Terapeutas ocupacionais',
    ],
    contact: {
      name: 'Cesaltina Pereira',
      role: contactRoles.COORDENADORA_GERAL,
      email: 'projeto@dimipabos.org',
      phone: '+31 631 791 165',
    },
  },
]
