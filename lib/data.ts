type ProjectStatus = 'captacao' | 'planejamento' | 'andamento' | 'concluido'

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
	contact: {
		name: string
		role: string
		email: string
		phone: string
	}
}

export const projects: ProjectType[] = [
	{
		id: 'centro-tratamento',
		slug: 'centro-tratamento',
		title: 'Centro de Tratamento e Reabilitação',
		status: 'captacao',
		description:
			'O primeiro centro especializado em tratamento e reabilitação para pessoas em situação de dependência química na Guiné-Bissau.',
		shortDescription: 'Tratamento especializado com equipe multidisciplinar.',
		longDescription: `Nosso projeto principal consiste na construção de um centro de tratamento moderno e humanizado. 
      Com o terreno já adquirido em 2023, estamos na fase de captação de recursos para iniciar a construção.
      
      O centro será equipado com:
      • Dormitórios para até 20 pessoas
      • Áreas de convivência e lazer
      • Salas para atendimento individual e em grupo
      • Refeitório e cozinha industrial
      • Espaço para atividades terapêuticas`,
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
			role: 'Coordenadora Geral',
			email: 'projeto@dimipabos.org',
			phone: '+31 631 791 165',
		},
	},
	// {
	//   id: 'programa-terapeutico',
	//   name: 'programa-terapeutico',
	//   title: 'Programa Terapêutico',
	//   status: 'planejamento',
	//   description:
	//     'Programa estruturado de tratamento e acompanhamento para dependência química.',
	//   shortDescription: 'Tratamento intensivo e acompanhamento personalizado.',
	//   longDescription: `Nosso programa terapêutico é estruturado para oferecer um tratamento completo e personalizado.

	//     O programa inclui:
	//     • Avaliação inicial detalhada
	//     • Plano de tratamento individualizado
	//     • Terapias individuais e em grupo
	//     • Acompanhamento familiar
	//     • Prevenção de recaídas`,
	//   location: 'Bissau, Guiné-Bissau',
	//   startDate: '2024',
	//   capacity: '15 pessoas',
	//   image:
	//     'https://res.cloudinary.com/dg0lp0ga7/image/upload/v1738606249/recup_utpsyv.jpg',
	//   images: [],
	//   team: ['Psicólogos especializados', 'Terapeutas', 'Assistentes sociais'],
	//   contact: {
	//     name: 'João Silva',
	//     role: 'Coordenador Terapêutico',
	//     email: 'terapia@dimipabos.org',
	//     phone: '+245 123 456 789',
	//   },
	// },
	// {
	//   id: 'monitoramento',
	//   name: 'monitoramento',
	//   title: 'Programa de Monitoramento',

	//   status: 'planejamento',
	//   description:
	//     'Sistema de acompanhamento contínuo para prevenção de recaídas e suporte pós-tratamento.',
	//   shortDescription: 'Acompanhamento contínuo para prevenção de recaídas.',
	//   longDescription: `O programa de monitoramento é fundamental para garantir a continuidade do tratamento e prevenir recaídas.

	//     Principais aspectos:
	//     • Acompanhamento regular
	//     • Suporte 24/7
	//     • Grupos de apoio
	//     • Orientação familiar
	//     • Reinserção social`,
	//   location: 'Bissau, Guiné-Bissau',
	//   startDate: '2024',
	//   capacity: '30 pessoas',
	//   image:
	//     'https://res.cloudinary.com/dg0lp0ga7/image/upload/v1738606249/recup_utpsyv.jpg',
	//   images: [],
	//   team: ['Psicólogos', 'Assistentes sociais', 'Monitores especializados'],
	//   contact: {
	//     name: 'Maria Santos',
	//     role: 'Coordenadora de Monitoramento',
	//     email: 'monitoramento@dimipabos.org',
	//     phone: '+245 123 456 789',
	//   },
	// },
]
